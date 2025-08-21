// Copyright 2021 Battelle Energy Alliance

using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Emit;
using System.Diagnostics;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Diagnostics.Tracing;
using Newtonsoft.Json.Schema.Generation;

namespace ScriptEngineNS
{
  public class ScriptEngine
  {
    const String domain = "UserScript";
    public enum Languages { CSharp };
    public Languages language;
    private string assemblyName = "TestClass";
    private object evaluator = null;
    private Type evaluatorType = null;
    Assembly assembly = null;
    CSharpCompilation compilation = null;
    EmitResult compResult = null;
    private string source;
    string variables, variables1;
    string code;
    public List<string> messages = new List<string>();
    public List<string> addAssemblies = new List<string>() { "MathNet.Numerics.dll" };
    public List<string> addUsing = new List<string>();
    public string preClassInfo = "";
    public string curDir = "";


    public ScriptEngine(Languages language, string code = "", string curDir = "")
    {
      this.language = language;
      this.code = code;
      this.variables = "";
      this.curDir = curDir;
    }
    
    public string Code
    {
      get { return code; }
      set { code = value; }
    }

    public void AddConstant(string ConstName, Type dType, object value)
    {
      switch (language)
      {
        case Languages.CSharp:
          variables += "private const " + dType.Name + " " + ConstName + " = " + Convert.ChangeType(value, dType).ToString() + ";\r\n";
          break;
      }
    }

    public void AddVariable(string VariableName, Type dType)
    {
      switch (language)
      {
        case Languages.CSharp:
          string dfltVal = "";
          switch (dType.Name.ToUpper().Substring(0, 4))
          {
            case "INT":
            case "INT3":
            case "DOUB":
              dfltVal = "0";
              break;
            case "BOOL":
              dfltVal = "false";
              break;
            case "STRI":
              dfltVal = "\"\"";
              break;
            case "TIME":
              dfltVal = "TimeSpan.FromTicks(0)";
              break;
            default:
              dfltVal = "null";
              break;
          }
          variables += dType.Name + " " + VariableName + " = " + dfltVal + ";\r\n";
          variables += "public void Set" + VariableName + "(" + dType.Name + " x) { " + VariableName + " = x; }\r\n";
          break;
      }
    }

    public void SetVariable(string VariableName, Type dType, object Value)
    {
      try
      {
        object o = evaluatorType.InvokeMember(
                    "Set" + VariableName,
                    BindingFlags.InvokeMethod,
                    null,
                    evaluator,
                    new object[] { Convert.ChangeType(Value, dType) }
                 );
      }
      catch (Exception e)
      {
        throw new Exception("Failed to assign \"" + Value.ToString() + "\" to Variable \"" + VariableName + "\", check the types are correct");
      }
    }


    public bool Compiled()
    {
      return ((compResult != null) && (compResult.Success));
    }

    public bool Compile(Type dType)
    {
      string typeStr = dType.Name;
      if (typeStr.Substring(0, 4) == "List")
      {
        typeStr = "List<string>";
      }
      if (typeStr.Substring(0, 4) == "Void")
      {
        typeStr = "void";
      }
      //Add using statements here
      source = "namespace UserScript\r\n{\r\nusing System;\r\n" +
               "using System.IO;\r\n" +
               "using System.Collections.Generic;\r\n" +
               "using MathNet.Numerics.Distributions;\r\n" +
               "using Newtonsoft.Json.Linq;\r\n" +
               "using Newtonsoft.Json;\r\n";
      
      foreach(string s in addUsing)
        source = source + "using " + s + ";\r\n";

      source = source + 
               "public class " + assemblyName + "\r\n{\r\n" +
              variables + preClassInfo + "\r\npublic " + typeStr + " Eval()\r\n{\r\n";
      int realLn0 = source.Count(c => c.Equals('\n')) + 1;
      if (curDir != "")
      {
        string escCurDir = curDir.Replace(@"\", @"\\"); // Escape backslashes
        source = source + "Directory.SetCurrentDirectory(\"" + escCurDir + "\");\r\n"; //set the current path to the model directory if given
      }
      source = source + code;
      source += "\r\n\r\n}\r\n}\r\n}";
      //File.WriteAllText("WriteText" + assemblyName + ".txt", source);

      SyntaxTree syntaxTree = CSharpSyntaxTree.ParseText(source);
      var references = new List<MetadataReference>();
      ////Load project libraries
      List<string> added = new List<string>();
      var assemblies = AppDomain.CurrentDomain
                      .GetAssemblies()
                      .Where(a => !a.IsDynamic)
                      .Select(a => a.Location);

      var necessaryAssemblies = new List<string>()
      {
          "System.Runtime.dll",  // For Object, Decimal, and general running
          "Newtonsoft.Json.dll", // Newtonsoft stuff
          "System.Console.dll", // For Writing to Console
          "System.Private.CoreLib.dll", // For Object, Int32, String, List, etc.
          "netstandard.dll" // Also for Object
      };
      foreach (var item in assemblies)
      {
        if (necessaryAssemblies.Any(x => item.Contains(x)) && File.Exists(item))
        {
          references.Add(MetadataReference.CreateFromFile(item));
          added.Add(Path.GetFileName(item));
        }
      }
      foreach (var addLib in addAssemblies)
      {
        string appPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        if (!added.Contains(addLib))
        {
          references.Add(MetadataReference.CreateFromFile(appPath + Path.DirectorySeparatorChar + addLib));
        }      
      }     

      compilation = CSharpCompilation.Create(
          assemblyName,
          new[] { syntaxTree },
          references,
          new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

      using (var memoryStream = new MemoryStream())
      {
        EmitResult result = compilation.Emit(memoryStream);

        if (result.Success)
        {
          memoryStream.Seek(0, SeekOrigin.Begin);
          assembly = Assembly.Load(memoryStream.ToArray());
          evaluatorType = assembly.GetType(domain + "." + assemblyName);
          evaluator = Activator.CreateInstance(evaluatorType);
          return true;
        }
        else
        {
          for (int i = 0; i < result.Diagnostics.Length; i++)
          {
            string loc = result.Diagnostics[i].ToString();
            loc = loc.Trim( '(', ')');
            int line = -1;
            try
            {
              string sLine = loc.Split(',')[0];
              line = Convert.ToInt32(sLine);
              line = line - realLn0;
            }
            catch { }

            messages.Add("Ln(" + line + ") " + result.Diagnostics[i].GetMessage());
          }
          return false;
        }
      }
    }

    public object EvaluateGeneric()
    {
      try
      {
        object o = evaluatorType.InvokeMember(
                    "Eval",
                    BindingFlags.InvokeMethod,
                    null,
                    evaluator,
                    new object[] { }
                 );
        return o;
      }
      catch (Exception e)
      {
        string errorStr = " Failed to execute code for -" + this.assemblyName + ".code - " + this.code;
        if (e.InnerException != null)
        {
          errorStr = e.InnerException.Message + errorStr;
        }
        NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
        logger.Info(errorStr);
        throw new Exception(errorStr);
      }
    }

    public double Evaluate()
    {
      return (double)EvaluateGeneric();
    }

    public string EvaluateString()
    {
      return (string)EvaluateGeneric();
    }

    public List<string> EvaluateStrList()
    {

      return (List<string>)EvaluateGeneric();
    }

    public bool EvaluateBool()
    {
      return (bool)EvaluateGeneric();
    }
  }
}

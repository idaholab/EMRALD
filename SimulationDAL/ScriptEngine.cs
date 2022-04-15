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

namespace ScriptEngineNS
{
  public class ScriptEngine
  {
    const String domain = "UserScript";
    public enum Languages { CSharp };
    public Languages language;
    private string assemblyName = "";
    private object evaluator = null;
    private Type evaluatorType = null;
    Assembly assembly = null;
    CSharpCompilation compilation = null;
    EmitResult compResult = null;
    private string source;
    string variables, variables1;
    string code;
    public List<string> messages = new List<string>();


    public ScriptEngine(string name, Languages language, string code = "")
    {
      this.assemblyName = name;
      this.language = language;
      this.code = code;
      this.variables = "";
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
               "using Newtonsoft.Json;\r\n" +
               "public class " + assemblyName + "\r\n{\r\n" +
              variables + "\r\npublic " + typeStr + " Eval()\r\n{\r\n";
      int realLn0 = source.Count(c => c.Equals('\n')) + 1;
      source = source + code + "\r\n\r\n}\r\n}\r\n}";

      SyntaxTree syntaxTree = CSharpSyntaxTree.ParseText(source);
      var references = new List<MetadataReference>();
      ////Load project libraries
      List<string> added = new List<string>();
      var assemblies = AppDomain.CurrentDomain
                      .GetAssemblies()
                      .Where(a => !a.IsDynamic)
                      .Select(a => a.Location);
      foreach (var item in assemblies)
      {
        if (!item.Contains("xunit") && (item != "") && File.Exists(item)) 
        {
          references.Add(MetadataReference.CreateFromFile(item));
          added.Add(Path.GetFileName(item));
        }
      }
      if (!added.Contains("MathNet.Numerics.dll"))
      {
        string appPath = System.IO.Directory.GetCurrentDirectory();
        references.Add(MetadataReference.CreateFromFile(appPath + Path.DirectorySeparatorChar + "MathNet.Numerics.dll"));
      }

      ////or specify the libraries to load.

      //var coreDir = Directory.GetParent(typeof(Enumerable).GetTypeInfo().Assembly.Location);
      //var exeDir = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
      //references.Add(MetadataReference.CreateFromFile(typeof(Object).GetTypeInfo().Assembly.Location));
      //references.Add(MetadataReference.CreateFromFile(typeof(Uri).GetTypeInfo().Assembly.Location));
      //references.Add(MetadataReference.CreateFromFile(coreDir.FullName + Path.DirectorySeparatorChar + "mscorlib.dll"));
      //references.Add(MetadataReference.CreateFromFile(coreDir.FullName + Path.DirectorySeparatorChar + "System.Runtime.dll"));
      //if (File.Exists(exeDir + "\\Newtonsoft.Json.dll"))
      //  references.Add(MetadataReference.CreateFromFile(exeDir + "\\Newtonsoft.Json.dll"));
      //else
      //  throw new Exception("Missing newtonsoft DLL");


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

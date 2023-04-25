using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Hunter.Hra;
using Hunter.Psf;
using Hunter.Hra.Distributions;
using static Hunter.ExpGoms.ExpressiveGoms;
using System.Collections;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace Hunter.ExpGoms
{
    public class ExpressiveGoms
    {
        public abstract class StackItem {
            abstract public TokenType Type { get; }

            abstract public double YieldNumber(HRAEngine hraEngine);
        }

        public class Group : StackItem
        {
            public override TokenType Type => TokenType.Group;

            public List<StackItem> Items { get; set; }

            public Group(List<StackItem> items)
            {
                Items = items;
            }

            public override double YieldNumber(HRAEngine hraEngine = null)
            {
                return EvaluatePostfixExpression(Items, hraEngine);
            }
        }

        public class Number : StackItem
        {
            public override TokenType Type => TokenType.Number;

            public double Value { get; set; }

            public Number(double value)
            {
                Value = value;
            }

            public override double YieldNumber(HRAEngine hraEngine)
            {
                return Value;
            }
        }

        public enum TokenType
        {
            Primitive,
            Operator,
            GroupOperator,
            Comma,
            Number,
            Whitespace,
            Group
        }

        public enum OperatorType
        {
            Plus,
            Minus,
            Multiply,
            Min,
            Max,
            NormalRV,
            LognormalRV,
            ExpoRV
        }

        public enum GroupOperatorType
        {
            Parallel,
            Synchronize,
            Repeat
        }

        public class Token : StackItem
        {
            public override TokenType Type { get; }
            public string Value { get; set; }
            public OperatorType? Operator { get; set; }
            public GroupOperatorType? GroupOperator { get; set; }

            public Token(TokenType type, string value)
            {
                Type = type;
                Value = value;

                if (type == TokenType.Operator)
                {
                    switch (value)
                    {
                        case "+":
                            Operator = OperatorType.Plus;
                            break;
                        case "-":
                            Operator = OperatorType.Minus;
                            break;
                        case "*":
                            Operator = OperatorType.Multiply;
                            break;
                        case "_min":
                            Operator = OperatorType.Min;
                            break;
                        case "_max":
                            Operator = OperatorType.Max;
                            break;
                        case "_normal_rv":
                            Operator = OperatorType.NormalRV;
                            break;
                        case "_lognormal_rv":
                            Operator = OperatorType.LognormalRV;
                            break;
                        case "_expo_rv":
                            Operator = OperatorType.ExpoRV;
                            break;
                        default:
                            throw new ArgumentException($"Invalid operator value: {value}");
                    }
                }
                else if (type == TokenType.GroupOperator)
                {
                    switch (value)
                    {
                        case "_parallel":
                            GroupOperator = GroupOperatorType.Parallel;
                            break;
                        case "_synchronize":
                            GroupOperator = GroupOperatorType.Synchronize;
                            break;
                        case "_repeat":
                            GroupOperator = GroupOperatorType.Repeat;
                            break;
                        default:
                            throw new ArgumentException($"Invalid group operator value: {value}");
                    }
                }
            }

            public static Token FromNumber(double number)
            {
                return new Token(TokenType.Number, number.ToString());
            }

            public static Token FromNumber(string number)
            {
                return new Token(TokenType.Number, number);
            }

            public HRAEngine.Primitive ToPrimitive(HRAEngine hraEngine)
            {
                if (Type != TokenType.Primitive)
                {
                    throw new InvalidOperationException($"Cannot convert token of type {Type} to primitive.");
                }
                return hraEngine.GetPrimitiveById(Value);
            }

            public double YieldNumber()
            {
                if (Type == TokenType.Number)
                {
                    return double.Parse(Value);
                }
                else
                {
                    throw new InvalidOperationException($"Cannot yield number from {Type}.");
                }
            }

            public override double YieldNumber(HRAEngine hraEngine)
            {
                if (Type == TokenType.Number)
                {
                    return double.Parse(Value);
                }
                else if (Type == TokenType.Primitive)
                {
                    bool? success = true;
                    double elapsed_time = hraEngine.EvaluatePrimitive(ToPrimitive(hraEngine), ref success);
                    hraEngine.StepSuccess = success;
                    return elapsed_time;
                }
                else
                {
                    throw new InvalidOperationException($"Cannot yield number from {Type}.");
                }
            }
        }

        public static string Preprocess(string input)
        {
            int openParenCount = 0;
            var sb = new StringBuilder();

            foreach (char c in input)
            {
                if (c == '(')
                {
                    openParenCount++;
                }
                else if (c == ')')
                {
                    if (openParenCount > 0)
                    {
                        openParenCount--;
                    }
                    else
                    {
                        throw new InvalidOperationException("Mismatched parentheses in input.");
                    }
                }
                else if (openParenCount == 0)
                {
                    sb.Append(c);
                }
            }

            if (openParenCount != 0)
            {
                throw new InvalidOperationException("Mismatched parentheses in input.");
            }

            // trim, convert to string, and normalize whitespace
            return Regex.Replace(sb.ToString().Trim(), @"\s+", " ");
        }

        public static string ExpressionFromTokens(List<Token> tokens)
        {
            var tokenStrings = new List<string>();

            foreach (var token in tokens)
            {
                string tokenString;
                switch (token.Type)
                {
                    case TokenType.Primitive:
                    case TokenType.Operator:
                        tokenString = token.Value;
                        break;
                    case TokenType.Number:
                        tokenString = token.Value.ToString();
                        break;
                    case TokenType.GroupOperator:
                        tokenString = ",";
                        break;
                    default:
                        throw new InvalidOperationException($"Unexpected token type: {token.Type}");
                }

                tokenStrings.Add(tokenString);
            }

            return string.Join(" ", tokenStrings);
        }

        public static List<Token> Tokenize(string input)
        {
            foreach (char c in "+-*,")
            {
                input = input.Replace(c.ToString(), $" {c} ");
            }

            List<string> strings = new List<string>(input.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries));

            List<Token> tokens = new List<Token>();
            foreach (string s in strings)
            {
                tokens.Add(new Token(GetTokenType(s), s));
            }
            return tokens;
        }


        private static TokenType GetTokenType(string currentToken)
        {
            char c = currentToken[0];
            double number;

            if (char.IsWhiteSpace(c))
            {
                return TokenType.Whitespace;
            }
            else if (Double.TryParse(currentToken, out number))
            {
                return TokenType.Number;
            }
            else if (char.IsDigit(c))
            {
                throw new InvalidOperationException($"Unknown TokenType: {currentToken}");
            }
            else if (c == '_')
            {
                if (currentToken.Contains("parallel") || currentToken.Contains("synchronize") || currentToken.Contains("repeat"))
                {
                    return TokenType.GroupOperator;
                }
                else
                {
                    return TokenType.Operator;
                }
            }
            else if (c == '+' || c == '-' || c == '*')
            {
                return TokenType.Operator;
            }
            else if (c == ',')
            {
                return TokenType.Comma;
            }
            else
            {
                return TokenType.Primitive;
            }
        }

        public static double EvaluatePostfixExpression(List<Token> tokens, HRAEngine hraEngine)
        {
            return EvaluatePostfixExpression(tokens.OfType<StackItem>().ToList(), hraEngine);
        }

        public static double EvaluatePostfixExpression(List<StackItem> tokens, HRAEngine hraEngine)
        {
            var stack = new Stack<StackItem>();

            foreach (var token in tokens)
            {
                if (token.Type == TokenType.Comma)
                {
                    ProcessComma(stack);
                }
                else if (token.Type == TokenType.Primitive || 
                    token.Type == TokenType.Number || 
                    token.Type == TokenType.Group)
                {
                    stack.Push(token);
                }
                else if (token.Type == TokenType.Operator)
                {
                    ProcessOperator(stack, (Token)token, hraEngine);
                }
                else if (token.Type == TokenType.GroupOperator)
                {
                    ProcessGroupOperator(stack, (Token)token, hraEngine);
                }
            }

            return SumStack(stack, hraEngine);
        }

        private static void ProcessOperator(Stack<StackItem> stack, Token token, HRAEngine hraEngine)
        {
            if (token.Operator == null)
            {
                throw new ArgumentException("The provided token is not an operator.");
            }

            double PopNumber()
            {
                return stack.Pop().YieldNumber(hraEngine);
            }

            double num1, num2;

            switch (token.Operator.Value)
            {
                case OperatorType.Plus:
                    num2 = PopNumber();
                    num1 = PopNumber();
                    stack.Push(new Number(num1 + num2));
                    break;
                case OperatorType.Minus:
                    num2 = PopNumber();
                    num1 = PopNumber();
                    stack.Push(new Number(num1 - num2));
                    break;
                case OperatorType.Multiply:
                    num2 = PopNumber();
                    num1 = PopNumber();
                    stack.Push(new Number(num1 * num2));
                    break;
                case OperatorType.Min:
                    num2 = PopNumber();
                    num1 = PopNumber();
                    stack.Push(new Number(Math.Min(num1, num2)));
                    break;
                case OperatorType.Max:
                    num2 = PopNumber();
                    num1 = PopNumber();
                    stack.Push(new Number(Math.Max(num1, num2)));
                    break;
                case OperatorType.NormalRV:
                    num2 = PopNumber();
                    num1 = PopNumber();
                    stack.Push(new Number(NormalDistributionHandler.SampleNormalTime(num1, num2)));
                    break;
                case OperatorType.LognormalRV:
                    num2 = PopNumber();
                    num1 = PopNumber();
                    stack.Push(new Number(LognormalDistributionHandler.SampleLognormalTime(num1, num2)));
                    break;
                case OperatorType.ExpoRV:
                    num1 = PopNumber();
                    stack.Push(new Number(ExponentialDistributionHandler.SampleExponentialTime(num1)));
                    break;
                default:
                    throw new ArgumentException($"Invalid OperatorType value: {token.ToString()}");
            }
        }

        internal static void ProcessComma(Stack<StackItem> stack)
        {
            // When a comma is encountered, process the stack to create a group, and push the group back onto the stack as a single item
            List<StackItem> newList = new List<StackItem>();

            while (stack.Count > 0 && stack.Peek().Type != TokenType.Group)
            {
                newList.Add(stack.Pop());
            }

            if (newList.Count > 0)
            {
                newList.Reverse(); // Reverse the list to maintain the order of items
                Group newGroup = new Group(newList);
                stack.Push(newGroup);
            }
        }

        private static void ProcessGroupOperator(Stack<StackItem> stack, Token token, HRAEngine hraEngine)
        {
            // GroupOperator is token, It hasn't been pushed to stack

            // Call ProcessComma to make the last group
            ProcessComma(stack);

            List<double> times = new List<double>();


            // Switch on the group operator
            switch (token.GroupOperator)
            {
                case GroupOperatorType.Repeat:

                    // With repeat the last group specifies the number of repeats
                    Group group = (Group)stack.Pop();
                    int numRepeat = (int)group.YieldNumber();

                    var goms = stack.Pop();
                    for (int i = 0; i < numRepeat; i++)
                    {
                        // Evaluate to number here to avoid nesting Groups into Groups.
                        stack.Push(Token.FromNumber(goms.YieldNumber(hraEngine)));
                    }
                    break;
                case GroupOperatorType.Parallel:
                    times.Clear();
                    while (stack.Count > 0)
                    {
                        times.Add(stack.Pop().YieldNumber(hraEngine));
                    }
                    stack.Push(Token.FromNumber(times.Max()));
                    break;
                case GroupOperatorType.Synchronize:
                    if (!stack.Any())
                    {
                        // Handle the case when the stack is empty
                        throw new InvalidOperationException("The stack is empty.");
                    }

                    int firstGroupItemCount = (stack.Peek() as Group).Items.Count;

                    if (stack.OfType<Group>().Count() != stack.Count || !stack.All(item => ((Group)item).Items.Count == firstGroupItemCount))
                    {
                        // The stack contains items that are not Groups or have different Item.Count values
                        throw new InvalidOperationException("The stack must contain only Group items with the same Item.Count.");
                    }

                    // Convert the stack to a list to access elements by index
                    List<StackItem> itemList = stack.ToList();

                    // Iterate over the items by index
                    double sum = 0;
                    stack.Clear();
                    for (int i = 0; i < ((Group)itemList[0]).Items.Count; i++)
                    {
                        times.Clear();
                        for (int j = 0; j < itemList.Count; j++)
                        {
                            times.Add(((Group)itemList[j]).Items[i].YieldNumber(hraEngine));
                        }
                        sum += times.Max();
                    }
                    stack.Push(Token.FromNumber(sum));

                    break;
                default:
                    throw new ArgumentException($"Invalid GroupOperator value: {token.ToString()}");
            }
        }

        private static double SumStack(Stack<StackItem> stack, HRAEngine hraEngine)
        {
            double sum = 0;
            while (stack.Count > 0)
            {
                StackItem token = stack.Pop();
                sum += token.YieldNumber(hraEngine);
            }

            return sum;
        }
    }
}

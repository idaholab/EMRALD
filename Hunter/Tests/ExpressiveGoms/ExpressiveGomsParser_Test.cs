using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hunter.ExpGoms;
using static Hunter.ExpGoms.ExpressiveGoms;
using Hunter.Hra;
using Hunter.Model;
using CommonDefLib;
using System.Collections;

namespace Hunter.Tests.GomsParser
{
    [TestFixture]
    public class GomsParserTests
    {
        [TestCase("(Operator A) Ac1 Cc Rc + + (Operator B) Ac2 Cf Rf", "Ac1 Cc Rc + + Ac2 Cf Rf")]
        [TestCase("(This is a comment) Ac Cc Rc + + (Another comment) Ac Cf Rf", "Ac Cc Rc + + Ac Cf Rf")]
        [TestCase("(Whitespace is removed) Ac\tCc Rc + +\r\n(Only outer) Ac Cf Rf", "Ac Cc Rc + + Ac Cf Rf")]
        public void TestPreprocess(string input, string expectedOutput)
        {
            string result = ExpressiveGoms.Preprocess(input);
            Assert.AreEqual(expectedOutput, result);
        }

        [Test]
        public void TestPreprocess_MismatchedParentheses_ThrowsException()
        {
            string input = "(Operator A) Ac1 Cc Rc + + (Operator B Ac2 Cf Rf";
            Assert.Throws<InvalidOperationException>(() => ExpressiveGoms.Preprocess(input));
        }

        [Test]
        public void TestTokenize()
        {
            string input = "(Operator A) Ac1 Cc Rc + + (Operator B) Ac2 Cf Rf 2 2";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            Assert.AreEqual(tokens.Count, 10);
        }


        [Test]
        public void TestTokenizeComma1()
        {
            string input = "(Operator A) Ac1 Cc Rc Df 3 , (Operator B) Ac2 Cf Rf 2 2";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            Assert.AreEqual(tokens.Count, 11);
        }

        [Test]
        public void TestEvaluateComma1()
        {
            string input = "1 2 3 , 4 5 6 , 7";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);

            Stack<StackItem> stack = new Stack<StackItem>();
            foreach (Token token in tokens)
            {
                stack.Push(token);

                if (token.Type == TokenType.Comma)
                {
                    ExpressiveGoms.ProcessComma(stack);
                }
            }

            Assert.AreEqual(stack.Count, 3);
        }

        [Test]
        public void TestEvaluateRepeat()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "1 2 3 , 4 _repeat";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);

            Assert.AreEqual(elapsedTime, 24);
        }

        [Test]
        public void TestEvaluateRepeat2()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "1 2 3 , 2 _repeat , 2 _repeat";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);

            Assert.AreEqual(elapsedTime, 24);
        }


        [Test]
        public void TestEvaluateParallel()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "1 2 1 2 , 2 1 2 2 _parallel";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);

            Assert.AreEqual(elapsedTime, 7);
        }

        [Test]
        public void TestEvaluateSynchronize()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "1 2 1 2 , 2 1 2 1 _synchronize";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);

            Assert.AreEqual(elapsedTime, 8);
        }

        [Test]
        public void TestGroupTokens()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "2 2 _normal_rv , 4 _repeat";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);

            Assert.AreEqual(12.95638760517252d, elapsedTime);
        }


        [Test]
        public void TestEvaluate_implicit_sum()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "2 2";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);
            Assert.AreEqual(elapsedTime, 4);
        }

        [Test]
        public void TestEvaluate_multiply()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "2 3 *";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);
            Assert.AreEqual(elapsedTime, 6);
        }

        [Test]
        public void TestEvaluate_min()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "2 3 _min";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);
            Assert.AreEqual(elapsedTime, 2);
        }

        [Test]
        public void TestEvaluate_max()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();

            string input = "2 3 _max";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);
            Assert.AreEqual(elapsedTime, 3);
        }

        [Test]
        public void TestEvaluate_lognormal()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();
            string input = "2 3 _lognormal_rv";
            string result = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(result);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);
            Assert.AreEqual(elapsedTime, 2.173715467135704d, 0.0001);
        }

        [Test]
        public void TestEvaluatePostfixExpressionSimple()
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();
            string input = "Ac Cc Rc + + Ac Cf Rf + +";
            string preprocessedInput = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(preprocessedInput);

            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);
            Assert.AreEqual(11.362145521415897d, elapsedTime, 1e-6);
        }


        [TestCase("Ac Cc Rc + + Ac Cf Rf + +", 11.362145521415897d)] 
        [TestCase("5 2 * _expo_rv", 1.2331634513890486d)] 
        public void TestEvaluatePostfixExpression(string input, double expectedElapsedTime)
        {
            SingleRandom.Reset();
            ConfigData.seed = 1234;

            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();
            string preprocessedInput = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(preprocessedInput);
            double elapsedTime = ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine);
            Assert.AreEqual(expectedElapsedTime, elapsedTime, 1e-3);
        }

        [Test]
        public void TestEvaluatePostfixExpression_MissingOperand_ThrowsException()
        {
            HRAEngine hraEngine = HunterFactory.CreateExpertOperator();
            string input = "Ac Cc Rc + + + + Ac Cf Rf";
            string preprocessedInput = ExpressiveGoms.Preprocess(input);
            List<Token> tokens = ExpressiveGoms.Tokenize(preprocessedInput);
            Assert.Throws<InvalidOperationException>(() => ExpressiveGoms.EvaluatePostfixExpression(tokens, hraEngine));
        }

    }
}

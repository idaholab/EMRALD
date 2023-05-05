using Hunter.Hra;
using NUnit.Framework;

namespace Hunter.Tests.HumanReliabilityAnalysisEngine
{
    [TestFixture]
    public class EvalStateTests
    {
        [Test]
        public void TestEvalStateAndOperator()
        {
            TestEvalStateAnd(EvalState.None, EvalState.None, EvalState.None);
            TestEvalStateAnd(EvalState.None, EvalState.Success, EvalState.Success);
            TestEvalStateAnd(EvalState.None, EvalState.HumanErrorFailure, EvalState.HumanErrorFailure);
            TestEvalStateAnd(EvalState.None, EvalState.OutOfTimeFailure, EvalState.OutOfTimeFailure);
            TestEvalStateAnd(EvalState.None, EvalState.OnRepeatFailure, EvalState.OnRepeatFailure);
            TestEvalStateAnd(EvalState.None, EvalState.MultipleFailure, EvalState.MultipleFailure);
            TestEvalStateAnd(EvalState.Success, EvalState.Success, EvalState.Success);
            TestEvalStateAnd(EvalState.Success, EvalState.HumanErrorFailure, EvalState.HumanErrorFailure);
            TestEvalStateAnd(EvalState.Success, EvalState.OutOfTimeFailure, EvalState.OutOfTimeFailure);
            TestEvalStateAnd(EvalState.Success, EvalState.OnRepeatFailure, EvalState.OnRepeatFailure);
            TestEvalStateAnd(EvalState.Success, EvalState.MultipleFailure, EvalState.MultipleFailure);
            TestEvalStateAnd(EvalState.HumanErrorFailure, EvalState.HumanErrorFailure, EvalState.HumanErrorFailure);
            TestEvalStateAnd(EvalState.HumanErrorFailure, EvalState.OutOfTimeFailure, EvalState.MultipleFailure);
            TestEvalStateAnd(EvalState.HumanErrorFailure, EvalState.OnRepeatFailure, EvalState.MultipleFailure);
            TestEvalStateAnd(EvalState.HumanErrorFailure, EvalState.MultipleFailure, EvalState.MultipleFailure);
            TestEvalStateAnd(EvalState.OutOfTimeFailure, EvalState.OutOfTimeFailure, EvalState.OutOfTimeFailure);
            TestEvalStateAnd(EvalState.OutOfTimeFailure, EvalState.OnRepeatFailure, EvalState.MultipleFailure);
            TestEvalStateAnd(EvalState.OutOfTimeFailure, EvalState.MultipleFailure, EvalState.MultipleFailure);
            TestEvalStateAnd(EvalState.OnRepeatFailure, EvalState.OnRepeatFailure, EvalState.OnRepeatFailure);
            TestEvalStateAnd(EvalState.OnRepeatFailure, EvalState.MultipleFailure, EvalState.MultipleFailure);
            TestEvalStateAnd(EvalState.MultipleFailure, EvalState.MultipleFailure, EvalState.MultipleFailure);
        }

        private void TestEvalStateAnd(EvalState a, EvalState b, EvalState expected)
        {
            Assert.AreEqual(expected, a & b);
            Assert.AreEqual(expected, b & a); // Test the commutative property
        }
    }
}

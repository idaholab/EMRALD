using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter.Hra
{
    /// <summary>
    /// Represents the evaluated state of Hunter.HRAEngine as a pseudo enumeration.
    /// </summary>
    public struct EvalState
    {
        /// <summary>
        /// The integer value associated with the EvalState.
        /// </summary>
        public int Value;

        /// <summary>
        /// Represents an undefined evaluation state.
        /// </summary>
        public static readonly EvalState None = new EvalState(-1);

        /// <summary>
        /// Represents a successful evaluation state.
        /// </summary>
        public static readonly EvalState Success = new EvalState(0);

        /// <summary>
        /// Represents an evaluation state where HEP is greater than one.
        /// </summary>
        public static readonly EvalState HepGtOneFailure = new EvalState(1);

        /// <summary>
        /// Represents an evaluation state where a human error occurred.
        /// </summary>
        public static readonly EvalState HumanErrorFailure = new EvalState(2);

        /// <summary>
        /// Represents an evaluation state where the evaluation timed out.
        /// </summary>
        public static readonly EvalState OutOfTimeFailure = new EvalState(3);

        /// <summary>
        /// Represents an evaluation state where the evaluation repeated until maxRepeatCount.
        /// </summary>
        public static readonly EvalState OnRepeatFailure = new EvalState(4);

        /// <summary>
        /// Represents an evaluation state where multiple failures occurred.
        /// </summary>
        public static readonly EvalState MultipleFailure = new EvalState(5);

        public EvalState(int value)
        {
            if (value < -1 || value > 5)
                throw new ArgumentOutOfRangeException("value");

            Value = value;
        }

        public static EvalState FromBool(bool success, EvalState? nullableDefaultFailureState = null)
        {
            if (success)
            {
                return Success;
            }
            else
            {
                return nullableDefaultFailureState.HasValue ? nullableDefaultFailureState.Value : HumanErrorFailure;
            }
        }

        public static EvalState operator &(EvalState a, EvalState b)
        {
            if (a == b)
            {
                return a;
            }
            else if (a == None && b != None)
            {
                return b;
            }
            else if (a != None && b == None)
            {
                return a;
            }
            else if (a == Success && (b == HumanErrorFailure || b == OutOfTimeFailure || b == OnRepeatFailure || b == HepGtOneFailure))
            {
                return b;
            }
            else if ((a == HumanErrorFailure || a == OutOfTimeFailure || a == OnRepeatFailure || a == HepGtOneFailure) && b == Success)
            {
                return a;
            }
            else // Both a and b are failures
            {
                if (a == Success && b == Success)
                {
                    throw new Exception("This shouldn't happen");
                }
                return MultipleFailure;
            }
        }

        public static bool operator ==(EvalState a, EvalState b)
        {
            return a.Value == b.Value;
        }

        public static bool operator !=(EvalState a, EvalState b)
        {
            return !(a == b);
        }

        public override bool Equals(object obj)
        {
            if (obj is EvalState other)
            {
                return Value == other.Value;
            }

            return false;
        }

        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }

        public override string ToString()
        {
            switch (Value)
            {
                case -1:
                    return "None";
                case 0:
                    return "Success";
                case 1:
                    return "HumanErrorFailure";
                case 2:
                    return "OutOfTimeFailure";
                case 3:
                    return "OnRepeatFailure";
                case 4:
                    return "MultipleFailure";
                default:
                    return $"Unknown({Value})";
            }
        }
    }
}

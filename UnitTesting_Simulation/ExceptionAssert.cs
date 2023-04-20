// Copyright 2021 Battelle Energy Alliance

using System;
using Xunit;

//using Microsoft.VisualStudio.TestTools.UnitTesting;

//modified from https://github.com/bbraithwaite/MSTestExtensions/blob/master/src/MSTestExtensions/ExceptionInheritanceOptions.cs
namespace UnitTesting_Simulation
{
  public enum ExceptionMessageCompareOptions
  {
    /// <summary>
    ///  Not Set.
    /// </summary>
    None,

    /// <summary>
    /// The exception message must exactly match to expected value.
    /// </summary>
    Exact,

    /// <summary>
    /// The exception message can contain partially match the expected value (useful for verbose exception messages).
    /// </summary>
    Contains,

    /// <summary>
    /// The case of the actual exception message against the expected will be ignored.
    /// </summary>
    IgnoreCase
  }

  public enum ExceptionInheritanceOptions
  {
    /// <summary>
    ///  Not Set.
    /// </summary>
    None,

    /// <summary>
    /// The exception type must be the exact type i.e. not a subtype.
    /// </summary>
    Exact,

    /// <summary>
    /// The exception type can still match if its inherited type matches the assertion.
    /// </summary>
    Inherits
  }

  /// <summary>
  /// Common methods used by Throws and ThrowsAsync methods for verifying exception properties.
  /// </summary>
  internal static class ExceptionAssert
  {
    /// <summary>
    /// Fails the test if no exception is thrown by the method under test.
    /// </summary>
    /// <typeparam name="T">The type of the expected exception.</typeparam>
    public static void OnNoExceptionThrown<T>() where T : Exception
    {
      if (typeof(T).Equals(new Exception().GetType()))
      {
        Assert.True(true, "Expected exception but no exception was thrown.");
      }
      else
      {
        Assert.True(true, string.Format("Expected exception of type {0} but no exception was thrown.", typeof(T)));
      }
    }

    /// <summary>
    /// The check exception.
    /// </summary>
    /// <param name="expectedMessage">The expected message.</param>
    /// <param name="messageOptions">The message options for specifying assertion rules for the exception message.</param>
    /// <param name="inheritOptions">The inherit options for specifying assertion rules for the exception type.</param>
    /// <param name="ex">The exception thrown by the method under test.</param>
    /// <typeparam name="T">The type of the expected exception.</typeparam>
    /// <returns>The <see cref="T"/>. Returns the exception instance.</returns>
    public static T CheckException<T>(string expectedMessage, ExceptionMessageCompareOptions messageOptions, ExceptionInheritanceOptions inheritOptions, Exception ex) where T : Exception
    {
      AssertExceptionType<T>(ex, inheritOptions);
      AssertExceptionMessage(ex, expectedMessage, messageOptions);
      return (T)ex;
    }

    /// <summary>
    /// Asserts that the exception type is an exact match i.e. not inherited.
    /// </summary>
    /// <param name="ex">The exception thrown by the method under test.</param>
    /// <typeparam name="T">The type of the expected exception.</typeparam>
    /// <remarks>
    /// E.g it's possible to clearly assert a type of ArgumentException without the assert passing when an ArgumentNullException is thrown.
    /// </remarks>
    private static void AssertExceptionNotInherited<T>(Exception ex)
    {
      Assert.True(!ex.GetType().IsSubclassOf(typeof(T)));
    }

    /// <summary>
    /// Asserts the type of the exception with the expected type (t0)
    /// </summary>
    /// <param name="ex">The exception thrown by the method under test.</param>
    /// <param name="inheritanceOptions">The options.</param>
    /// <typeparam name="T">The type of the expected exception.</typeparam>
    /// <exception cref="ArgumentOutOfRangeException">Throws exception for invalid or None option.</exception>
    private static void AssertExceptionType<T>(Exception ex, ExceptionInheritanceOptions inheritanceOptions)
    {
      Assert.IsType<T>(ex);
      ////Assert.IsInstanceOfType(ex, typeof(t0), "Expected exception type failed.");
      //switch (inheritanceOptions)
      //{
      //  case ExceptionInheritanceOptions.Exact:
      //    AssertExceptionNotInherited<t0>(ex);
      //  case ExceptionInheritanceOptions.Inherits:
      //    break;
      //  default:
      //    throw new ArgumentOutOfRangeException("inheritanceOptions");

      //}
    }

    /// <summary>
    /// Assert the message of the exception.
    /// </summary>
    /// <param name="ex">The exception thrown by the method under test.</param>
    /// <param name="expectedMessage">The expected message.</param>
    /// <param name="messageOptions">The message options for specifying assertion rules for the exception message.</param>
    /// <exception cref="ArgumentOutOfRangeException">Throws exception for invalid or None option.</exception>
    private static void AssertExceptionMessage(Exception ex, string expectedMessage, ExceptionMessageCompareOptions messageOptions)
    {
      if (!string.IsNullOrEmpty(expectedMessage))
      {
        switch (messageOptions)
        {
          case ExceptionMessageCompareOptions.Exact:
            Assert.Equal(expectedMessage, ex.Message);//, "Expected exception message failed.");
            break;

          case ExceptionMessageCompareOptions.IgnoreCase:
            Assert.Equal(expectedMessage, ex.Message, true);//, "Expected exception message failed.");
            break;

          case ExceptionMessageCompareOptions.Contains:
            Assert.True(ex.Message.Contains(expectedMessage), string.Format("Expected exception message does not contain <{0}>.", expectedMessage));
            break;

          default:
            throw new ArgumentOutOfRangeException("messageOptions");
        }
      }
    }
  }
}
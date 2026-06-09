// Copyright 2021 Battelle Energy Alliance
// Shared distribution parameter container and sampler used by both DistEvent (etDistribution events)
// and VarValueAct (atCngVarVal actions in distribution mode).

using System;
using System.Collections.Generic;
using MathNet.Numerics.Distributions;
using Newtonsoft.Json;

namespace SimulationDAL
{
  /// <summary>
  /// A single distribution parameter (Mean, Standard Deviation, Rate, Shape, Scale, Peak,
  /// Minimum, Maximum, etc.). The value can be either a literal constant or a reference to
  /// a SimVariable by name; the time rate is optional and falls back to the owning distribution's
  /// dfltTimeRate during deserialization.
  /// </summary>
  public class DistribParams
  {
    public string name { get; set; } = "";
    public string? variable { get; set; }
    public double? value { get; set; }
    public bool? useVariable { get; set; }
    public EnTimeRate timeRate { get; set; }
  }

  /// <summary>
  /// Container for a distribution definition (type, parameters, default time rate) plus the
  /// logic for resolving parameter values (constant or variable) and sampling. Used by both
  /// DistEvent and VarValueAct so that distribution behavior lives in one place.
  ///
  /// The <paramref name="useTimeRates"/> constructor flag controls whether parameter time rates
  /// are interpreted. DistEvent passes true (parameters represent durations, std/min/max are
  /// normalized to the dominant parameter's time rate, and Sample's "out timeRate" is meaningful).
  /// VarValueAct passes false (a sampled variable value is a raw unitless number, so dfltTimeRate
  /// is optional in JSON, per-parameter timeRate is ignored, and no conversions are performed).
  /// </summary>
  public class DistribInfo
  {
    private List<DistribParams> _dParams = new List<DistribParams>();
    private EnDistType _distType = EnDistType.dtNormal;
    private EnTimeRate _dfltTimeRate = EnTimeRate.trHours;
    private VariableList? _vars;
    private readonly bool _useTimeRates;

    public EnDistType distType { get { return _distType; } }
    public EnTimeRate dfltTimeRate { get { return _dfltTimeRate; } }
    public IReadOnlyList<DistribParams> parameters { get { return _dParams; } }
    public bool useTimeRates { get { return _useTimeRates; } }

    public DistribInfo(bool useTimeRates = true)
    {
      _useTimeRates = useTimeRates;
    }

    /// <summary>
    /// Returns the names of variables referenced by any useVariable parameter. Callers use this
    /// to validate references and register related items on the owning object.
    /// </summary>
    public IEnumerable<string> ReferencedVariableNames()
    {
      foreach (var p in _dParams)
      {
        bool uses = p.useVariable.GetValueOrDefault(false);
        if (uses && !string.IsNullOrEmpty(p.variable))
          yield return p.variable!;
      }
    }

    public bool UsesVariables()
    {
      foreach (var _ in ReferencedVariableNames())
        return true;
      return false;
    }

    /// <summary>
    /// Resolves variables in this distribution against the given variable list. Each useVariable
    /// parameter must point to a defined variable, otherwise an exception is thrown. Callers
    /// typically pass back the resolved SimVariables via the lookupResolved callback so that
    /// they can register related items.
    /// </summary>
    public void LoadVariableReferences(VariableList vars, System.Action<SimVariable>? onResolved = null)
    {
      _vars = vars;
      foreach (var p in _dParams)
      {
        if (p.useVariable.GetValueOrDefault(false) && !string.IsNullOrEmpty(p.variable))
        {
          SimVariable v = vars.FindByName(p.variable!);
          if (v == null)
            throw new Exception("Failed to find variable - " + p.variable);
          onResolved?.Invoke(v);
        }
      }
    }

    /// <summary>
    /// Builds the JSON for the distribution fields. The caller is responsible for placing this
    /// inside its own object literal. When the distribution is value-only (useTimeRates=false)
    /// the dfltTimeRate field is omitted since variable values have no time semantics.
    /// </summary>
    public string GetJSON()
    {
      string retStr = "\"distType\": \"" + _distType.ToString() + "\"";
      if (_useTimeRates)
      {
        retStr += "," + Environment.NewLine + "\"dfltTimeRate\": \"" + _dfltTimeRate.ToString() + "\"";
      }
      retStr += "," + Environment.NewLine + "\"parameters\":" + JsonConvert.SerializeObject(_dParams);
      return retStr;
    }

    /// <summary>
    /// Reads distType, dfltTimeRate (optional in value-only mode), and parameters from the given
    /// dynamic object. Caller must have already unwrapped any "Event"/"Action" envelope.
    /// </summary>
    public void Deserialize(dynamic dynObj)
    {
      try
      {
        _distType = (EnDistType)Enum.Parse(typeof(EnDistType), (string)dynObj.distType, true);
      }
      catch
      {
        throw new Exception("Failed to read distType - missing or unknown distribution type");
      }

      if (_useTimeRates)
      {
        try
        {
          _dfltTimeRate = (EnTimeRate)Enum.Parse(typeof(EnTimeRate), (string)dynObj.dfltTimeRate, true);
        }
        catch
        {
          throw new Exception("No \"dfltTimeRate\" defined");
        }
      }

      try
      {
        if (_useTimeRates)
        {
          foreach (var p in dynObj.parameters)
          {
            if (p.timeRate == null)
            {
              p.timeRate = _dfltTimeRate.ToString();
            }
          }
        }

        string paramsStr = Convert.ToString(dynObj.parameters);
        _dParams = JsonConvert.DeserializeObject<List<DistribParams>>(paramsStr)!;
      }
      catch
      {
        throw new Exception("parameters data missing or formatted incorrectly");
      }
    }

    /// <summary>
    /// Resolves each parameter to its current numeric value (literal or current variable value)
    /// and returns them keyed by parameter name. timeRate is preserved on each entry.
    /// </summary>
    private Dictionary<string, DistribParams> ResolveParameters()
    {
      if (_vars == null)
        throw new Exception("Distribution variable list has not been loaded - call LoadVariableReferences first");

      Dictionary<string, DistribParams> resolved = new Dictionary<string, DistribParams>();
      foreach (DistribParams p in _dParams)
      {
        double? val = null;
        // NOTE: Matches the legacy DistEvent behavior - useVariable==null is treated as true
        // so existing models without an explicit useVariable flag still resolve via variable.
        if ((!p.useVariable.HasValue || p.useVariable.Value) && p.variable != null)
        {
          var v = _vars.FindByName(p.variable);
          val = Convert.ToDouble(v.value);
        }
        else if (p.value != null)
        {
          val = Convert.ToDouble(p.value);
        }
        resolved[p.name] = new DistribParams
        {
          name = p.name,
          value = val,
          timeRate = p.timeRate,
        };
      }
      return resolved;
    }

    /// <summary>
    /// Samples the distribution. Returns the raw sampled value plus the time rate that the value
    /// is expressed in (the time rate of the dominant parameter). Min/Max parameters are NOT
    /// applied here - callers that need clamping should call <see cref="TryGetParameter"/> and
    /// apply it in their own units (events clamp in TimeSpan, var-value actions in raw doubles).
    ///
    /// When <see cref="useTimeRates"/> is false, per-parameter time-rate conversions are skipped
    /// (parameters are treated as raw, unitless values) and sampledTimeRate is set to the default.
    /// </summary>
    public double Sample(out EnTimeRate sampledTimeRate)
    {
      Dictionary<string, DistribParams> distParams;
      try
      {
        distParams = ResolveParameters();
      }
      catch
      {
        throw new Exception("Failed to load parameter values for distribution");
      }

      // Helper for std/min/max parameters that, in time-rate mode, must be normalized to the
      // dominant parameter's time rate before being passed to the distribution sampler.
      double ToDominantRate(DistribParams p, EnTimeRate dominant)
      {
        if (!_useTimeRates)
          return (double)p.value!;
        return Globals.ConvertToNewTimeSpan(p.timeRate, (double)p.value!, dominant);
      }

      double sampled;
      EnTimeRate distTimeRate = _dfltTimeRate;

      try
      {
        switch (_distType)
        {
          case EnDistType.dtExponential:
            if (distParams.TryGetValue("Rate", out DistribParams? rate))
            {
              sampled = new Exponential((double)rate.value!, SingleRandom.Instance).Sample();
              distTimeRate = rate.timeRate;
            }
            else
            {
              throw new Exception("Missing required parameter rate for exponential distribution");
            }
            break;

          case EnDistType.dtNormal:
            if (
              distParams.TryGetValue("Mean", out DistribParams? mean)
              && distParams.TryGetValue("Standard Deviation", out DistribParams? std)
            )
            {
              sampled = new Normal((double)mean.value!,
                                   ToDominantRate(std, mean.timeRate),
                                   SingleRandom.Instance).Sample();
              distTimeRate = mean.timeRate;
            }
            else
            {
              throw new Exception("Missing one or both required parameters mean and standard deviation for normal distribution");
            }
            break;

          case EnDistType.dtWeibull:
            if (
              distParams.TryGetValue("Shape", out DistribParams? shape)
              && distParams.TryGetValue("Scale", out DistribParams? scale)
            )
            {
              sampled = new Weibull((double)shape.value!, (double)scale.value!, SingleRandom.Instance).Sample();
              distTimeRate = scale.timeRate;
            }
            else
            {
              throw new Exception("Missing one or both required parameters shape and scale for Weibull distribution");
            }
            break;

          case EnDistType.dtLogNormal:
            if (
              distParams.TryGetValue("Mean", out DistribParams? mu)
              && distParams.TryGetValue("Standard Deviation", out DistribParams? sigma)
            )
            {
              sampled = new LogNormal((double)mu.value!,
                                      ToDominantRate(sigma, mu.timeRate),
                                      SingleRandom.Instance).Sample();
              distTimeRate = mu.timeRate;
            }
            else
            {
              throw new Exception("Missing one or both required parameters mean and standard deviation for lognormal distribution");
            }
            break;

          case EnDistType.dtUniform:
            if (
              distParams.TryGetValue("Minimum", out DistribParams? lower)
              && distParams.TryGetValue("Maximum", out DistribParams? upper)
            )
            {
              sampled = new ContinuousUniform((double)lower.value!,
                                              ToDominantRate(upper, lower.timeRate),
                                              SingleRandom.Instance).Sample();
              distTimeRate = lower.timeRate;
            }
            else
            {
              throw new Exception("Missing one or both required parameters minimum and maximum for uniform distribution");
            }
            break;

          case EnDistType.dtTriangular:
            if (
              distParams.TryGetValue("Minimum", out DistribParams? lowerT)
              && distParams.TryGetValue("Maximum", out DistribParams? upperT)
              && distParams.TryGetValue("Peak", out DistribParams? peak)
            )
            {
              sampled = new Triangular(ToDominantRate(lowerT, peak.timeRate),
                                       ToDominantRate(upperT, peak.timeRate),
                                       (double)peak.value!,
                                       SingleRandom.Instance).Sample();
              distTimeRate = peak.timeRate;
            }
            else
            {
              throw new Exception("Missing one or more required parameters minimum, maximum, and peak for triangular distribution");
            }
            break;

          case EnDistType.dtGamma:
            if (
              distParams.TryGetValue("Shape", out DistribParams? shapeG)
              && distParams.TryGetValue("Rate", out DistribParams? rateG)
            )
            {
              sampled = new Gamma((double)shapeG.value!, (double)rateG.value!, SingleRandom.Instance).Sample();
              distTimeRate = rateG.timeRate;
            }
            else
            {
              throw new Exception("Missing one or both required parameters shape and rate for gamma distribution");
            }
            break;

          case EnDistType.dtGompertz:
            if (
              distParams.TryGetValue("Shape", out DistribParams? shapeO)
              && distParams.TryGetValue("Scale", out DistribParams? scaleO)
            )
            {
              double r = SingleRandom.Instance.NextDouble();
              sampled = 1 / (double)scaleO.value! * Math.Log(Math.Log(1 - r) / -(double)shapeO.value! + 1);
              distTimeRate = scaleO.timeRate;
            }
            else
            {
              throw new Exception("Missing one or both required parameters shape and scale for Gompertz distribution");
            }
            break;

          default:
            throw new Exception("Distribution type not implemented for " + _distType.ToString());
        }
      }
      catch (Exception err)
      {
        throw new Exception("Invalid parameters for distribution: " + err);
      }

      sampledTimeRate = distTimeRate;
      return sampled;
    }

    /// <summary>
    /// Returns true if the distribution defines a parameter with the given name and the current
    /// (resolved) value is non-null. The out value is the resolved literal/variable value.
    /// </summary>
    public bool TryGetParameter(string parameterName, out double value, out EnTimeRate timeRate)
    {
      var resolved = ResolveParameters();
      if (resolved.TryGetValue(parameterName, out DistribParams? p) && p.value.HasValue)
      {
        value = p.value.Value;
        timeRate = p.timeRate;
        return true;
      }
      value = 0.0;
      timeRate = _dfltTimeRate;
      return false;
    }
  }
}

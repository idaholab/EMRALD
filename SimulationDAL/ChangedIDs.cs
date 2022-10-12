// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MyStuff.Collections;

namespace SimulationDAL
{
  /// <summary>
  /// maintains lists of item IDs that have changed of different types [variables, 3DComps, states]
  /// </summary>
  public class ChangedIDs
  {
    private MyBitArray _variableIDs;
    private MyBitArray _compIDs;
    private MyBitArray _stateIDs;

    public MyBitArray variableIDs_BS { get { return _variableIDs; } }
    public MyBitArray compIDs_BS { get { return _compIDs; } }
    public MyBitArray stateIDs_BS { get { return _stateIDs; } }

    public ChangedIDs(int varIDMax, int compIDMax, int stateIDMax)
    {
      this._variableIDs = new MyBitArray(varIDMax + 1);
      this._compIDs = new MyBitArray(compIDMax + 1);
      this._stateIDs = new MyBitArray(stateIDMax + 1);
    }

    public void AddChangedID(EnModifiableTypes idType, int id)
    {
      int max;
      switch (idType)
      {
        case EnModifiableTypes.mtVar:
          max = _variableIDs.Count;
          break;

        case EnModifiableTypes.mtComp:
          max = _compIDs.Count;
          break;

        case EnModifiableTypes.mtState:
          max = _stateIDs.Count;
          break;

        default:
          return;
      }

      if (id > max)
      {
        throw new ArgumentOutOfRangeException();
      }

      switch (idType)
      {
        case EnModifiableTypes.mtVar:
          _variableIDs[id] = true;
          break;

        case EnModifiableTypes.mtComp:
          _compIDs[id] = true;
          break;

        case EnModifiableTypes.mtState:
          _stateIDs[id] = true;
          break;

        default:
          return;
      }
    }

    public bool HasApplicableItems(EnModifiableTypes idType, MyBitArray ids)
    {
      //switch (idType)
      //{
      //  case EnModifiableTypes.mtVar:
      //    return variableIDs.HasCommonBits(ids);

      //  case EnModifiableTypes.mtComp:
      //    return compIDs.HasCommonBits(ids);

      //  case EnModifiableTypes.mtState:
      //    return stateIDs.HasCommonBits(ids);

      //  default :
      //    return false;        
      //}
      if (idType == EnModifiableTypes.mtVar)
        return _variableIDs.HasCommonBits(ids);

      else if (idType == EnModifiableTypes.mtComp)
        return _compIDs.HasCommonBits(ids);

      else if (idType == EnModifiableTypes.mtState)
        return _stateIDs.HasCommonBits(ids);

      else if (idType == EnModifiableTypes.mtExtEv)
        return true; //always say yes //todo could limit to what connected simulation we want the event from

      else
        return false;
    }

    public bool HasItem(EnModifiableTypes idType, int id)
    {
      MyBitArray itemAsBS = new MyBitArray(id + 1);
      itemAsBS[id] = true;
      return this.HasApplicableItems(idType, itemAsBS);
    }

    public bool HasChange()
    {
      if (this._variableIDs.BitCount() > 0)
        return true;
      if (this._stateIDs.BitCount() > 0)
        return true;
      if (this._compIDs.BitCount() > 0)
        return true;
      return false;
    }

    public void Clear()
    {
      _variableIDs.SetAll(false);
      _compIDs.SetAll(false);
      _stateIDs.SetAll(false);
    }
  }
}

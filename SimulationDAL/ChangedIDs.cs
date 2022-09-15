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
    private MyBitArray variableIDs;
    private MyBitArray compIDs;
    private MyBitArray stateIDs;

    public ChangedIDs(int varIDMax, int compIDMax, int stateIDMax)
    {
      this.variableIDs = new MyBitArray(varIDMax + 1);
      this.compIDs = new MyBitArray(compIDMax + 1);
      this.stateIDs = new MyBitArray(stateIDMax + 1);
    }

    public void AddChangedID(EnModifiableTypes idType, int id)
    {
      int max;
      switch (idType)
      {
        case EnModifiableTypes.mtVar:
          max = variableIDs.Count;
          break;

        case EnModifiableTypes.mtComp:
          max = compIDs.Count;
          break;

        case EnModifiableTypes.mtState:
          max = stateIDs.Count;
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
          variableIDs[id] = true;
          break;

        case EnModifiableTypes.mtComp:
          compIDs[id] = true;
          break;

        case EnModifiableTypes.mtState:
          stateIDs[id] = true;
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
        return variableIDs.HasCommonBits(ids);

      else if (idType == EnModifiableTypes.mtComp)
        return compIDs.HasCommonBits(ids);

      else if (idType == EnModifiableTypes.mtState)
        return stateIDs.HasCommonBits(ids);

      else
        return false;
    }

    public bool HasItem(EnModifiableTypes idType, int id)
    {
      MyBitArray itemAsBS = new MyBitArray(id + 1);
      itemAsBS[id] = true;
      return this.HasApplicableItems(idType, itemAsBS);
    }

    public void Clear()
    {
      variableIDs.SetAll(false);
      compIDs.SetAll(false);
      stateIDs.SetAll(false);
    }
  }
}

/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Sop.Collections.BTree
{
    /// <summary>
    /// B-Tree Base interface. Both In-Memory and On-Disk
    /// B-Tree versions implement IBTreeBase interface.
    /// </summary>
    public interface IBTreeBase : System.Collections.IDictionary,
        System.Collections.ICollection,
        System.Collections.IEnumerable,
        System.ICloneable
    {
        /// <summary>
        /// Returns current sort order. Setting to a different sort order will 
        /// reset BTree. First item according to sort order will be current item.
        /// </summary>
        SortOrderType SortOrder
        {
            get;
            set;
        }
        /// <summary>
        /// Returns current item's key
        /// </summary>
        object CurrentKey
        {
            get;
        }
        /// <summary>
        /// Returns/sets current item's value
        /// </summary>
        object CurrentValue
        {
            get;
            set;
        }
        /// <summary>
        /// Returns true if current record pointer is beyond last item in tree.
        /// </summary>
        /// <returns></returns>
        bool EndOfTree();
        /// <summary>
        /// Search BTreeAlgorithm for the entry having its key equal to 'Key'
        /// </summary>
        /// <param name="Key">Key of record to search for</param>
        /// <returns>true if successful, false otherwise</returns>
        bool Search(object Key);
        /// <summary>
        /// Search btree for the entry having its key equal to 'Key'
        /// </summary>
        /// <param name="Key">Key of record to search for</param>
        /// <param name="GoToFirstInstance">if true and Key is duplicated, will make first instance of duplicated keys the current record so one can easily get/traverse all records having the same keys using 'MoveNext' function</param>
        /// <returns>true if successful, false otherwise</returns>
        bool Search(object Key, bool GoToFirstInstance);
        /// <summary>
        /// Returns the number of items in the btree
        /// </summary>
        /// <summary>
        /// Returns the current item (value and key pair) contained in 'DictionaryEntry' object.
        /// </summary>
        DictionaryEntry CurrentEntry
        {
            get;
        }
    }
    /// <summary>
    /// B-Tree interface defines the available members of B-Tree manager.
    /// Extends the following .Net Framework interfaces:
    /// System.Collections.IDictionary, System.Collections.ICollection, 
    /// System.Collections.IEnumerable,	System.ICloneable, 
    /// System.Runtime.Serialization.ISerializable, System.Runtime.Serialization.IDeserializationCallback
    /// </summary>
    public interface IBTree : IBTreeBase
#if !DEVICE
,
        System.Runtime.Serialization.ISerializable,
        System.Runtime.Serialization.IDeserializationCallback
#endif
    {
        /// <summary>
        /// Returns the Synchronized (or Multi-Thread Safe) version of BTree
        /// </summary>
        /// <returns>Synchronized BTree object</returns>
        IBTree Synchronized();
    }
}


/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */

#region History Log
/* DESCRIPTION       :                                           *
* This class provides the generic and extendible Collection      *
* class and its item base object. Collection is an extendible    *
* container type of class. It defines the overridable methods    *
* for managing contained objects. Benefit of this is that        *
* applications could easily switch Collection types whenever they*
* want to. For example, initially, an array Collection was used  *
* and later it was found that array searching is so slow and a   *
* need to use a Collection offering faster searches then, a      *
* Btree(look for Gerry's Btree Collection implementation)        *
* Collection might be introduced and could be easily swapped to  *
* the old array Collection. Only the code that instantiates the  *
* Collection object needs to be changed.                         */

// 06/02/2001   Gerardo
// - .NET migration work.

// 04/30/1999	Gerardo
// - Write operation request will no longer wait until all overlapping Read 
//	requests had been served. After serving the last Read operation and the
//	requested operation is Write, will prioritize the Write in that succeeding
//	Read requests while Write is waiting for its turn will wait until the Write
//	operation had been served.

// 04/24/1999	Gerardo
// - Decided to support Key & Data through inheritance. Descendant Collection
//	classes will be introduced to support it.

// 03/23/1999	Gerardo
// - Changed back return types from bool to 'short'. 'short' will
//	allow us to support multiple error return types.
// 06/18/1998	Gerardo
// - Added multi-thread support.
#endregion

namespace Sop.Collections.Generic.BTree
{
	using System;
	using System.Threading;

	/// <summary>
	/// Extends the Collections.BTreeICollection interface and adds Dictionary related api
	/// </summary>
	public interface IBaseCollection<T> : ICloneable
	{
		/// <summary>
		/// MoveNext makes the next entry the current one
		/// </summary>
		bool MoveNext();
		/// <summary>
		/// MovePrevious makes the previous entry the current one
		/// </summary>
		bool MovePrevious();
		/// <summary>
		/// MoveFirst makes the first entry in the Collection the current one
		/// </summary>
		bool MoveFirst();
		/// <summary>
		/// MoveLast makes the last entry in the Collection the current one
		/// </summary>
		bool MoveLast();
		/// <summary>
		/// Search the Collection for existence of ObjectToSearch
		/// </summary>
		bool Search(T Value);	// return true if found, else false
	}
	/// <summary>
	/// Extends the Collections.BTreeICollection interface and adds Dictionary related api
	/// </summary>
	public interface ICollection<T> : IBaseCollection<T>
	{
		/// <summary>
		/// Returns the Current entry
		/// </summary>
		T CurrentEntry
		{
			get;
		}
		/// <summary>
		/// Add Key and Value as entry to the Dictionary/Collection
		/// </summary>
		void Add(T Value);
	}
	/// <summary>
	/// Extends the Collections.BTreeICollection interface and adds Dictionary related api
	/// </summary>
	public interface IBTreeDictionary<TKey, TValue> : System.Collections.Generic.IDictionary<TKey, TValue>,
		IBaseCollection<TKey>
	{
		/// <summary>
		/// Returns current sort order. Setting to a different sort order will 
		/// reset BTree. First item according to sort order will be current item.
		/// </summary>
		Sop.Collections.BTree.SortOrderType SortOrder
		{
			get;
			set;
		}

		/// <summary>
		/// Returns the Current entry
		/// </summary>
		BTreeItem<TKey, TValue> CurrentEntry
		{
			get;
		}

		/// <summary>
		/// Returns the Current entry's key
		/// </summary>
		TKey CurrentKey
		{
			get;
		}
		/// <summary>
		/// Returns the Current entry's Value
		/// </summary>
		TValue CurrentValue
		{
			get;
			set;
		}
        /// <summary>
        /// Remove currently selected Item
        /// </summary>
		void Remove();
		/// <summary>
		/// Search btree for the entry having its key equal to 'Key'
		/// </summary>
		/// <param name="Key">Key of record to search for</param>
		/// <param name="GoToFirstInstance">if true and Key is duplicated, will make first instance of duplicated 
		/// keys the current record so one can easily get/traverse all records having the same keys using 'MoveNext' function</param>
		/// <returns>true if successful, false otherwise</returns>
		bool Search(TKey Key, bool GoToFirstInstance);
	}
}

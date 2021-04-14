/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */
using System;
using System.Collections;

namespace Sop.Collections.BTree
{
	/// <summary>
	/// Thread synchronized BTree. This is the object type returned by "BTree.Synchronized" property.
	/// </summary>
/*
#if !DEVICE
	[Serializable]
#endif
*/
	sealed public class ThreadSafeBTree : IBTree	//, System.ComponentModel.IListSource
	{
		/// <summary>
		/// Locks btree so that next operation is thread safe
		/// </summary>
		/// <param name="RequestedOperation">Lock btree for a specific operation</param>
		/// <paramref name="Synchronizer.OperationType"/>
		public void Lock(Collections.BTree.OperationType RequestedOperation)
		{
			Synchronizer.Lock(RequestedOperation);
		}
		/// <summary>
		/// Unlocks btree so that next operation is thread safe
		/// </summary>
		public void Unlock()
		{
			Synchronizer.Unlock();
		}
		/// <summary>
		/// Synchronized Add method. Add adds an entry with the provided key and value into the BTreeAlgorithm.
		/// </summary>
		/// <summary>
		/// Duplicate keys are allowed in BTree unlike in a Dictionary/HashTable
		/// where key is required to be unique.
		/// <param name="Key">key of item you want to add to the collection</param>
		/// <param name="Value">the item you want to be collected</param>
		/// </summary>
		public void Add(object Key, object Value)
		{
			Lock(Collections.BTree.OperationType.Write);
			try
			{
				BTree.Add(Key, Value);
			}
			finally
			{
				Unlock();
			}
		}
		/// <summary>
		/// Synchronized Clear method.
		/// </summary>
		/// <summary>
		/// Set to null all collected items and their internal buffers making collection empty
		/// </summary>
		public void Clear()
		{
			Lock(Collections.BTree.OperationType.Write);
			try
			{
				BTree.Clear();
			}
			finally
			{
				Unlock();
			}
		}
		/*
		/// <summary>
		/// Synchronized Clear method. Set to null all collected items and their internal buffers.
		/// If 'IsGarbageCollect' is true, forces Garbage Collection for better memory reclamation.
		/// </summary>
		/// <param name="IsGarbageCollect">true will call GC.Collect after clearing the tree, else will not</param>
		public void Clear(bool IsGarbageCollect)
		{
			Lock(Collections.BTree.OperationType.Write);
			try
			{
				BTree.Clear(IsGarbageCollect);
			}
			finally
			{
				Unlock();
			}
		}
		*/
		/// <summary>
		/// Synchronized Clone method.
		/// </summary>
		/// <summary>
		/// Shallow copy this collection and returns the copy as "object" type.
		/// </summary>
		public object Clone()
		{
			object o;
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				o = new ThreadSafeBTree((BTree)BTree.Clone());
			}
			finally
			{
				Unlock();
			}
			return o;
		}
		/// <summary>
		/// Checks whether the tree has collected an item having its key equals "key"
		/// </summary>
		/// <param name="key">key of item to check</param>
		/// <returns>true if key is found in the btree, false if not</returns>
		public bool Contains(object key)
		{
			return Search(key);
		}
		/// <summary>
		/// Copy into an array contents of the btree
		/// </summary>
		/// <param name="DestArray">Destination array that will contain the items.</param>
		/// <param name="StartIndex"></param>
		/// <exception cref="ArgumentNullException">array is a null reference (Nothing in Visual Basic).</exception>
		/// <exception cref="ArgumentOutOfRangeException">arrayIndex is less than zero.</exception>
		/// <exception cref="ArgumentException">array is multidimensional.</exception>
		/// <exception>-or-
		/// arrayIndex is equal to or greater than the length of array.
		/// </exception>
		/// <exception>-or-
		/// arrayIndex is equal to or greater than the length of array.
		/// </exception>
		/// <exception>-or-
		/// The number of elements in the source Hashtable is greater than the available space from arrayIndex to the end of the destination array.
		/// </exception>
		public void CopyTo(Array DestArray, int StartIndex)
		{
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				BTree.CopyTo(DestArray, StartIndex);
			}
			finally
			{
				Unlock();
			}
		}
		/// <summary>
		/// Returns ThreadSafeBTree's Enumerator or Iterator object
		/// </summary>
		/// <returns>System.Collections.IDictionaryEnumerator object</returns>
		public System.Collections.IDictionaryEnumerator GetEnumerator()
		{
			return new BTree.BTreeEnumerator((BTree)Clone());
		}
#if !DEVICE
		/// <summary>
		/// Implements the ISerializable interface and raises the deserialization event when the deserialization is complete.
		/// </summary>
		/// <param name="sender">Source of the deserialization event</param>
		public void OnDeserialization(object sender)
		{
			Lock(OperationType.Write);
			try
			{
				BTree.OnDeserialization(sender);
			}
			finally
			{
				Unlock();
			}
		}
		/// <summary>
		/// Used by serializer to get btree graph's serializable info
		/// </summary>
		/// <param name="info">The SerializationInfo to populate with data.</param>
		/// <param name="context">The destination (see StreamingContext) for this serialization.</param>
		public void GetObjectData(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context)
		{
			Lock(OperationType.Read);
			try
			{
				BTree.GetObjectData(info, context);
			}
			finally
			{
				Unlock();
			}
		}
#endif
		/// <summary>
		/// Synchronized Move to first item.
		/// </summary>
		/// <returns>Returns true if able to make 1st item current item or false if not</returns>
		public bool MoveFirst()
		{
			bool b;
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				b = BTree.MoveFirst();
			}
			finally
			{
				Unlock();
			}
			return b;
		}
		/// <summary>
		/// Synchronized Move to last item.
		/// </summary>
		/// <returns>Returns true if able to make last item current item or false if not</returns>
		public bool MoveLast()
		{
			bool b;
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				b = BTree.MoveLast();
			}
			finally
			{
				Unlock();
			}
			return b;
		}
		/// <summary>
		/// Synchronized Move to next item.
		/// </summary>
		/// <returns>Returns true if able to make next item current item or false if not</returns>
		public bool MoveNext()
		{
			bool b;
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				b = BTree.MoveNext();
			}
			finally
			{
				Unlock();
			}
			return b;
		}
		/// <summary>
		/// Synchronized Move to previous item.
		/// </summary>
		/// <returns>Returns true if able to make previous item current item or false if not</returns>
		public bool MovePrevious()
		{
			bool b;
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				b = BTree.MovePrevious();
			}
			finally
			{
				Unlock();
			}
			return b;
		}
		/// <summary>
		/// Synchronized remove item
		/// </summary>
		/// <param name="key">key of item to remove from btree</param>
		public void Remove(object key)
		{
			Lock(Collections.BTree.OperationType.Write);
			try
			{
				BTree.Remove(key);
			}
			finally
			{
				Unlock();
			}
		}
		/// <summary>
		/// Synchronized Search for an item
		/// </summary>
		/// <param name="Key">key of the item to search for in the btree</param>
		/// <returns></returns>
		public bool Search(object Key)
		{
			return Search(Key, false);
		}

		/// <summary>
		/// Synchronized Search for an item
		/// </summary>
		/// <param name="Key">key of the item to search for in the btree</param>
		/// <param name="GoToFirstInstance">true tells BTree to go to First Instance of Key, else any key instance matching will match</param>
		/// <returns></returns>
		public bool Search(object Key, bool GoToFirstInstance)
		{
			bool b;
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				b = BTree.Search(Key, GoToFirstInstance);
			}
			finally
			{
				Unlock();
			}
			return b;
		}
		/// <summary>
		/// Returns the number of items in the btree
		/// </summary>
		public int Count
		{
			get
			{
				Lock(OperationType.Read);
				try
				{
					// NOTE: we don't need to lock as returning a snapshot Count
					// value before or after lock/unlock is not guaranteed to be the same
					// as another thread might change the value again while we return the value where we are unlocked
					return BTree.Count;
				}
				finally
				{
					Unlock();
				}
			}
		}
		/// <summary>
		/// Returns/Sets the current item (key and value pair) (Synchronized)
		/// </summary>
		public DictionaryEntry CurrentEntry
		{
			get
			{
				DictionaryEntry o;
				Lock(Collections.BTree.OperationType.Read);
				try
				{
					o = BTree.CurrentEntry;
				}
				finally
				{
					Unlock();
				}
				return o;
			}
		}
		/// <summary>
		/// Returns true if current record pointer is beyond last item in tree.
		/// </summary>
		/// <returns></returns>
		public bool EndOfTree()
		{
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				return BTree.EndOfTree();
			}
			finally
			{
				Unlock();
			}
		}
		/// <summary>
		/// Returns the Current item's key. (Synchronized)
		/// </summary>
		public object CurrentKey
		{
			get
			{
				object o;
				Lock(Collections.BTree.OperationType.Read);
				try
				{
					o = BTree.CurrentKey;
				}
				finally
				{
					Unlock();
				}
				return o;
			}
		}
		/// <summary>
		/// Returns the current item's value. (Synchronized)
		/// </summary>
		public object CurrentValue
		{
			get
			{
				object o;
				Lock(Collections.BTree.OperationType.Read);
				try
				{
					o = BTree.CurrentValue;
				}
				finally
				{
					Unlock();
				}
				return o;
			}
			set
			{
				Lock(Collections.BTree.OperationType.Write);
				try
				{
					BTree.CurrentValue = value;
				}
				finally
				{
					Unlock();
				}
			}
		}
		/// <summary>
		/// IsFixedSize will always return false. BTree don't support fixed size collection
		/// </summary>
		public bool IsFixedSize
		{
			get
			{
				return false;
			}
		}
		/// <summary>
		/// IsReadOnly will always return false. This BTree implementation is always Read/Write.
		/// </summary>
		public bool IsReadOnly
		{
			get
			{
				return false;
			}
		}
		/// <summary>
		/// Returns true as this btree implementation is Synchronized.
		/// </summary>
		public bool IsSynchronized
		{
			get
			{
				return true;
			}
		}
		/// <summary>
		/// Returns collection (System.Collections.ICollection type) of all items' keys. (Synchronized)
		/// </summary>
		public System.Collections.ICollection Keys
		{
			get
			{
				System.Collections.ICollection o;
				Lock(Collections.BTree.OperationType.Read);
				try
				{
					o = new ThreadSafeBTree((BTree)BTree.Keys);
				}
				finally
				{
					Unlock();
				}
				return o;
			}
		}
		/// <summary>
		/// Returns the sort order type
		/// </summary>
		public SortOrderType SortOrder
		{
			get
			{
				Lock(OperationType.Read);
				try
				{
					return BTree.SortOrder;
				}
				finally
				{
					Unlock();
				}
			}
			set
			{
				Lock(OperationType.Write);
				try
				{
					BTree.SortOrder = value;
				}
				finally
				{
					Unlock();
				}
			}
		}
		/// <summary>
		/// Returns the synchronization object used to lock/unlock this btree resource.
		/// </summary>
		public object SyncRoot
		{
			get
			{
				return Synchronizer;
			}
		}
		/// <summary>
		/// Synchronized accessor. item's key is the parameter used to access the item
		/// </summary>
		public object this[object key]
		{
			get
			{
				object o;
				Lock(Collections.BTree.OperationType.Read);
				try
				{
					o = BTree[key];
				}
				finally
				{
					Unlock();
				}
				return o;
			}
			set
			{
				Lock(Collections.BTree.OperationType.Write);
				try
				{
					BTree[key] = value;
				}
				finally
				{
					Unlock();
				}
			}
		}
		/// <summary>
		/// Returns collection of values in the btree. (Synchronized)
		/// </summary>
		public System.Collections.ICollection Values
		{
			get
			{
				System.Collections.ICollection o;
				Lock(Collections.BTree.OperationType.Read);
				try
				{
					o = new ThreadSafeBTree((BTree)BTree.Values);
				}
				finally
				{
					Unlock();
				}
				return o;
			}
		}
		/// <summary>
		/// Returns the Synchronized version of BTree
		/// </summary>
		/// <returns>Synchronized BTree object</returns>
        public IBTree Synchronized()
		{
			return BTree.Synchronized(this.BTree);
		}
		/// <summary>
		/// Constructor for project internal use
		/// </summary>
		/// <param name="BTree"></param>
		internal ThreadSafeBTree(BTree BTree)
		{
			this.BTree = BTree;
			this.Synchronizer = (Synchronizer)BTree.SyncRoot;
		}
		/// <summary>
		/// IEnumerable Interface Implementation
		/// </summary>
		/// <returns></returns>
		System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
		{
			return new BTree.BTreeEnumerator((BTree)Clone());
		}
		private BTree BTree;
		private Synchronizer Synchronizer;
		/*
		#region IListSource Members

		IList System.ComponentModel.IListSource.GetList()
		{
			Lock(Collections.BTree.OperationType.Read);
			try
			{
				return ((System.ComponentModel.IListSource)BTree).GetList();
			}
			finally
			{
				Unlock();
			}
		}
		/// <summary>
		/// Returns false as B-Tree can be irregularly shaped graph.
		/// </summary>
		bool System.ComponentModel.IListSource.ContainsListCollection
		{
			get
			{
				return false;
			}
		}

		#endregion
		*/
	}
}

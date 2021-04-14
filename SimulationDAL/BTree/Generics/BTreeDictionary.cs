
/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */

namespace Sop.Collections.Generic.BTree
{
    using System;
    using System.Collections;
    using System.ComponentModel;

    /// <summary>
    /// BTreeDictionary is a SortedDictionary that allows insertion of 
    /// duplicate Keys and provides Iterator methods to iterate through
    /// the set of records within the Dictionary.
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    /// <typeparam name="TValue"></typeparam>
#if !DEVICE
    [Serializable]
#endif
    public class BTreeDictionary<TKey, TValue> : IBTreeDictionary<TKey, TValue>
    {
		internal class BTreeEnumeratorValue : BTreeEnumerator<TValue>
		{
			/// <summary>
			/// Constructor. Pass the B-Tree instance you want to enumerate its items/elements on.
			/// </summary>
			/// <param name="BTree">BTree instance items will be enumerated</param>
			public BTreeEnumeratorValue(BTreeDictionary<TKey, TValue> BTree) : base(BTree) { }
			public override TValue Current
			{
				get
				{
					if (!bWasReset)
						return BTree.CurrentValue;
					throw new InvalidOperationException(Sop.Collections.BTree.BTree.GetStringResource("ResetError"));
				}
			}
		}
		internal class BTreeEnumeratorKey : BTreeEnumerator<TKey>
		{
			/// <summary>
			/// Constructor. Pass the B-Tree instance you want to enumerate its items/elements on.
			/// </summary>
			/// <param name="BTree">BTree instance items will be enumerated</param>
			public BTreeEnumeratorKey(BTreeDictionary<TKey, TValue> BTree) : base(BTree) { }
			public override TKey Current
			{
				get
				{
					if (!bWasReset)
						return BTree.CurrentKey;
					throw new InvalidOperationException(Sop.Collections.BTree.BTree.GetStringResource("ResetError"));
				}
			}
		}
		internal class BTreeEnumeratorDefault : BTreeEnumerator<System.Collections.Generic.KeyValuePair<TKey, TValue>>
		{
			/// <summary>
			/// Constructor. Pass the B-Tree instance you want to enumerate its items/elements on.
			/// </summary>
			/// <param name="BTree">BTree instance items will be enumerated</param>
			public BTreeEnumeratorDefault(BTreeDictionary<TKey, TValue> BTree) : base(BTree) { }

			public override System.Collections.Generic.KeyValuePair<TKey, TValue> Current
			{
				get
				{
					if (!bWasReset)
					{
						System.Collections.Generic.KeyValuePair<TKey,TValue> r;
						if (BTree.CurrentEntry != null)
						{
							r = new System.Collections.Generic.KeyValuePair<TKey, TValue>(
								BTree.CurrentEntry.Key, BTree.CurrentEntry.Value);
						}
						else
							r = new System.Collections.Generic.KeyValuePair<TKey, TValue>();
						return r;
					}
					throw new InvalidOperationException(Sop.Collections.BTree.BTree.GetStringResource("ResetError"));
				}
			}

			//public override KeyValuePair<TKey, TValue> Current
			//{
			//    get
			//    {
			//        if (!bWasReset)
			//        {
			//            return BTree.CurrentEntry;
			//        }
			//        throw new InvalidOperationException(Sop.Collections.BTree.BTree.GetStringResource("ResetError"));
			//    }
			//}
		}

		/// <summary>
		/// The B-Tree enumerator
		/// </summary>
		internal abstract class BTreeEnumerator<T> : System.Collections.Generic.IEnumerator<T>
		{
			/// <summary>
			/// Constructor. Pass the B-Tree instance you want to enumerate its items/elements on.
			/// </summary>
			/// <param name="BTree">BTree instance items will be enumerated</param>
			public BTreeEnumerator(BTreeDictionary<TKey, TValue> BTree)
			{
				this.BTree = BTree;
				this.Reset();
			}
			/// <summary>
			/// Returns Current record
			/// </summary>
			/// <exception cref="InvalidOperationException">Throws InvalidOperationException exception if Reset was called without calling MoveNext</exception>
			abstract public T Current { get; }

			public void Dispose()
			{
				BTree = null;
			}

			object IEnumerator.Current
			{
				get
				{
					return ((BTreeEnumerator<T>)this).Current;
				}
			}

			/// <summary>
			/// Make the next record current
			/// </summary>
			/// <returns>Returns true if successful, false otherwise</returns>
			public bool MoveNext()
			{
				if (!bWasReset)
					return BTree.MoveNext();
				else
				{
					if (BTree.Count == 0)
						return false;
					bWasReset = false;
					return true;
				}
			}
			/// <summary>
			/// Reset enumerator. You will need to call MoveNext to get to first record.
			/// </summary>
			public void Reset()
			{
				if (BTree.Count > 0)
					BTree.MoveFirst();
				bWasReset = true;
			}
			internal BTreeDictionary<TKey, TValue> BTree;
			protected bool bWasReset;
		}

		/// <summary>
		/// Constructor to use if you want to provide your own Comparer object that defines
		/// how your records will be sorted/arranged
		/// </summary>
		/// <param name="Comparer">IComparer implementation that defines how records will be sorted</param>
		public BTreeDictionary(System.Collections.Generic.IComparer<TKey> Comparer)
		{
			btree = new Sop.Collections.Generic.BTree.BTreeAlgorithm<TKey,TValue>(Comparer);
		}
		/// <summary>
		/// Constructor to use if you want to provide the number of slots per node of the tree
		/// </summary>
		/// <param name="SlotLen">number of slots per node</param>
		public BTreeDictionary(byte SlotLen)
		{
			btree = new Sop.Collections.Generic.BTree.BTreeAlgorithm<TKey,TValue>(SlotLen);
		}
		/// <summary>
		/// Constructor to use if you want to use default number of slots per node (6)
		/// </summary>
		public BTreeDictionary()
		{
			btree = new Sop.Collections.Generic.BTree.BTreeAlgorithm<TKey,TValue>();
		}
		/// <summary>
		/// Constructor to use if you want to provide number of slots per node and your comparer object
		/// </summary>
		/// <param name="SlotLen">Number of slots per node</param>
		/// <param name="Comparer">compare object defining how records will be sorted</param>
		public BTreeDictionary(byte SlotLen, System.Collections.Generic.IComparer<TKey> Comparer)
		{
			btree = new Sop.Collections.Generic.BTree.BTreeAlgorithm<TKey,TValue>(SlotLen, Comparer);
		}

		/// <summary>
		/// Returns current sort order. Setting to a different sort order will 
		/// reset BTree. First item according to sort order will be current item.
		/// </summary>
		public Sop.Collections.BTree.SortOrderType SortOrder
		{
			get
			{
				return CurrentSortOrder;
			}
			set
			{
				CurrentSortOrder = value;
				if (btree != null && btree.Count > 0)
					MoveFirst();
			}
		}

		public BTreeItem<TKey, TValue> CurrentEntry
		{
			get
			{
				return btree.CurrentEntry;
			}
		}

		public TKey CurrentKey
		{
			get
			{
				if (btree.CurrentEntry != null)
					return btree.CurrentEntry.Key;
				return default(TKey);
			}
		}

		public TValue CurrentValue
		{
			get
			{
				if (btree.CurrentEntry != null)
					return btree.CurrentEntry.Value;
				return default(TValue);
			}
			set
			{
				if (btree.CurrentEntry != null)
					btree.CurrentEntry.Value = value;
				else
					throw new InvalidOperationException("CurrentEntry is null.");
			}
		}

		public int Count
		{
			get
			{
				return btree.Count;
			}
		}

		public bool MoveNext()
		{
			if (this.SortOrder ==
				Sop.Collections.BTree.SortOrderType.Ascending)
				return btree.MoveNext();
			return btree.MovePrevious();
		}

		public bool MovePrevious()
		{
			if (this.SortOrder ==
				Sop.Collections.BTree.SortOrderType.Ascending)
				return btree.MovePrevious();
			return btree.MoveNext();
		}

		public bool MoveFirst()
		{
			if (this.SortOrder == 
				Sop.Collections.BTree.SortOrderType.Ascending)
				return btree.MoveFirst();
			return btree.MoveLast();
		}

		public bool MoveLast()
		{
			if (this.SortOrder ==
				Sop.Collections.BTree.SortOrderType.Ascending)
				return btree.MoveLast();
			return MoveFirst();
		}

		public bool Search(TKey Key)
		{
			return btree.Search(Key);
		}
		/// <summary>
		/// Search btree for the entry having its key equal to 'Key'
		/// </summary>
		/// <param name="Key">Key of record to search for</param>
		/// <param name="GoToFirstInstance">if true and Key is duplicated, will make first instance of duplicated 
		/// keys the current record so one can easily get/traverse all records having the same keys using 'MoveNext' function</param>
		/// <returns>true if successful, false otherwise</returns>
		public bool Search(TKey Key, bool GoToFirstInstance)
		{
			return btree.Search(Key, GoToFirstInstance);
		}

		public void Clear()
		{
			btree.Clear();
		}

		public object Clone()
		{
			return btree.Clone();
		}

		/// <summary>
		/// Add adds an entry with the provided key and value into the BTree.
		/// Duplicate keys are allowed in BTree unlike in a Dictionary/HashTable
		/// where key is required to be unique.
		/// </summary>
		/// <param name="key">key of item you want to add to the collection</param>
		/// <param name="value">item you want to add to the collection</param>
		public virtual void Add(TKey key, TValue value)
		{
			btree.Add(key, value);
		}

		public bool ContainsKey(TKey key)
		{
			return Search(key);
		}
		/// <summary>
		/// Contains determines whether this collection contains an entry with the specified key.
		/// </summary>
		/// <param name="key">key to look for</param>
		/// <returns></returns>
		public bool Contains(System.Collections.Generic.KeyValuePair<TKey, TValue> item)
		{
			return Search(item.Key);
		}

		System.Collections.Generic.ICollection<TKey> keys;
		public System.Collections.Generic.ICollection<TKey> Keys
		{
			get
			{
				if (keys == null)
					keys = new BTree.BTreeKeys<TKey, TValue>(this);
				return keys;
			}
		}

		bool System.Collections.Generic.IDictionary<TKey, TValue>.Remove(TKey key)
		{
			return btree.Remove(key);
		}

		public bool TryGetValue(TKey key, out TValue value)
		{
			if (Search(key))
			{
				value = CurrentValue;
				return true;
			}
			value = default(TValue);
			return false;
		}

		System.Collections.Generic.ICollection<TValue> values;
		public System.Collections.Generic.ICollection<TValue> Values
		{
			get
			{
				if (values == null)
					values = new BTree.BTreeValues<TKey, TValue>(this);
				return values;
			}
		}

		/// <summary>
		/// BTree indexer. Given a key, will return its value.
		/// If key is not found, will add a new entry having passed 
		/// params key and value.
		/// </summary>
		virtual public TValue this[TKey key]
		{
			get
			{
				if (Count > 0 && CurrentEntry != null &&
					 Comparer != null && Comparer.Compare(this.CurrentKey, key) == 0)
					return CurrentValue;
				if (Search(key))
					return this.CurrentValue;
				return default(TValue);
			}
			set
			{
				if (Count > 0 &&
					(CurrentEntry != null &&
					Comparer != null && Comparer.Compare(this.CurrentKey, key) == 0) ||
					Search(key))
					CurrentValue = value;
				else	// if not found, add new entry/record. 
					// NOTE: this is .net compliance feature
					Add(key, value);
			}
		}
		public System.Collections.Generic.IComparer<TKey> Comparer
		{
			get
			{
				return btree.Comparer;
			}
			set
			{
				btree.Comparer = value;
			}
		}

		public void Add(System.Collections.Generic.KeyValuePair<TKey, TValue> item)
		{
			btree.Add(item.Key, item.Value);
		}

		public void CopyTo(
			System.Collections.Generic.KeyValuePair<TKey, TValue>[] array, 
			int arrayIndex)
		{
			if (arrayIndex < 0 || arrayIndex >= array.Length)
				throw new ArgumentOutOfRangeException("arrayIndex");
			if (Count > array.Length - arrayIndex)
				throw new ArgumentException(Sop.Collections.BTree.BTree.GetStringResource("BTreeHasMoreElems"));
			if (MoveFirst())
			{
				do
				{
					array[arrayIndex++] = new System.Collections.Generic.KeyValuePair<TKey,TValue>(CurrentKey, CurrentValue);
				}while(MoveNext());
			}
		}

		public bool IsReadOnly
		{
			get
			{
				return false;
			}
		}

		public bool Remove(System.Collections.Generic.KeyValuePair<TKey, TValue> item)
		{
			return btree.Remove(item.Key);
		}
		/// <summary>
		/// Removes entry with key.
		/// </summary>
		/// <param name="key">key of entry to delete from collection</param>
		public void Remove(TKey Key)
		{
			btree.Remove(Key);
		}
		/// <summary>
		/// Delete currently selected entry of BTree
		/// </summary>
		public void Remove()
		{
			btree.Remove();
		}

		System.Collections.Generic.IEnumerator<System.Collections.Generic.KeyValuePair<TKey, TValue>> enumerator;
		public System.Collections.Generic.IEnumerator<System.Collections.Generic.KeyValuePair<TKey, TValue>> GetEnumerator()
		{
			if (enumerator == null || ((BTreeEnumeratorDefault)enumerator).BTree == null)
			{
				enumerator = (System.Collections.Generic.IEnumerator<System.Collections.Generic.KeyValuePair<TKey, TValue>>)
				    new BTreeEnumeratorDefault(this);
			}
			return enumerator;
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			return this.GetEnumerator();
		}

		private Sop.Collections.BTree.SortOrderType CurrentSortOrder = Sop.Collections.BTree.SortOrderType.Ascending;
#if !DEVICE
		private System.Runtime.Serialization.SerializationInfo SerializationInfo;
#endif
		internal BTree.BTreeAlgorithm<TKey, TValue> btree;
	}
}

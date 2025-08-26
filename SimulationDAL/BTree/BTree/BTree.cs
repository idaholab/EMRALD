/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */

#region History Log
/*
 * 10/22/01 - more test cases for Serialization (covered comparer persistence)
 * 10/21/01 - Serialization is supported
 * 10/12/01 - Fixed SortOrder to Move to 1st if in ascending order else, move to last
 *			- Added SortOrder as public property of BTreeBase to allow derived classes
 *          to have access to it.
 * 10/01/01 - completed todo: revisit try blocks & compare w/ exceptions thrown. Check if we are not 
 *			suppressing exceptions in our try/catch/finally blocks
 * 9/29/01  - Completed support for .NET IDictionary
 * 6/24/01	- Complete feature test coverage & MovePrevious (byte casting translates -1 
 *			to 255) migration bug was fixed
 *			- Exceptions being raised now contain custom descriptions of the error if applicable.
 * 6/23/01 Finish w/ the foll. todos:
 *		-completed initial embedded code doc
 *		-added more test cases
 *		-Cleaned up the component. 
 *		-Separated test application from the component.
 * 6/19/01	- code complete. Testing reveals no bugs to major functionalities including multi-threaded
 *			access to a shared synchronized BTree.
 * 6/4/2001
 *			-Almost code complete!
 *
 * 5/20/01 - gave up VirtualStorage & finalized 'In memory' BTree & BTreeDictionaryOnDisk implementations
 *			as In memory really optimized code/performance vs. VirtualStorage approach.
 * 5/6/01 - started porting to c#. VirtualStorage, Stubs, sample BTreeGold iterator working.
*/
#endregion

namespace Sop.Collections.BTree
{
	using System;
	using System.Collections;
	using System.ComponentModel;

	/// <summary>
	/// Enumerates all the available choices for the number of slots per node of the BTree
	/// </summary>
	public enum ValidSlotLengths : byte
	{
		/// <summary>
		/// Four slots per node
		/// </summary>
		FourSlots = 4,					// 5 children
		/// <summary>
		/// Minimum allowed # of slots is two
		/// </summary>
		MinSlots = FourSlots,
		/// <summary>
		/// Six slots per node
		/// </summary>
		SixSlots = 6,					// 7 children
		/// <summary>
		/// Eight slots per node
		/// </summary>
		EightSlots = 8,					// 9 children
		/// <summary>
		/// Ten slots per node
		/// </summary>
		TenSlots = 10,					// 11 children
		/// <summary>
		/// Twelve slots per node
		/// </summary>
		TwelveSlots = 12,					// 13 children
		/// <summary>
		/// 14 slots per node
		/// </summary>
		FourteenSlots = 14,					// 15 children
		/// <summary>
		/// 16 slots per node
		/// </summary>
		SixteenSlots = 16,					// 17 children
		/// <summary>
		/// 18 slots per node
		/// </summary>
		EighteenSlots = 18,					// 19 children
		/// <summary>
		/// 20 slots per node
		/// </summary>
		TwentySlots = 20,					// 21 children
		/// <summary>
		/// 22 slots per node
		/// </summary>
		TwentyTwo = 22,					// 21 children
		/// <summary>
		/// 24 slots per node
		/// </summary>
		TwentyFour = 24,					// 21 children
		/// <summary>
		/// 26 slots per node
		/// </summary>
		TwentySix = 26,					// 21 children
		/// <summary>
		/// 28 slots per node
		/// </summary>
		TwentyEight = 28,					// 21 children
		/// <summary>
		/// 30 slots per node
		/// </summary>
		Thirty = 30,					// 21 children
		/// <summary>
		/// Max slots is 30 slots
		/// </summary>
		MaxSlots = Thirty,
		/// <summary>
		/// Default number of slots is MaxSlots
		/// </summary>
		DefaultSlots = MaxSlots
	}

	/// <summary>
	/// BTree Dictionary is a Dictionary type of collection that allows duplicate keys<br/>
	/// and can be sorted according to user defined sorting characteristic. Default sorting will:<br/>
	/// - sort numbers in ascending order<br/>
	/// - sort texts in ascending order<br/><br/>
	/// You can change sorting order to descending by passing SortOrderType.Descending to corresponding constructor param<br/>
	/// If you want custom sorting (as default is not applicable to your item's key, as probably you have compound key), you can <br/>
	/// pass your Comparer <see cref="System.Collections.IComparer"/>object that knows how to compare your items keys in one of constructor overrides.
	/// </summary>
	/// <remarks>
	/// Sample B-Tree graph:<br/>
	/// <code>
	///	       [ 50           |         70         |         90          |            100 ] (root)<br/>
	///	        /             |                    |                     |               \<br/>
	///        /              |                    |                     |                \<br/>
	/// [30|31|32|40]   [55|57|59|61]        [72|78|79|80]         [91|94|95|98]      [101|102|103|104]<br/>
	/// </code><br/>
	/// Above graph has following characteristics:<br/>
	/// - Each node has 4 slots (we display only the key per slot for discussion's brevity)<br/>
	/// - All nodes are slots full (no available slot).<br/>
	/// - Since all nodes are full, inserting an item will cause node break up, increasing the number of nodes (and height) of the tree<br/>
	/// - 2 level tree (1st is root and 2nd is the root's children nodes)<br/>
	/// Root node of the graph contains items whose keys' values are: 50, 70, 90, 100 respectively.<br/>
	/// Children nodes contain items whose keys' values are: <br/>
	/// items less than 50:<br/>
	/// 30, 31, 32, 40<br/>
	/// items greater than 50 and less than 70:<br/>
	/// 55, 57, 59, 61<br/>
	/// items greater than 70 and less than 90:<br/>
	/// 72, 78, 79, 80<br/>
	/// items greater than 90 and less than 100:<br/>
	/// 91, 94, 95, 98<br/>
	/// items greater than 100:<br/>
	/// 101, 102, 103, 104<br/><br/>
	/// 
	/// Searching discussion:<br/>
	/// E.G. - steps for searching an item having key of 79:<br/>
	/// 1) Do binary search on the root to see which Child Node contains Slot occupied by 79<br/>
	///	    - Go to middle slot (since slots per node is an even number, system will check the left slot neighbor, 70)<br/>
	///	    - Compare key of item sought (79) w/ 70<br/>
	///	2) Since 79 is greater than 70 and less than 90, system knows that item being sought is not on the current node (root node).<br/>
	///	    It will check proceed searching to the child node, in this case, "right child" node of 70<br/>
	///	    - Use the child node on the right of 70 to traverse the graph one level down.<br/>
	///	3) Do binary search on the newly traversed node to find 79<br/>
	///	    - Binary search will detect that 79 is in newly traversed node<br/>
	///	    - System will make 79's slot address (node and slot index on the node) the current item and will<br/>
	///	    - Stop searching as item was found!<br/>
	///	    - "CurrentEntry", "CurrentKey" and "CurrentValue" will return current item's dictionary entry, key and value respectively<br/><br/>
	///	
	///	NOTE: in above searching process to find an item out of 24 items in the tree,<br/>
	///	it took only 4 comparisons (comparing with keys: 70, 90, 78 and 79 itself) and 1 node traversal, a least expensive search operation indeed!!<br/>
	///	But what can be more interesting is the fact that nodes increase horizontally in a B-Tree, so, the number of comparisons and node <br/>
	///	traversals in searching for an item	for a so much bigger load will still be maintained to a minimum.<br/><br/>
	///	
	///	Much more, this B-Tree implementation guarantees insertion and deletion caused "load balancing" to be maintained at a consistent<br/>
	///	least expensive operation unlike other B-Tree implementations which suffer from performance hit when load balancing on said scenario.<br/><br/>
	///	
	///	Compare it and see the big boost in using BTreeGold!!
	/// </remarks>
#if !DEVICE
	[Serializable]
#endif
	public class BTree : IBTree
	{
		/// <summary>
		/// The B-Tree enumerator
		/// </summary>
		internal class BTreeEnumerator : IDictionaryEnumerator
		{
			/// <summary>
			/// Constructor. Pass the B-Tree instance you want to enumerate its items/elements on.
			/// </summary>
			/// <param name="BTree">BTree instance items will be enumerated</param>
			public BTreeEnumerator(BTree BTree)
			{
				this.BTree = BTree;
				this.Reset();
			}
			/// <summary>
			/// Returns current BTree entry/record
			/// </summary>
			public DictionaryEntry Entry
			{
				get
				{
					return (DictionaryEntry)BTree.CurrentEntry;
				}
			}
			/// <summary>
			/// Returns Key of the current record
			/// </summary>
			public object Key 
			{
				get
				{
					return BTree.CurrentKey;
				}
			}
			/// <summary>
			/// Returns Value of the current record
			/// </summary>
			public object Value
			{
				get
				{
					return BTree.CurrentValue;
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
			/// <summary>
			/// Returns Current record
			/// </summary>
			/// <exception cref="InvalidOperationException">Throws InvalidOperationException exception if Reset was called without calling MoveNext</exception>
 			public object Current
			{
				get
				{
					if (!bWasReset)
					{
						switch(BTree.itemType)
						{
							case ItemType.Default:
								return BTree.CurrentEntry;
							case ItemType.Key:
								return BTree.CurrentKey;
							case ItemType.Value:
								return BTree.CurrentValue;
						}
					}
					throw new InvalidOperationException(BTree.GetStringResource("ResetError"));
				}
			}
			internal BTree BTree;
			private bool bWasReset;
		}
		/// <summary>
		/// Use this constructor if:<br/>
		/// - you want to provide number of slots per node of the tree. <br/>
		/// </summary>
		/// <param name="SlotLen">Number of slots per node</param>
		/// <example>BTree b3(BTree.ValidSlotLengths.SixSlots);</example>
		public BTree(ValidSlotLengths SlotLen)
		{
			btree = new BTreeAlgorithm((ValidSlotLengths)SlotLen);
		}
		/// <summary>
		/// Default constructor. Use this if you want:<br/>
		/// - default (6) slots per node <br/>
		/// - default sorting (Ascending)<br/>
		/// - default comparer
		/// </summary>
		public BTree()
		{
			btree = new BTreeAlgorithm();
		}
		/// <summary>
		/// Copy constructor. This causes the new instance to copy the 'BTree' instance<br/>
		/// passed as parameter. All items are copied including Comparer object and sort order.
		/// NOTE: Items stored on the Tree are not duplicated.
		/// </summary>
		/// <param name="BTree">BTree object you want to duplicate all its btree graph into this new btree instance</param>
		public BTree(BTree BTree)
		{
			btree = new BTreeAlgorithm((ValidSlotLengths)BTree.btree.SlotLength, BTree.btree.Comparer);
			this.SortOrder = BTree.SortOrder;

			BTree.MoveFirst();
			while (true)
			{
				btree.Add(BTree.CurrentEntry);
				if (!BTree.MoveNext())
					break;
			}
			btree.MoveFirst();
		}
		/// <summary>
		/// Use this constructor if you want to:<br/>
		/// - provide your own Comparer object that defines how your records will be sorted/arranged<br/>
		/// - use default 6 slots per node<br/>
		/// - use default ascending sort order
		/// </summary>
		/// <param name="Comparer">IComparer implementation that defines how records will be sorted</param>
		public BTree(IComparer Comparer)
		{
			btree = new BTreeAlgorithm(Comparer);
		}
		/// <summary>
		/// Use this constructor if you want to:<br/>
		/// - provide number of slots per node <br/>
		/// - provide your comparer object<br/>
		/// - use default sort order (ascending)
		/// </summary>
		/// <param name="SlotLen">Number of slots per node</param>
		/// <param name="Comparer">compare object defining how records will be sorted</param>
		public BTree(ValidSlotLengths SlotLen, IComparer Comparer)
		{
			btree = new BTreeAlgorithm((ValidSlotLengths)SlotLen, Comparer);
		}
		/// <summary>
		/// Use this constructor if you want to:<br/>
		/// - provide your desired sort order type<br/>
		/// - use default slots per node (6)<br/>
		/// - use default comparer object
		/// </summary>
		/// <param name="SortOrder">sort order type</param>
		/// <example>BTree b3(BTree.SortOrderType.Ascending</example>
		public BTree(SortOrderType SortOrder)
		{
			this.SortOrder = SortOrder;
			btree = new BTreeAlgorithm();
		}
		/// <summary>
		/// Use this constructor if you want to:<br/>
		/// - provide your desired sort order <br/>
		/// - your Comparer object that defines how items are sorted/organized.<br/>
		/// - use default slots per node (6)
		/// </summary>
		/// <param name="Comparer">object used when comparing keys</param>
		/// <param name="SortOrder">Sort Order type</param>
		/// <example>BTree b3(BTree.SortOrderType.Ascending</example>
		public BTree(IComparer Comparer, SortOrderType SortOrder)
		{
			this.SortOrder = SortOrder;
			btree = new BTreeAlgorithm(Comparer);
		}
		/// <summary>
		/// Use this constructor if you want to:<br/>
		/// - provide your number of slots per node<br/>
		/// - your Comparer object<br/>
		/// - your sort order type
		/// </summary>
		/// <param name="SlotLen">Number of slots per node</param>
		/// <param name="Comparer">Comparer object</param>
		/// <param name="SortOrder">Sort Order Type</param>
		public BTree(ValidSlotLengths SlotLen, IComparer Comparer, SortOrderType SortOrder)
		{
			this.SortOrder = SortOrder;
			btree = new BTreeAlgorithm((ValidSlotLengths)SlotLen, Comparer);
		}

		/// <summary>
		/// Check if  o is one of .Net's built in value types
		/// </summary>
		/// <param name="o"></param>
		/// <returns></returns>
		public static bool IsSimpleType(object o)
		{
			return o is float ||
				o is short ||
				o is ushort ||
				o is double ||
				o is bool ||
				o is byte ||
				o is sbyte ||
				o is char ||
				o is decimal ||
				o is int ||
				o is uint ||
				o is long ||
				o is ulong ||
				o is DateTime;
		}

		/// <summary>
		/// Returns the Synchronized version of BTree
		/// </summary>
		/// <param name="BTree">BTree object to be wrapped in a synchronized btree wrapper</param>
		/// <returns>Synchronized BTree object</returns>
		public static ThreadSafeBTree Synchronized(BTree BTree)
		{
			return new ThreadSafeBTree(BTree);
		}
		/// <summary>
		/// Returns the Synchronized version of BTree
		/// </summary>
		/// <returns>Synchronized BTree object</returns>
		public IBTree Synchronized()
		{
			return Synchronized(this);
		}

		/// <summary>
		/// Returns current sort order. Setting to a different sort order will 
		/// reset BTree. First item according to sort order will be current item.
		/// </summary>
		public SortOrderType SortOrder
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

		/// <summary>
		/// BTree indexer. Given a key, will return its value.
		/// If key is not found, will add a new entry having passed 
		/// params key and value.
		/// </summary>
		virtual public object this[object key]
		{
			get
			{
				if (key == null)
					throw new ArgumentNullException("key");
				if (CurrentKey != null && 
					Comparer != null && Comparer.Compare(this.CurrentKey, key) == 0)
					return CurrentValue;
				if (btree.Root.Search(btree, key, false))
					return this.CurrentValue;
				return null;
			}
			set
			{
				if (key == null)
					throw new ArgumentNullException("key");
				if ((CurrentKey != null &&
					Comparer != null && Comparer.Compare(this.CurrentKey, key) == 0) ||
					btree.Root.Search(btree, key, false))
					CurrentValue = value;
				else	// if not found, add new entry/record. 
						// NOTE: this is .net compliance feature
					Add(key, value);
			}
		}

		//***************** Collections.BTree.IDictionary API
		/// <summary>
		/// Returns the current item (DictionaryEntry having key and value pair) if valid, else null.
		/// NOTE: you need to check the result if not null and cast to 'DictionaryEntry' to access Key
		/// and/or Value.
		/// </summary>
		virtual public DictionaryEntry CurrentEntry
		{
			get
			{
				if (btree.CurrentEntry != null)
					return (DictionaryEntry)btree.CurrentEntry;
				return new DictionaryEntry();
			}
		}
		/// <summary>
		/// Returns current item's key
		/// </summary>
		virtual public object CurrentKey
		{
			get
			{
				if (btree.CurrentEntry != null)
					return CurrentEntry.Key;
                return null;
			}
		}
		/// <summary>
		/// Returns/sets current item's value
		/// </summary>
		virtual public object CurrentValue
		{
			get
			{
				if (btree.CurrentEntry != null)
					return CurrentEntry.Value;
				return null;
			}
			set
			{
				if (!(btree.CurrentItem.Node == null || btree.CurrentItem.Node.Slots[btree.CurrentItem.NodeItemIndex] == null))
				{
					DictionaryEntry o = new DictionaryEntry(this.CurrentKey, value);
					btree.CurrentItem.Node.Slots[btree.CurrentItem.NodeItemIndex] = o;
				}
				else
					throw new InvalidOperationException(BTree.GetStringResource("InvalidOperationError"));
			}
		}

		/// <summary>
		/// Make the next item in the sort order to be the current item
		/// </summary>
		/// <returns>true if successful, false otherwise</returns>
		public bool MoveNext()
		{
			if (this.SortOrder == SortOrderType.Ascending)
				return btree.MoveNext();
			return btree.MovePrevious();
		}

		/// <summary>
		/// Make the previous item in the sort order to be the current item
		/// </summary>
		/// <returns>Returns true if successful, false otherwise</returns>
		public bool MovePrevious()
		{
			if (this.SortOrder == SortOrderType.Ascending)
				return btree.MovePrevious();
			return btree.MoveNext();

			//if (this.SortOrder == SortOrderType.Ascending)
			//{
			//    bool eof = EndOfTree();
			//    if (eof)
			//        return btree.MoveLast();
			//    return btree.MovePrevious();
			//}
			//if (EndOfTree())
			//    return btree.MoveFirst();
			//return btree.MoveNext();
		}
		/// <summary>
		/// Make 1st item the current item. Returns false if no item
		/// </summary>
		/// <returns>returns true if successful, false otherwise</returns>
		public bool MoveFirst()
		{
			if (this.SortOrder == SortOrderType.Ascending)
				return btree.MoveFirst();
			return btree.MoveLast();
		}
		/// <summary>
		/// Make last item the current item. Returns false if no item
		/// </summary>
		/// <returns>true = successful, false otherwise</returns>
		public bool MoveLast()
		{
			if (this.SortOrder == SortOrderType.Ascending)
				return btree.MoveLast();
			return btree.MoveFirst();
		}

		/// <summary>
		/// Search btree for an item having ObjectToSearch)
		/// </summary>
		/// <param name="Key">Key of record to search for</param>
		/// <returns>true if successful, false otherwise</returns>
		public bool Search(object Key)
		{
			if (Key == null)
				throw new ArgumentNullException("Key");
			return btree.Search(Key, false);
		}
		/// <summary>
		/// Search btree for the entry having its key equal to 'Key'
		/// </summary>
		/// <param name="Key">Key of record to search for</param>
		/// <param name="GoToFirstInstance">if true and Key is duplicated, will make first instance of duplicated keys the current record so one can easily get/traverse all records having the same keys using 'MoveNext' function</param>
		/// <returns>true if successful, false otherwise</returns>
		virtual public bool Search(object Key, bool GoToFirstInstance)
		{
			return btree.Search(Key, GoToFirstInstance);
		}

		//***************** .NET ICollection API
		/// <summary>
		/// Implements the ISerializable interface and raises the deserialization event when the deserialization is complete.
		/// </summary>
        /// <param name="sender">Source of the deserialization event</param>
#if (!DEVICE)
		public void OnDeserialization(object sender)
		{
			// save current sort order
			// save btree
			//		- save comparer
			//		- save other btree data
			try
			{
				this.CurrentSortOrder = (SortOrderType)SerializationInfo.GetInt32("SortOrder");
			}
			catch(System.Exception e)
			{
				throw new System.Runtime.Serialization.SerializationException(GetStringResource("CurrentSortOrderDeSerializeError"), e);
			}
			IComparer Comparer;
			// save comparer, SlotLength, save Keys & save Values
			try
			{
				Comparer = (IComparer)SerializationInfo.GetValue("Comparer", typeof(IComparer));
			}
			catch(System.Exception e)
			{
				throw new System.Runtime.Serialization.SerializationException(GetStringResource("ComparerDeSerializeError"), e);
			}
			ValidSlotLengths SlotLength;
			try
			{
				SlotLength = (ValidSlotLengths)SerializationInfo.GetByte("SlotLength");
			}
			catch(System.Exception e)
			{
				throw new System.Runtime.Serialization.SerializationException(GetStringResource("SlotLengthDeSerializeError"), e);
			}

			btree = new BTreeAlgorithm((ValidSlotLengths)SlotLength, Comparer);
			object[] Keys, Values;
			try
			{
				Keys = (object[])SerializationInfo.GetValue("Keys", typeof(object));
			}
			catch(System.Exception e)
			{
				if (e.Message == "Members Keys was not found.")
					Keys = new object[0];
				else
					throw new System.Runtime.Serialization.SerializationException(GetStringResource("KeysDeSerializeError"), e);
			}
			if (Keys.Length == 0)
				Values = new object[0];
			else
				try
				{
					Values = (object[])SerializationInfo.GetValue("Values", typeof(object));
				}
				catch(System.Exception e)
				{
					throw new System.Runtime.Serialization.SerializationException(GetStringResource("ValuesDeSerializeError"), e);
				}
			if (Keys.Length != Values.Length)
				throw new System.Runtime.Serialization.SerializationException(GetStringResource("KeysAndValuesDifferInSizeError"));

			for(int i = 0; i < Keys.Length; i++)
			{
				if (Keys[i] == null)
					throw new System.Runtime.Serialization.SerializationException(GetStringResource("DeSerializedNullKeyError"));
				this.Add(Keys[i], Values[i]);
			}
		}
		/// <summary>
		/// Used by serializer to get btree graph's serializable info
		/// </summary>
		/// <param name="info">The SerializationInfo to populate with data.</param>
		/// <param name="context">The destination (see StreamingContext) for this serialization.</param>
		public void GetObjectData(System.Runtime.Serialization.SerializationInfo info, 
			System.Runtime.Serialization.StreamingContext context)
		{
			// save current sort order
			// save btree
			//		- save comparer
			//		- save other btree data
			info.AddValue("SortOrder", (int)this.CurrentSortOrder);
			// save comparer, SlotLength, save Keys & save Values
			if (btree.Comparer != null)
				info.AddValue("Comparer", btree.Comparer, btree.Comparer.GetType());
			else
				info.AddValue("Comparer", null, typeof(IComparer));
			info.AddValue("SlotLength", (byte)btree.SlotLength);
			object[] Item = new object[btree.Count], Value = new object[btree.Count];
			if (Item.Length > 0)
				this.Keys.CopyTo(Item, 0);
			info.AddValue("Keys", Item, Item.GetType());
			if (Value.Length > 0)
				this.Values.CopyTo(Value, 0);
			info.AddValue("Values", Value, Value.GetType());
		}
#endif
        /// <summary>
		/// Add adds an entry with the provided key and value into the BTree.
		/// Duplicate keys are allowed in BTree unlike in a Dictionary/HashTable
		/// where key is required to be unique.
		/// </summary>
		/// <param name="key">key of item you want to add to the collection</param>
		/// <param name="value">item you want to add to the collection</param>
		public virtual void Add(object key, object value)
		{
			if (key == null)
				throw new ArgumentNullException("key");
			DictionaryEntry o = new DictionaryEntry(key, value);
			btree.Add(o);
		}
		
		/// <summary>
		/// IDictionary GetEnumerator Implementation
		/// </summary>
		/// <returns>Returns a clone of this collection that can track its tree traversal state (per current record pointer)</returns>
		public System.Collections.IDictionaryEnumerator GetEnumerator()
		{
			return new BTreeEnumerator((BTree)this.Clone());
		}

		/// <summary>
		/// Contains determines whether this collection contains an entry with the specified key.
		/// </summary>
		/// <param name="key">key to look for</param>
		/// <returns></returns>
		public bool Contains(object key)
		{
			return Search(key);
		}
		/// <summary>
		/// Removes entry with key.
		/// </summary>
		/// <param name="key">key of entry to delete from collection</param>
		virtual public void Remove(object key)
		{
			if (key == null)
				throw new ArgumentNullException("key");
			//DictionaryEntry o = new DictionaryEntry(key, null);
			if (btree.Search(key))
			{
				DictionaryEntry ItemToRemove = (DictionaryEntry)btree.CurrentEntry;
				btree.Remove();	// search made item having "key" the current item
				ItemToRemove.Key = null;
				ItemToRemove.Value = null;
			}
		}

		/// <summary>
		/// Shallow copy this collection and returns the copy.
		/// NOTE: this btree's graph is not duplicated, it is shared w/ the "clone".
		/// </summary>
		public object Clone()
		{
			return new BTree(this, this.itemType);
		}
		/// <summary>
		/// Set to null all collected items and their internal buffers
		/// </summary>
		virtual public void Clear()
		{
			if (btree != null)
			{
				if (values != null)
				{
					((BTree)values).Clear();
					values = null;
				}
				if (keys != null)
				{
					((BTree)keys).Clear();
					keys = null;
				}
				btree.Clear();
			}
		}
		/*
		/// <summary>
		/// Set to null all collected items and their internal buffers.
		/// If 'IsGarbageCollect' is true, forces Garbage Collection for better memory reclamation.
		/// </summary>
		/// <param name="IsGarbageCollect">true will call GC.Collect after clearing the tree, else will not</param>
		public void Clear(bool IsGarbageCollect)
		{
			if (btree != null)
				btree.Clear(IsGarbageCollect);
		}
		*/
		/// <summary>
		/// Returns the number of items in the btree
		/// </summary>
		public int Count
		{
			get
			{
				return btree.Count;
			}
		}
		/// <summary>
		/// Get/Set Comparer object used in sorting items of the collection
		/// </summary>
		internal /*protected*/ IComparer Comparer
		{
			get
			{
				return this.btree.Comparer;
			}
			set
			{
				btree.Comparer = value;
			}
		}
		/// <summary>
		/// Returns true if current record pointer is beyond last item in tree.
		/// </summary>
		/// <returns></returns>
		public bool EndOfTree()
		{
			return btree.CurrentEntry == null;
		}

		/// <summary>
		/// Returns "false", which means this collection is read/write
		/// </summary>
		public bool IsReadOnly
		{
			get
			{
				return false;
			}
		}
		/// <summary>
		/// IsFixedSize returns "false" as this collection can hold variable number of items
		/// </summary>
		public bool IsFixedSize
		{
			get
			{
				return false;
			}
		}
		/// <summary>
		/// IsSynchronized returns "false". 
		/// Use 'Collections.BTree.Dictionary.Synchronized' property to get the sync BTree instance.
		/// </summary>
		public bool IsSynchronized
		{
			get
			{
				return false;
			}
		}
		/// <summary>
		/// Returns the object used for thread synchronization on multiple threads' access to this BTree object.
		/// </summary>
		public object SyncRoot
		{
			get
			{
				if (syncRoot == null)
					syncRoot = new Synchronizer();
				return syncRoot;
			}
		}
		/// <summary>
		/// Copy into an array contents of the btree.
		/// </summary>
		/// <param name="DestArray">Destination array that will contain the items.</param>
		/// <param name="StartIndex">Start index to start copying into</param>
		/// <remarks>
		/// On error, throws following Exceptions:
		/// </remarks>
		/// <remarks>
		/// ArgumentNullException - array is a null reference (Nothing in Visual Basic).
		/// </remarks>
		/// <remarks>
		/// ArgumentOutOfRangeException - arrayIndex is less than zero.
		/// </remarks>
		/// <remarks>
		/// ArgumentException - array is multidimensional.
		/// -or-
		/// </remarks>
		/// <remarks>
		/// arrayIndex is equal to or greater than the length of array.
		/// -or-
		/// </remarks>
		/// <remarks>
		/// arrayIndex is equal to or greater than the length of array.
		/// -or-
		/// </remarks>
		/// <remarks>
		/// The number of elements in the source Hashtable is greater than the available space from arrayIndex to the end of the destination array.
		/// </remarks>
		public void CopyTo(Array DestArray, int StartIndex)
		{
			if (DestArray == null)
				throw new ArgumentNullException(BTree.GetStringResource("DestArray"), BTree.GetStringResource("DestArrayIsNull"));
			if (StartIndex < 0)
#if DEVICE
				throw new ArgumentOutOfRangeException(BTree.GetStringResource("DestArray") + " " + StartIndex.ToString() + " " + BTree.GetStringResource("StartIndexIsNegative"));
#else
				throw new ArgumentOutOfRangeException(BTree.GetStringResource("DestArray"), (object)StartIndex, BTree.GetStringResource("StartIndexIsNegative"));
#endif
			if (DestArray.Rank > 1)
				throw new ArgumentException(BTree.GetStringResource("DestArrayIsMulti"));
			if (StartIndex >= DestArray.Length)
				throw new ArgumentException(BTree.GetStringResource("StartIndexIsGreaterThanLength"));
			if (this.Count > DestArray.Length - StartIndex)
				throw new ArgumentException(BTree.GetStringResource("BTreeHasMoreElems"));
			foreach(object o in this)
			{
				DestArray.SetValue(o,StartIndex);
				StartIndex++;
			}
		}
		System.Collections.ICollection keys;
		/// <summary>
		/// Returns a version of this BTree whose members are all Keys of the members.
		/// NOTE: this is not bindable to most controls as returned ICollection object is not implementing IList.
		/// </summary>
		public System.Collections.ICollection Keys
		{
			get
			{
				if (keys == null)
					keys = new BTree(this, ItemType.Key);
				return keys;
			}
		}
		System.Collections.ICollection values;
		/// <summary>
		/// Returns a version of this BTree whose members are all Values of the members.
		/// NOTE: this is not bindable to most controls as returned ICollection object is not implementing IList.
		/// </summary>
		public System.Collections.ICollection Values
		{
			get
			{
				if (values == null)
					values = new BTree(this, ItemType.Value);
				return values;
			}
		}
		/// <summary>
		/// Use this constructor if you want to clone or shallow copy your BTree instance.
		/// </summary>
		/// <param name="BTree">BTree instance you want to shallow copy its tree graph</param>
		/// <param name="itemType">Type of Item the new BTree instance will hold. Normally, itemType.Default is used, internally, BTreeGold uses Key and Value types for reusing BTree to enumerate Keys and Values respectively.</param>
		internal BTree(BTree BTree, ItemType itemType)
		{
			btree = new BTreeAlgorithm(BTree.btree);
			this.SortOrder = BTree.SortOrder;
			this.itemType = itemType;
			syncRoot = (Synchronizer)BTree.SyncRoot;
		}

		/// <summary>
		/// IEnumerable Interface Implementation
		/// </summary>
		/// <returns></returns>
		System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
		{
			return new BTreeEnumerator((BTree)this.Clone());
		}

#if !DEVICE
		/// <summary>
		/// Serialization constructor
		/// </summary>
		/// <param name="info"></param>
		/// <param name="context"></param>
		BTree(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context)
		{
			this.SerializationInfo = info;
		}
#endif

		/// <summary>
		/// Retrieves and returns String Resource from compiled resource file or satellite assembly.
		/// </summary>
		/// <param name="Name">Name of string to retrieve</param>
		/// <returns></returns>
		public static string GetStringResource(string Name)
		{
			return ResManager.GetString(Name);
		}

		/// <summary>
		/// Item type BTree will store. Defaults to 'Default' Item type
		/// </summary>
		internal ItemType itemType = ItemType.Default;

		private static System.Resources.ResourceManager ResManager = new System.Resources.ResourceManager("Sop.Collections.BTree.BTreeResources", typeof(BTree).Assembly);

		private SortOrderType CurrentSortOrder = SortOrderType.Ascending;
#if !DEVICE
		private System.Runtime.Serialization.SerializationInfo SerializationInfo;
#endif
		internal BTreeAlgorithm btree = null;
		private Synchronizer syncRoot = null;
	
		/*
		#region IListSource Members

		IList IListSource.GetList()
		{
			object[] objects = new object[Count];
			this.Values.CopyTo(objects, 0);
			return objects;
		}
		/// <summary>
		/// Returns false as B-Tree can be irregularly shaped graph.
		/// </summary>
		bool IListSource.ContainsListCollection
		{
			get
			{
				return false;
			}
		}

		#endregion
		*/
	}	// end of BTree
	/// <summary>
	/// BTree domain System default comparer. This comparer provides/uses System.Collections.Comparer.Default.Compare function.
	/// </summary>
	internal class BTreeComparer : IComparer
	{
		/// <summary>
		/// Compare object x's key with object y's key.<br/>
		/// Returns:<br/>
		///		&lt; 0 if x.Key is &lt; y.Key<br/>
		///		&gt; 0 if x.Key &gt; y.Key<br/>
		///		== 0 if x.Key == y.Key
		/// </summary>
		/// <param name="x">1st object whose key is to be compared</param>
		/// <param name="y">2nd object whose key is to be compared</param>
		/// <returns></returns>
		public int Compare(object x, object y)
		{
			object xKey = x;
			object yKey = y;
			if (x is DictionaryEntry)
				xKey = ((DictionaryEntry)x).Key;
			if (y is DictionaryEntry)
				yKey = ((DictionaryEntry)y).Key;
			return Comparer.Compare(xKey, yKey);
		}
		internal BTreeComparer(IComparer Comparer)
		{
			this.Comparer = Comparer;
		}
		private IComparer Comparer;
	}
	/// <summary>
	/// BTree domain default comparer. This comparer provides string comparison behavior
	/// </summary>
#if !DEVICE
		[Serializable]
#endif
	internal class BTreeDefaultComparer : IComparer
	{
		/// <summary>
		/// Compare string value of object x's key with object y's key<br/>
		/// Returns:<br/>
		///		&lt; 0 if x.Key is &lt; y.Key<br/>
		///		&gt; 0 if x.Key &gt; y.Key<br/>
		///		== 0 if x.Key == y.Key
		/// </summary>
		/// <param name="x">1st object whose key is to be compared</param>
		/// <param name="y">2nd object whose key is to be compared</param>
		/// <returns></returns>
		public int Compare(object x, object y)
		{
			try
			{
				object xKey = x;
				if (x is DictionaryEntry)
					xKey = ((DictionaryEntry)x).Key;
				object yKey = y;
				if (y is DictionaryEntry)
					yKey = ((DictionaryEntry)y).Key;
				return xKey.ToString().CompareTo(yKey.ToString());
			}
			catch(Exception e)
			{
				throw new InvalidOperationException(BTree.GetStringResource("NoComparerError"), e);
			}
		}
	}
	/// <summary>
	/// BTree domain System default comparer. This comparer provides/uses System.Collections.Comparer.Default.Compare function.
	/// </summary>
#if !DEVICE
		[Serializable]
#endif
	internal class SystemDefaultComparer : IComparer
	{
		/// <summary>
		/// Compare object x's key with object y's key.<br/>
		/// Returns:<br/>
		///		&lt; 0 if x.Key is &lt; y.Key<br/>
		///		&gt; 0 if x.Key &gt; y.Key<br/>
		///		== 0 if x.Key == y.Key
		/// </summary>
		/// <param name="x">1st object whose key is to be compared</param>
		/// <param name="y">2nd object whose key is to be compared</param>
		/// <returns></returns>
		public int Compare(object x, object y)
		{
			try
			{
				if (IsComparingObject)
				{
					int xHash = x.GetHashCode();
					int yHash = y.GetHashCode();
					return xHash.CompareTo(yHash);
				}
				object xKey = x;
				if (x is DictionaryEntry)
					xKey = ((DictionaryEntry)x).Key;
				object yKey = y;
				if (y is DictionaryEntry)
					yKey = ((DictionaryEntry)y).Key;
				return System.Collections.Comparer.Default.Compare(xKey, yKey);
			}
			catch(Exception e)
			{
				if (!(x is ValueType || IsComparingObject))
				{
					IsComparingObject = true;
					if (x == null)
						throw new ArgumentNullException("x");
					if (y == null)
						throw new ArgumentNullException("y");
					try
					{
						int xHash = x.GetHashCode();
						int yHash = y.GetHashCode();
						return xHash.CompareTo(yHash);
					}
					catch { }
				}
				throw new InvalidOperationException(BTree.GetStringResource("NoComparerError"), e);
			}
		}
		bool IsComparingObject;
	}
}

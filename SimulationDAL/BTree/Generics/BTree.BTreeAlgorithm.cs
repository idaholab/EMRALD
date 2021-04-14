/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */

using System;
using System.Collections;
using System.ComponentModel;
using System.Collections.Generic;

namespace Sop.Collections.Generic.BTree
{
	class BTreeSlotComparer<TKey, TValue> : System.Collections.Generic.IComparer<BTreeItem<TKey, TValue>>
	{
		public BTreeSlotComparer(System.Collections.Generic.IComparer<TKey> Comparer)
		{
			KeyComparer = Comparer;
		}
		public System.Collections.Generic.IComparer<TKey> KeyComparer;
		public int Compare(BTreeItem<TKey, TValue> x, BTreeItem<TKey, TValue> y)
		{
			return KeyComparer.Compare(x.Key, y.Key);
		}
	}
	/// <summary>
    /// BTreeAlgorithm is the core BTree class wrapper and implements BTree Collection interface.
    /// B-Tree data structure and algorithm are implemented in <see cref="BTreeAlgorithm.TreeNode">"TreeNode"</see> class
    /// </summary>
    internal partial class BTreeAlgorithm<TKey, TValue>
    {
		public BTreeAlgorithm(System.Collections.Generic.Comparer<TKey> Comparer)
		{
			this.Comparer = Comparer;
		}
		/// <summary>
		/// Constructor to use if you want to provide the number of slots per node of the tree
		/// </summary>
		/// <param name="SlotLen">number of slots per node</param>
		public BTreeAlgorithm(byte SlotLen)
		{
			Initialize(SlotLen);
			this.Comparer = System.Collections.Generic.Comparer<TKey>.Default;
		}
		/// <summary>
		/// Constructor to use if you want to use default number of slots per node (6)
		/// </summary>
		public BTreeAlgorithm()
		{
			Initialize(DefaultSlotLength);
			this.Comparer = System.Collections.Generic.Comparer<TKey>.Default;
		}
		/// <summary>
		/// Constructor to use if you want to provide your own Comparer object that defines
		/// how your records will be sorted/arranged
		/// </summary>
		/// <param name="Comparer">IComparer implementation that defines how records will be sorted</param>
		public BTreeAlgorithm(IComparer<TKey> Comparer)
		{
			Initialize(DefaultSlotLength);
			if (Comparer == null)
				Comparer = System.Collections.Generic.Comparer<TKey>.Default;
			this.Comparer = Comparer;
		}
		/// <summary>
		/// Constructor to use if you want to provide number of slots per node and your comparer object
		/// </summary>
		/// <param name="SlotLen">Number of slots per node</param>
		/// <param name="Comparer">compare object defining how records will be sorted</param>
		public BTreeAlgorithm(byte SlotLen, IComparer<TKey> Comparer)
		{
			Initialize(SlotLen);
			if (Comparer == null)
				Comparer = System.Collections.Generic.Comparer<TKey>.Default;
			this.Comparer = Comparer;
		}
		public const byte DefaultSlotLength = 12;

		internal BTreeAlgorithm(BTreeAlgorithm<TKey, TValue> BTree)
		{
			Initialize(BTree);
		}

		const int MaxRecycleCount = 80;
		List<TreeNode> RecycledNodes = new List<TreeNode>(MaxRecycleCount);
		internal void AddRecycleNode(TreeNode Node)
		{
			Node.Clear(true);
			if (RecycledNodes.Count < MaxRecycleCount)
				RecycledNodes.Add(Node);
		}
		internal TreeNode GetRecycleNode(TreeNode Parent)
		{
			TreeNode r = null;
			if (RecycledNodes.Count == 0)
				r = new TreeNode(this, Parent);
			else
			{
				r = RecycledNodes[0];
				RecycledNodes.RemoveAt(0);
				r.Initialize(this, Parent);
			}
			return r;
		}

		/// <summary>
		/// Returns a shallow copy of this BTreeAlgorithm
		/// </summary>
		/// <returns>Value of type BTreeAlgorithm</returns>
		public object Clone()
		{
			return (object)new BTreeAlgorithm<TKey, TValue>(this);
		}

		// Call this after the default constructor was invoked.
		private bool Initialize(byte bySlotLen)
		{
			if (bySlotLen < 2)
				throw new ArgumentOutOfRangeException("bySlotLen");
			if (bySlotLen % 2 != 0)
				bySlotLen++;

#if (!DEBUG && TRIALWARE)
		            const string ExpireMsg = "BTreeGold trial period has expired.\nVisit 4A site(http://www.4atech.net) to get details in getting a license.";
		            if (!System.IO.File.Exists("Trialware.dll") || 
		                Trialware.ExpirationManager.Instance == null ||
		                Trialware.ExpirationManager.Instance.IsExpired())
		                throw new InvalidOperationException(ExpireMsg);
#endif

			this.SlotLength = bySlotLen;
			Root = new TreeRootNode(this);
			SetCurrentItemAddress(Root, 0);
			TempSlots = new BTreeItem<TKey, TValue>[SlotLength + 1];
			TempChildren = new TreeNode[SlotLength + 2];
			return true;	// successful
		}

		/// <summary>
		/// Remove "Item" from the tree. Doesn't throw exception if "Item" is not found
		/// </summary>
		/// <param name="Item">Record to remove</param>
		public bool Remove(TKey Key)	// return true if found, else false
		{
			if (Count > 0)
			{
				BTreeItem<TKey, TValue> Item = new BTreeItem<TKey, TValue>(Key, default(TValue));
				if (CurrentEntry == null)
				{
					if (Root.Search(this, Item, false))
					{
						Remove();
						return true;
					}
				}
				else if (this.Comparer.Compare(CurrentEntry.Key, Key) == 0)
				{
					Remove();
					return true;
				}
				else
				{
					if (Root.Search(this, Item, false))
					{
						Remove();
						return true;
					}
				}
			}
			return false;
		}
		/// <summary>
		/// Set to null all collected items and their internal buffers.
		/// </summary>
		public void Clear()
		{
			if (Root != null)
			{
				Root.Clear();
				SetCurrentItemAddress(null, 0);
				Root.Count = 0;
				if (TempChildren != null)
					TreeNode.ResetArray(TempChildren, null);
				TempParent = null;
				if (TempParentChildren != null)
					TreeNode.ResetArray(TempParentChildren, null);
				if (TempSlots != null)
					TreeNode.ResetArray(TempSlots, null);
			}
		}
		/// <summary>
		/// Search btree for a certain record (Item). If current record is equal
		/// to Item then true will be returned without doing any search operation.
		/// This minimizes unnecessary BTree traversal. If Item is found, it becomes the current item.
		/// </summary>
		/// <param name="Item">record to search for</param>
		/// <returns>Returns true if found else, false</returns>
		public bool Search(TKey Key)
		{
			return this.Search(Key, false);
		}
		/// <summary>
		/// Search btree for a certain record (Item). If current record is equal
		/// to Item then true will be returned without doing any search operation.
		/// This minimizes unnecessary BTree traversal. If Item is found, it becomes the current item.
		/// </summary>
		/// <param name="Item">record to search for</param>
		/// <param name="GoToFirstInstance">if true, will make first instance of duplicated keys the current record</param>
		/// <returns>Returns true if found else, false</returns>
		public bool Search(TKey Key, bool GoToFirstInstance)
		{
			if (Count > 0)
			{
				if (CurrentEntry == null || Comparer.Compare(CurrentEntry.Key, Key) != 0 ||
					GoToFirstInstance)
				{
					BTreeItem<TKey, TValue> Item = new BTreeItem<TKey, TValue>(Key, default(TValue));
					bool r = Root.Search(this, Item, GoToFirstInstance);
					TreeNode.ResetArray(TempSlots, null);
					TempParent = null;
					return r;
				}
				return true;	// current entry is equal to ObjectToSearch!!
			}
			// tree is empty
			return false;
		}
		/// <summary>
		/// Go to 1st item of the tree
		/// </summary>
		/// <returns>returns true if successful, else false</returns>
		public bool MoveFirst()
		{
			if (this.Count > 0)
				return Root.MoveFirst(this);
			return false;
		}

		/// <summary>
		/// Go to next item of the tree
		/// </summary>
		/// <returns>Returns true if successful, else, false. Also returns false if Current record is null.</returns>
		public bool MoveNext()
		{
			if (!(CurrentItem.Node == null || CurrentItem.Node.Slots == null || CurrentItem.Node.Slots[CurrentItem.NodeItemIndex] == null))
				return CurrentItem.Node.MoveNext(this);
			return false;
		}
		/// <summary>
		/// Go to previous item of the tree
		/// </summary>
		/// <returns>Returns true if successful, else false</returns>
		public bool MovePrevious()
		{
			if (!(CurrentItem.Node == null || CurrentItem.Node.Slots == null || CurrentItem.Node.Slots[CurrentItem.NodeItemIndex] == null))
				return CurrentItem.Node.MovePrevious(this);
			return false;
		}
		/// <summary>
		/// Go to last item of the tree. If there is no item, returns false.
		/// </summary>
		/// <returns>Returns true if successful, else false</returns>
		public bool MoveLast()
		{
			if (this.Count > 0)
				return Root.MoveLast(this);
			return false;
		}

		/// <summary>
		/// Returns the number of collected items
		/// </summary>
		public int Count
		{
			get
			{
				return Root.Count;
			}
		}

		/// <summary>
		/// Insert "Item" to the correct location in the tree. Tree is maintained to be balanced and sorted.
		/// Add and Delete methods cause Current Record to be invalid (set to null).
		/// </summary>
		/// <param name="Item">Record to insert in the tree</param>
		public void Add(TKey Key, TValue Value)
		{
			Root.Add(this, new BTreeItem<TKey, TValue>(Key, Value));
			while (PromoteParent != null)
			{
				TreeNode n = PromoteParent;
				PromoteParent = null;
				n.Promote(this, (byte)PromoteIndexOfNode);
			}
			PromoteParent = null;
			PromoteIndexOfNode = 0;

			// Make the current item pointer point to null since we will add an item and addition to a
			// balanced Btree will re-arrange the slots and nodes thereby invalidating the current item pointer.
			// nullifying it is the simpler behavior. The higher level code will have to implement a different
			// approach to updating the current item pointer if it needs to.
			SetCurrentItemAddress(null, 0);
			Root.Count++;
			TreeNode.ResetArray(TempSlots, null);
			TempParent = null;
		}

		// Needed for cloning (shallow copy) this BTree.
		private void Initialize(BTreeAlgorithm<TKey, TValue> BTree)
		{
			this.SlotLength = BTree.SlotLength;
			this.Root = BTree.Root;

			//Copy CurrentItem. "Copy" as CurrentItem is value type.
			this.CurrentItem = BTree.CurrentItem;

			this.Comparer = BTree.Comparer;
			// create another set of temporary slots for thread safe 'Search' operation support
			TempSlots = new BTreeItem<TKey, TValue>[SlotLength + 1];
			TempChildren = new TreeNode[SlotLength + 2];
		}

		/// <summary>
		/// Returns current item, null if end of Btree.
		/// </summary>
		public BTreeItem<TKey, TValue> CurrentEntry
		{
			get
			{
				if (CurrentItem.Node != null)
				{
					if (CurrentItem.Node.Slots[CurrentItem.NodeItemIndex] != null)
						return CurrentItem.Node.Slots[CurrentItem.NodeItemIndex];
					else
						SetCurrentItemAddress(null, 0);
				}
				return null;
			}
		}

		/// <summary>
		/// Delete the current item from the tree. Tree is maintained to be balanced and sorted.
		/// </summary>
		internal protected void Remove()
		{
			BTreeItem<TKey, TValue> Temp = null;
			if (CurrentItem.Node != null)
				Temp = CurrentItem.Node.Slots[CurrentItem.NodeItemIndex];
			if (Temp != null)
			{
				CurrentItem.Node.Remove(this);
				do
				{
					FixVacatedSlot = false;
					CurrentItem.Node.FixTheVacatedSlot(this);
				} while (FixVacatedSlot);

				// Make the current item pointer point to null since we just deleted the current item. There is no efficient way to point the current item
				// pointer to point to the next or previous item. In BPlus this is possible but since this is not BPLus..
				SetCurrentItemAddress(null, 0);
				Root.Count--;
				Temp = null;

				TreeNode.ResetArray(TempSlots, null);
				TempParent = null;
			}
		}

		/// <summary>
		/// Get: returns the number of slots per node of all "TreeNodes"
		/// Set: assigns the number of slots per node of "TreeNodes"
		/// </summary>
		internal byte SlotLength
		{
			get
			{
				return slotLength;
			}
			set
			{
				slotLength = value;
			}
		}
		public System.Collections.Generic.IComparer<TKey> Comparer
		{
			get
			{
				return comparer;
			}
			set
			{
				comparer = value;
				SlotsComparer = new BTreeSlotComparer<TKey, TValue>(value); 
			}
		}

		/// <summary>
		/// This holds the Current Item Address (Current Node and Current Slot index)
		/// </summary>
		internal TreeNode.ItemAddress CurrentItem;
		/// <summary>
		/// This holds the Root Node (parentmost) of the TreeNodes
		/// </summary>
		internal TreeRootNode Root = null;

		/// <summary>
		/// Utility function to assign/replace current item w/ a new item.
		/// </summary>
		/// <param name="ItemNode">node of the new item</param>
		/// <param name="ItemIndex">slot index of the new item</param>
		protected void SetCurrentItemAddress(TreeNode ItemNode, byte ItemIndex)
		{
			CurrentItem.Node = ItemNode;
			CurrentItem.NodeItemIndex = ItemIndex;
		}

		System.Collections.Generic.IComparer<TKey> comparer;
		internal System.Collections.Generic.IComparer<BTreeItem<TKey, TValue>> SlotsComparer;
		private byte slotLength = DefaultSlotLength;
		private BTreeItem<TKey, TValue>[] TempSlots;
		private BTreeItem<TKey, TValue> TempParent;
		// Temp Children nodes. Only 2 since only left & right child nodes will be handled.
		private TreeNode[] TempChildren;
		private TreeNode[] TempParentChildren = new TreeNode[2];
	}
}

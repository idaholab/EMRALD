/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */
using System;
using System.Collections;
using System.ComponentModel;

namespace Sop.Collections.BTree
{
	/// <summary>
	/// BTreeAlgorithm is the core BTree class wrapper and implements BTree Collection interface.
	/// B-Tree data structure and algorithm are implemented in <see cref="BTreeAlgorithm.TreeNode">"TreeNode"</see> class
	/// </summary>
	internal partial class BTreeAlgorithm : Collections.BTree.ICollection
	{
		/// <summary>
		/// Insert "Item" to the correct location in the tree. Tree is maintained to be balanced and sorted.
		/// Add and Delete methods cause Current Record to be invalid (set to null).
		/// </summary>
		/// <param name="Item">Record to insert in the tree</param>
		public void Add(object Item)
		{
			Root.Add(this, Item);
			while (PromoteParent != null)
			{
				TreeNode n = PromoteParent;
				PromoteParent = null;
				n.Promote(this, (byte)PromoteIndexOfNode);
			}
			PromoteParent = null;
			PromoteIndexOfNode = 0;

			// Make the current item pointer point to null since we will add an item and addition to a balanced Btree will re-arrange the slots and nodes thereby invalidating the current item pointer. nullifying it is the simpler behavior. The higher level code will have to implement a different approach to updating the current item pointer if it needs to.
			SetCurrentItemAddress(null, 0);
			Root.Count++;

			TreeNode.ResetArray(TempSlots, null);
			TempParent = null;
		}
		/// <summary>
		/// Remove "Item" from the tree. Doesn't throw exception if "Item" is not found
		/// </summary>
		/// <param name="Item">Record to remove</param>
		public void Remove(object Item)	// return true if found, else false
		{
			if (Count > 0)
			{
				if (CurrentEntry == null)
				{
					if (Root.Search(this, Item, false))
						Remove();
				}
				else if (ComparerWrapper.Compare(CurrentEntry, Item) == 0)
				{
					Remove();
				}
				else
				{
					if (Root.Search(this, Item, false))
						Remove();
				}
			}
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
		public bool Search(object Item)
		{
			return this.Search(Item, false);
		}
		/// <summary>
		/// Search btree for a certain record (Item). If current record is equal
		/// to Item then true will be returned without doing any search operation.
		/// This minimizes unnecessary BTree traversal. If Item is found, it becomes the current item.
		/// </summary>
		/// <param name="Item">record to search for</param>
		/// <param name="GoToFirstInstance">if true, will make first instance of duplicated keys the current record</param>
		/// <returns>Returns true if found else, false</returns>
		public bool Search(object Item, bool GoToFirstInstance)
		{
			if (Count > 0)
			{
				if (CurrentEntry == null || ComparerWrapper.Compare(CurrentEntry, Item) != 0 ||
					GoToFirstInstance)
				{
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
		/// Get: returns the number of slots per node of all "TreeNodes"
		/// Set: assigns the number of slots per node of "TreeNodes"
		/// </summary>
		internal byte SlotLength
		{
			get
			{
				return (byte)slotLength;
			}
			set
			{
				slotLength = (ValidSlotLengths)value;
			}
		}

		/// <summary>
		/// Constructor to use if you want to provide the number of slots per node of the tree
		/// </summary>
		/// <param name="SlotLen">number of slots per node</param>
		public BTreeAlgorithm(ValidSlotLengths SlotLen)
		{
			Initialize(SlotLen);
			this.Comparer = new SystemDefaultComparer();
		}
		/// <summary>
		/// Constructor to use if you want to use default number of slots per node (6)
		/// </summary>
		public BTreeAlgorithm()
		{
			Initialize(ValidSlotLengths.DefaultSlots);
			this.Comparer = new SystemDefaultComparer();
		}
		/// <summary>
		/// Constructor to use if you want to provide your own Comparer object that defines
		/// how your records will be sorted/arranged
		/// </summary>
		/// <param name="Comparer">IComparer implementation that defines how records will be sorted</param>
		public BTreeAlgorithm(IComparer Comparer)
		{
			Initialize(ValidSlotLengths.DefaultSlots);
			if (Comparer == null)
				Comparer = new SystemDefaultComparer();
			this.Comparer = Comparer;
		}
		/// <summary>
		/// Constructor to use if you want to provide number of slots per node and your comparer object
		/// </summary>
		/// <param name="SlotLen">Number of slots per node</param>
		/// <param name="Comparer">compare object defining how records will be sorted</param>
		public BTreeAlgorithm(ValidSlotLengths SlotLen, IComparer Comparer)
		{
			Initialize(SlotLen);
			if (Comparer == null)
				Comparer = new SystemDefaultComparer();
			this.Comparer = Comparer;
		}

		internal BTreeAlgorithm(BTreeAlgorithm BTree)
		{
			Initialize(BTree);
		}

		/// <summary>
		/// Returns a shallow copy of this BTreeAlgorithm
		/// </summary>
		/// <returns>Value of type BTreeAlgorithm</returns>
		public object Clone()
		{
			return (object)new BTreeAlgorithm(this);
		}

		// Call this after the default constructor was invoked.
		private bool Initialize(ValidSlotLengths bySlotLen)
		{

#if (!DEBUG && TRIALWARE)
			const string ExpireMsg = "BTreeGold trial period has expired.\nVisit 4A site(http://www.4atech.net) to get details in getting a license.";
			if (!System.IO.File.Exists("Trialware.dll") || 
				Trialware.ExpirationManager.Instance == null ||
				Trialware.ExpirationManager.Instance.IsExpired())
				throw new InvalidOperationException(ExpireMsg);
#endif

			this.SlotLength = (byte)bySlotLen;
			Root = new TreeRootNode(this);
			SetCurrentItemAddress(Root, 0);
			TempSlots = new object[SlotLength + 1];
			TempChildren = new TreeNode[SlotLength + 2];
			return true;	// successful
		}

		// Needed for cloning (shallow copy) this BTree.
		private void Initialize(BTreeAlgorithm BTree)
		{
			this.SlotLength = BTree.SlotLength;
			this.Root = BTree.Root;

			//Copy CurrentItem. "Copy" as CurrentItem is value type.
			this.CurrentItem = BTree.CurrentItem;

			this.Comparer = BTree.Comparer;
			// create another set of temporary slots for thread safe 'Search' operation support
			TempSlots = new object[SlotLength + 1];
			TempChildren = new TreeNode[SlotLength + 2];
		}

		/// <summary>
		/// Returns current item, null if end of Btree.
		/// </summary>
		public object CurrentEntry
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

		//internal System.Collections.Generic.List<TreeNode> RecycleBuffer = new System.Collections.Generic.List<TreeNode>(20);
		//internal void RecycleNode(TreeNode n)
		//{
		//    if (RecycleBuffer.Count < 20)
		//        RecycleBuffer.Add(n);
		//}
		//internal TreeNode GetNode()
		//{
		//    TreeNode r = null;
		//    if (RecycleBuffer.Count > 0)
		//    {
		//        r = RecycleBuffer[RecycleBuffer.Count - 1];
		//        RecycleBuffer.RemoveAt(RecycleBuffer.Count - 1);
		//    }
		//    return r;
		//}

		/// <summary>
		/// Delete the current item from the tree. Tree is maintained to be balanced and sorted.
		/// </summary>
		internal protected void Remove()
		{
			object Temp = null;
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
		/// Get/Set Comparer object used in sorting items of the collection
		/// </summary>
		internal protected IComparer Comparer = null;
		/// <summary>
		/// Get: returns System.Comparer object wrapper so it can be used by BTree if no comparer
		/// was provided by user
		/// </summary>
		internal IComparer ComparerWrapper
		{
			get
			{
				if (comparerWrapper == null)
					comparerWrapper = new BTreeComparer(Comparer);
				return comparerWrapper;
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


		private ValidSlotLengths slotLength = ValidSlotLengths.DefaultSlots;	//Six Slots;
		// Slots for temporary use. When node is full, this Slots is used so that
		// auxiliary functions may be fooled as if they are still operating in a 
		// valid slots.
		// pTempSlots - temporarily holds SlotLength + 1 number of slots.
		// pTempParent - temporary parent node of the newly split nodes.
		// pTempChildren - temporary holds pointers to the left & right
		//	child nodes of pTempParent.
		private object[] TempSlots = null;
		private object TempParent = null;
		// Temp Children nodes. Only 2 since only left & right child nodes will be handled.
		private TreeNode[] TempChildren = null;
		private TreeNode[] TempParentChildren = new TreeNode[2];

		private BTreeComparer comparerWrapper = null;
	}
}

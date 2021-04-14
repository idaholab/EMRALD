/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */

using System;
using System.Collections;
using System.ComponentModel;

namespace Sop.Collections.BTree
{
	internal partial class BTreeAlgorithm : Collections.BTree.ICollection
	{

		const int MaxRecycleCount = 80;
		System.Collections.Generic.List<TreeNode> RecycledNodes =
			new System.Collections.Generic.List<TreeNode>(MaxRecycleCount);
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

		bool FixVacatedSlot;
		TreeNode PromoteParent;
		short PromoteIndexOfNode;

		/// <summary>
		/// TreeNode is where the actual B-Tree operation happens. Each object of TreeNode serves
		/// as the node of B-Tree tree
		/// </summary>
		internal class TreeNode
		{
			/// <summary>
			/// A BTreeAlgorithm's item address is composed of the node's address + the item's index in the Slots.
			/// </summary>
			internal struct ItemAddress
			{
				/// <summary>
				/// Node Reference (low-level is equivalent to Node Address)
				/// </summary>
				public TreeNode Node;
				/// <summary>
				/// Index of the item in the Node's Slots
				/// </summary>
				public byte NodeItemIndex;
			}

			/// <summary>
			/// Protected Constructor. This is used to construct the root node of the tree.
			/// (has null parent)
			/// </summary>
			/// <param name="oBTree"></param>
			protected TreeNode(BTreeAlgorithm oBTree)
			{
				this.Initialize(oBTree, null);
			}
			/// <summary>
			/// Constructor expecting ParentTree and ParentNode params.
			///	This form is invoked from another instance of this class when node 
			///	splitting occurs. Normally, node split occurs to accomodate new items that
			///	could not be loaded to the node since the node is already full. 
			///	Calls <see cref="Initialize"/> to prepare class variables/objects
			/// </summary>
			/// <param name="ParentTree">Parent B-Tree instance</param>
			/// <param name="ParentNode">Parent Node instance</param>
			internal protected TreeNode(BTreeAlgorithm ParentTree, TreeNode ParentNode)
			{
				Initialize(ParentTree, ParentNode);
			}
			/// <summary>
			/// Reset all elements of the array to Value
			/// </summary>
			/// <param name="Array">Array to reset all elements of</param>
			/// <param name="Value">Value to assign to each element of the array</param>
			static internal protected void ResetArray<T>(T[] Array, T Value)
			{
				for (ushort i = 0; i < Array.Length; i++)
					Array[i] = Value;
			}
			/// <summary>
			/// Do class variable/object initialization. Usually invoked from this class' constructor.
			/// </summary>
			/// <param name="Btree">Parent BTree</param>
			/// <param name="ParentObj">Parent Node</param>
			internal protected void Initialize(BTreeAlgorithm Btree, TreeNode ParentObj)
			{
				if (Slots == null)
					Slots = new object[Btree.SlotLength];
				Children = null;
				Parent = ParentObj;
			}

			// Utility methods...
			/// <summary>
			/// "Shallow" move elements of an array. 
			/// "MoveArrayElements" moves a group (Count) of elements of an array from
			/// source index to destination index.
			/// </summary>
			/// <param name="Array">Array whose elements will be moved</param>
			/// <param name="srcIndex">Source index of the 1st element to move</param>
			/// <param name="destIndex">Target index of the 1st element to move to</param>
			/// <param name="Count">Number of elements to move</param>
			static private void MoveArrayElements<T>(T[] Array, ushort srcIndex, ushort destIndex, ushort Count)
			{
				try
				{
					sbyte addValue = -1;
					uint srcStartIndex = (uint)srcIndex + Count - 1, destStartIndex = (uint)destIndex + Count - 1;
					if (destIndex < srcIndex)
					{
						srcStartIndex = srcIndex;
						destStartIndex = destIndex;
						addValue = 1;
					}
					for (int i = 0; i < Count; i++)
					{
						if (destStartIndex < Array.Length)	// only process if w/in array range
						{
							Array[destStartIndex] = Array[srcStartIndex];
							destStartIndex = (uint)(destStartIndex + addValue);
							srcStartIndex = (uint)(srcStartIndex + addValue);
						}
					}
				}
				catch (Exception)
				{
					// don't do anything during exception
					return;
				}
			}
			/// <summary>
			/// "CopyArrayElements" copies elements of an array (Source) to destination array (Destination).
			/// </summary>
			/// <param name="Source">Array to copy elements from</param>
			/// <param name="srcIndex">Index of the 1st element to copy</param>
			/// <param name="Destination">Array to copy elements to</param>
			/// <param name="destIndex">Index of the 1st element to copy to</param>
			/// <param name="Count">Number of elements to copy</param>
			static private void CopyArrayElements<T>(T[] Source, ushort srcIndex, T[] Destination, ushort destIndex, ushort Count)
			{
				try
				{
					for (ushort i = 0; i < Count; i++)
						Destination[destIndex + i] = Source[srcIndex + i];
				}
				catch (Exception)
				{
					// don't do anything during exception
					return;
				}
			}
			/// <summary>
			/// Skud over one slot all items to the right.
			/// The 1st element moved will then be vacated ready for an occupant.
			/// </summary>
			/// <param name="Slots">"Slots" to skud over its contents</param>
			/// <param name="Position">1st element index to skud over</param>
			/// <param name="NoOfOccupiedSlots">Number of occupied slots</param>
			static private void ShiftSlots<T>(T[] Slots, byte Position, byte NoOfOccupiedSlots)
			{
				if (Position < NoOfOccupiedSlots)
					// create a vacant slot by shifting node contents one slot
					MoveArrayElements(Slots, Position, (ushort)(Position + 1), (ushort)(NoOfOccupiedSlots - Position));
			}

			/// <summary>
			/// Recursive Add function. Actual addition of node item happens at the outermost level !
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			/// <param name="Item">Item to add to the tree</param>
			/// <throws>Exception if No Comparer or Mem Alloc err is encountered.</throws>
			internal protected void Add(BTreeAlgorithm ParentBTree, object Item)
			{
				TreeNode CurrentNode = this;
				int Index = 0;
				while (true)
				{
					Index = 0;
					byte NoOfOccupiedSlots = CurrentNode.count;
					if (NoOfOccupiedSlots > 1)
					{
						if (ParentBTree.Comparer != null)
							Index = Array.BinarySearch(CurrentNode.Slots, 0, NoOfOccupiedSlots, Item, ParentBTree.ComparerWrapper);
						else
						{
#if !DEVICE
							try
							{
								Index = Array.BinarySearch(CurrentNode.Slots, 0, NoOfOccupiedSlots, Item);
							}
							catch (Exception)
							{
#endif
								try
								{
									Index = Array.BinarySearch(CurrentNode.Slots, Item);
								}
								catch (Exception innerE)
								{
									throw new InvalidOperationException(BTree.GetStringResource("NoComparerError"), innerE);
								}
#if !DEVICE

							}
#endif
						}
						if (Index < 0)
						{
							Index = ~Index;
						}
					}
					else if (NoOfOccupiedSlots == 1)
					{
						if (ParentBTree.Comparer != null)
						{
							if (ParentBTree.ComparerWrapper.Compare(CurrentNode.Slots[0], Item) < 0)
								Index = 1;
						}
						else
						{
							ParentBTree.Comparer = new SystemDefaultComparer();
							try
							{
								if (ParentBTree.ComparerWrapper.Compare(CurrentNode.Slots[0], Item) < 0)
									Index = 1;
							}
							catch (Exception)
							{
								ParentBTree.Comparer = new BTreeDefaultComparer();
								if (ParentBTree.ComparerWrapper.Compare(CurrentNode.Slots[0], Item) < 0)
									Index = 1;
							}
						}
					}
					if (CurrentNode.Children != null)	// if not an outermost node let next lower level node do the 'Add'.
						CurrentNode = CurrentNode.Children[Index];
					else
						break;
				}
				CurrentNode.Add(ParentBTree, Item, (short)Index);
				CurrentNode = null;
			}
			void Add(BTreeAlgorithm ParentBTree, object Item, short Index)
			{
				byte NoOfOccupiedSlots = count;
				// Add. check if node is not yet full..
				if (NoOfOccupiedSlots < ParentBTree.SlotLength)
				{
					// ************** BPLUS 
					// Insert the item(Add). if we want to implement BPLUS, we must do the modification here..
					ShiftSlots(Slots, (byte)Index, (byte)NoOfOccupiedSlots);
					Slots[Index] = Item;
					count++;
					// *************BPLUS
					return;
				}
				else
				{	// node is full, use pTempSlots
					Slots.CopyTo(ParentBTree.TempSlots, 0);

					// *************BPLUS
					// Index now contains the correct array element number to insert item into.
					// if we want to implement BPLUS, we must do the modification here..
					ShiftSlots(ParentBTree.TempSlots, (byte)Index, (byte)(ParentBTree.SlotLength));
					ParentBTree.TempSlots[Index] = Item;
					// *************BPLUS

					byte SlotsHalf = (byte)(ParentBTree.SlotLength >> 1);
					if (Parent != null)
					{
						bool bIsUnBalanced = false;
						int iIsThereVacantSlot = 0;
						if (IsThereVacantSlotInLeft(ParentBTree, ref bIsUnBalanced))
							iIsThereVacantSlot = 1;
						else if (IsThereVacantSlotInRight(ParentBTree, ref bIsUnBalanced))
							iIsThereVacantSlot = 2;
						if (iIsThereVacantSlot > 0)
						{
							// copy temp buffer contents to the actual slots.
							byte b = (byte)(iIsThereVacantSlot == 1 ? 0 : 1);
							CopyArrayElements(ParentBTree.TempSlots, b, Slots, 0, ParentBTree.SlotLength);
							if (iIsThereVacantSlot == 1)
								// Vacant in left, "skud over" the leftmost node's item to parent and left.
								DistributeToLeft(ParentBTree.SlotLength, ParentBTree.TempSlots[ParentBTree.SlotLength]);
							else if (iIsThereVacantSlot == 2)
								// Vacant in right, move the rightmost node item into the vacant slot in right.
								DistributeToRight(ParentBTree.SlotLength, ParentBTree.TempSlots[0]);
							return;
						}
						else if (bIsUnBalanced)
						{	// if this branch is unbalanced..
							// _BreakNode
							// Description :
							// -copy the left half of the slots
							// -copy the right half of the slots
							// -zero out the current slot.
							// -copy the middle slot
							// -allocate memory for children node *s
							// -assign the new children nodes.
							TreeNode LeftNode;
							TreeNode RightNode;
							try
							{
								// Initialize should throw an exception if in error.
								RightNode = ParentBTree.GetRecycleNode(this);
								LeftNode = ParentBTree.GetRecycleNode(this);
								CopyArrayElements(ParentBTree.TempSlots, 0, LeftNode.Slots, 0, SlotsHalf);
								LeftNode.count = SlotsHalf;
								CopyArrayElements(ParentBTree.TempSlots, (ushort)(SlotsHalf + 1), RightNode.Slots, 0, SlotsHalf);
								RightNode.count = SlotsHalf;
								ResetArray(Slots, null);
								count = 1;
								Slots[0] = ParentBTree.TempSlots[SlotsHalf];
								Children = new TreeNode[ParentBTree.SlotLength + 1];

								ResetArray(Children, null);
								Children[(int)ChildNodes.LeftChild] = LeftNode;
								Children[(int)ChildNodes.RightChild] = RightNode;
								//SUCCESSFUL!
								return;
							}
							catch (Exception e)
							{
								//
								Children = null;
								LeftNode = null;
								RightNode = null;
								throw new InvalidOperationException(BTree.GetStringResource("MemAllocError"), e);	// throw an error.
							}
						}
						else
						{
							// All slots are occupied in this and other siblings' nodes..
							TreeNode RightNode;
							try
							{
								// prepare this and the right node sibling and promote the temporary parent node(pTempSlot).
								RightNode = ParentBTree.GetRecycleNode(Parent);
								// zero out the current slot.
								ResetArray(Slots, null);
								// copy the left half of the slots to left sibling
								CopyArrayElements(ParentBTree.TempSlots, 0, Slots, 0, SlotsHalf);
								count = SlotsHalf;
								// copy the right half of the slots to right sibling
								CopyArrayElements(ParentBTree.TempSlots, (ushort)(SlotsHalf + 1), RightNode.Slots, 0, SlotsHalf);
								RightNode.count = SlotsHalf;

								// copy the middle slot to temp parent slot.
								ParentBTree.TempParent = ParentBTree.TempSlots[SlotsHalf];

								// assign the new children nodes.
								ParentBTree.TempParentChildren[(int)ChildNodes.LeftChild] = this;
								ParentBTree.TempParentChildren[(int)ChildNodes.RightChild] = RightNode;

								ParentBTree.PromoteParent = (TreeNode)Parent;
								ParentBTree.PromoteIndexOfNode = GetIndexOfNode(ParentBTree.SlotLength);
								//o.Promote(ParentBTree, GetIndexOfNode(ParentBTree.SlotLength));
								//SUCCESSFUL!
								return;
							}
							catch (Exception e)
							{
								RightNode = null;
								throw new InvalidOperationException(BTree.GetStringResource("MemAllocError"), e);	// throw an error.
							}
						}
					}
					else
					{
						// _BreakNode
						// Description :
						// -copy the left half of the temp slots
						// -copy the right half of the temp slots
						// -zero out the current slot.
						// -copy the middle of temp slot to 1st elem of current slot
						// -allocate memory for children node *s
						// -assign the new children nodes.
						TreeNode LeftNode;
						TreeNode RightNode;
						try
						{
							RightNode = ParentBTree.GetRecycleNode(this);
							LeftNode = ParentBTree.GetRecycleNode(this);
							CopyArrayElements(ParentBTree.TempSlots, 0, LeftNode.Slots, 0, SlotsHalf);
							LeftNode.count = SlotsHalf;
							CopyArrayElements(ParentBTree.TempSlots, (ushort)(SlotsHalf + 1), RightNode.Slots, 0, SlotsHalf);
							RightNode.count = SlotsHalf;
							ResetArray(Slots, null);
							Slots[0] = ParentBTree.TempSlots[SlotsHalf];
							count = 1;
							Children = new TreeNode[ParentBTree.SlotLength + 1];
							Children[(int)ChildNodes.LeftChild] = LeftNode;
							Children[(int)ChildNodes.RightChild] = RightNode;
							return;	// successful
						}
						catch (Exception e)
						{
							// falling through here and further down means mem alloc error so delete the allocated ones.
							LeftNode = null;
							RightNode = null;
							throw new InvalidOperationException(BTree.GetStringResource("MemAllocError"), e);	// throw an error.
						}
					}
				}
			}

			//****** private modified binary search that facilitates Search of a key and if duplicates were found, positions the current record pointer to the 1st key instance.
			private static int BinarySearch(System.Array Array, int Index, int Length, object Value, System.Collections.IComparer Comparer)
			{
				int r;
				if (Comparer != null && Index != -1 && Length != -1)
					r = Array.BinarySearch(Array, Index, Length, Value, Comparer);
#if !DEVICE
				else if (Index != -1 && Length != -1)
					r = Array.BinarySearch(Array, Index, Length, Value);
#endif
				else
					r = Array.BinarySearch(Array, Value);
				if (r >= 0)
				{
					if (r >= 1)
					{
						int rr = BinarySearch(Array, 0, r, Value, Comparer);
						if (rr >= 0)
							return rr;
					}
				}
				return r;
			}
			//****** end of modified binary search functions

			/// <summary>
			/// Search BTreeAlgorithm for the item pointed to by Item. 
			/// NOTE: this should be invoked from root node.
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			/// <param name="Item">Item to search in tree</param>
			/// <param name="GoToFirstInstance">true tells BTree to go to First Instance of Key, else any key instance matching will match</param>
			/// <returns>true if item found, else false</returns>
			internal protected bool Search(BTreeAlgorithm ParentBTree, object Item, bool GoToFirstInstance)
			{
				byte i = 0;
				TreeNode CurrentNode = this;
				TreeNode FoundNode = null;
				byte FoundIndex = 0;
				while (true)
				{
					i = 0;
					byte NoOfOccupiedSlots = CurrentNode.count;
					if (NoOfOccupiedSlots > 0)
					{
						int Result;
						if (ParentBTree.Comparer != null)
						{
							if (!GoToFirstInstance)
								Result = Array.BinarySearch(CurrentNode.Slots, 0, NoOfOccupiedSlots, Item, ParentBTree.ComparerWrapper);
							else
								Result = BinarySearch(CurrentNode.Slots, 0, NoOfOccupiedSlots, Item, ParentBTree.ComparerWrapper);
						}
						else
						{
#if !DEVICE
							try
							{
								if (!GoToFirstInstance)
									Result = Array.BinarySearch(CurrentNode.Slots, 0, NoOfOccupiedSlots, Item);
								else
									Result = BinarySearch(CurrentNode.Slots, 0, NoOfOccupiedSlots, Item, null);
							}
							catch
							{
#endif
								try
								{
									if (!GoToFirstInstance)
										Result = Array.BinarySearch(CurrentNode.Slots, Item);
									else
										Result = BinarySearch(CurrentNode.Slots, -1, -1, Item, null);
								}
								catch (Exception innerE)
								{
									throw new InvalidOperationException(BTree.GetStringResource("NoComparerError"), innerE);
								}
#if !DEVICE
							}
#endif
						}
						if (Result >= 0)	// if found...
						{
							i = (byte)Result;

							FoundNode = CurrentNode;
							FoundIndex = i;
							if (!GoToFirstInstance)
								break;
						}
						else
							i = (byte)(~Result);
					}
					if (CurrentNode.Children != null)
						CurrentNode = CurrentNode.Children[i];
					else
						break;
				}
				// not found, check if inner node(has Children nodes!).
				if (FoundNode != null)
				{
					ParentBTree.SetCurrentItemAddress(FoundNode, FoundIndex);
					return true;
				}
				else if (CurrentNode != null)
				{	// this must be the outermost node
					// This block will make this item the current one to give chance to the Btree 
					// caller the chance to check the items having the nearest key to the one it is interested at.
					if (i == ParentBTree.SlotLength) i--;	// make sure i points to valid item
					if (CurrentNode.Slots[i] != null)
						ParentBTree.SetCurrentItemAddress(CurrentNode, i);
					else
					{
						i--;
						// Update Current Item of this Node and nearest to the Key in sought Slot index
						ParentBTree.SetCurrentItemAddress(CurrentNode, i);
						// Make the next item the current item. This has the effect of positioning making the next greater item the current item.
						CurrentNode.MoveNext(ParentBTree);
						/*
						ItemAddress c = ParentBTree.CurrentItem;
						c.Node = this;
						c.NodeItemIndex = i;
						*/
					}
				}
				return false;
			}
			/// <summary>
			/// Remove the current item from the tree
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			/// <returns>Always returns true</returns>
			internal protected bool Remove(BTreeAlgorithm ParentBTree)
			{	// check if there are children nodes.
				if (Children != null)
				{
					byte byIndex = ParentBTree.CurrentItem.NodeItemIndex;
					// The below code allows the btree mngr to do virtually, all deletion to happen in the outermost nodes' slots.
					MoveNext(ParentBTree);	// sure to succeed since Children nodes are always in pairs(left & right). Make the new current item the occupant of the slot occupied by the deleted item.
					Slots[byIndex] = ParentBTree.CurrentItem.Node.Slots[ParentBTree.CurrentItem.NodeItemIndex];
					// Thus, the above code has the effect that the current item's slot is the deleted slot, so, the succeeding code that will remove the current slot will be fine..
				}
				// Always true since we expect the caller code to check if there is current item to delete and therefore, every Delete call will succeed.
				return true;
			}
			internal protected void Clear()
			{
				Clear(false);
			}
			/// <summary>
			/// Clear the whole tree.
			/// NOTE: This implementation is local stack taxing as I heavily rely on
			/// recursion. I may need to re-implement using a non-recursion technique
			/// if found inferior.
			/// Advantage is, this is the fastest Clear implementation.
			/// </summary>
			internal protected void Clear(bool Recycle)
			{
				Parent = null;
				byte i;
				for (i = 0; i < count; i++)
					Slots[i] = null;
				if (!Recycle)
					Slots = null;
				if (this.Children != null)
				{
					for (i = 0; i <= count; i++)
					{
						if (!Recycle)
							Children[i].Clear();
						Children[i] = null;
					}
					Children = null;
				}
				count = 0;
			}
			/// <summary>
			/// Make the first item the current item. This member should be called from Root.
			/// </summary>
			/// <param name="ParentBTree">BTree instance this Node is a part of</param>
			internal protected bool MoveFirst(BTreeAlgorithm ParentBTree)
			{
				TreeNode Node = this;
				if (count > 0 && Slots[0] != null)
				{
					while (Node.Children != null)
						Node = Node.Children[0];
					ParentBTree.SetCurrentItemAddress(Node, 0);
					return true;	// At this level, always return SUCCESS
				}
				return false;	// Collection is empty.
			}

			// If BPlus is gonna be implemented, just override this and use the CBPlusNode's Next and previous pointers.
			/// <summary>
			/// Make the next item in the tree the current item.
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			/// <returns>true if successful, else false</returns>
			internal protected bool MoveNext(BTreeAlgorithm ParentBTree)
			{
				TreeNode CurrentNode = this;
				byte SlotIndex = (byte)(ParentBTree.CurrentItem.NodeItemIndex + 1);
				bool GoRightDown = Children != null;
				if (GoRightDown)
				{
					while (true)
					{
						if (CurrentNode.Children != null)
						{
							CurrentNode = CurrentNode.Children[SlotIndex];
							SlotIndex = 0;
						}
						else
						{
							ParentBTree.SetCurrentItemAddress(CurrentNode, 0);
							return true;
						}
					}
				}
				else
				{
					while (true)
					{
						// check if SlotIndex is within the maximum slot items and if it is, will index an occupied slot.
						if (SlotIndex < ParentBTree.SlotLength && CurrentNode.Slots[SlotIndex] != null)
						{
							ParentBTree.SetCurrentItemAddress(CurrentNode, SlotIndex);
							return true;
						}
						else
						{
							if (CurrentNode.Parent != null)	// check if this is not the root node. (Root nodes don't have parent node.)
							{
								SlotIndex = CurrentNode.GetIndexOfNode(ParentBTree.SlotLength);
								CurrentNode = CurrentNode.Parent;
							}
							else
							{
								// this is root node. set to null the current item(End of Btree is reached)
								ParentBTree.SetCurrentItemAddress(null, 0);
								return false;
							}
						}
					}
				}
			}

			/// <summary>
			/// Make previous item in the tree current item.
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			/// <returns>true if successful, else false</returns>
			internal protected bool MovePrevious(BTreeAlgorithm ParentBTree)
			{
				byte SlotIndex = ParentBTree.CurrentItem.NodeItemIndex;
				bool GoLeftDown = Children != null;
				TreeNode CurrentNode = this;
				if (GoLeftDown)
				{
					while (true)
					{
						if (CurrentNode.Children != null)
						{
							byte ii = CurrentNode.Children[SlotIndex].count;
							CurrentNode = CurrentNode.Children[SlotIndex];
							SlotIndex = ii;
						}
						else
						{
							// 'SlotIndex -1' since we are now using SlotIndex as index to pSlots.
							ParentBTree.SetCurrentItemAddress(CurrentNode, (byte)(SlotIndex - 1));
							return true;
						}
					}
				}
				else
				{
					short si = (short)(SlotIndex - 1);
					while (true)
					{
						// check if SlotIndex is within the maximum slot items and if it is, will index an occupied slot.
						if (si >= 0)
						{
							ParentBTree.SetCurrentItemAddress(CurrentNode, (byte)si);
							return true;
						}
						else
						{
							if (CurrentNode.Parent != null)	// check if this is not the root node. (Root nodes don't have parent node.)
							{
								byte i = CurrentNode.GetIndexOfNode(ParentBTree.SlotLength);
								CurrentNode = CurrentNode.Parent;
								si = (short)(i - 1);
							}
							else
							{
								// this is root node. set to null the current item(End of Btree is reached)
								ParentBTree.SetCurrentItemAddress(null, 0);
								return false;
							}
						}
					}
				}
			}

			// CBPlusNode has pointer to last, use it when implementing BPlus.. This should be called from the root node.
			/// <summary>
			/// Make the last item in the tree the current item.
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			/// <returns>true if successful, else false</returns>
			internal protected bool MoveLast(BTreeAlgorithm ParentBTree)
			{
				TreeNode Node = this;
				while (Node.Children != null)
					Node = Node.Children[Node.count];
				ParentBTree.SetCurrentItemAddress(Node, (byte)(Node.count - 1));
				if (ParentBTree.CurrentItem.Node != null)
					return true;
				// return BOC error to tell the caller code that this tree is empty.
				return false;	// empty tree.
			}

			// Assigns a new parent for this node.
			/// <summary>
			/// Make "NewParent" the parent of this Node.
			/// </summary>
			/// <param name="NewParent">New Parent TreeNode</param>
			private void SetParent(TreeNode NewParent) { Parent = NewParent; }

			/// <summary>
			/// Returns true if slots are all occupied, else false
			/// </summary>
			/// <param name="SlotLength">Number of slots per node</param>
			/// <returns>true if full, else false</returns>
			private bool IsFull(byte SlotLength)
			{
				return count == SlotLength;
			}

			/// <summary>
			/// Returns index of this node relative to parent. 
			/// Note: you must call this after you check that there is a parent node.
			/// </summary>
			/// <param name="SlotLength">Number of slots per node</param>
			/// <returns>Index of this node per its parent</returns>
			private byte GetIndexOfNode(byte SlotLength)
			{
				if (Parent != null)
				{
					if (IndexOfNode == -1 || Parent.Children[IndexOfNode] != this)
					{
						// Make sure we don't access an invalid memory address
						for (IndexOfNode = 0; IndexOfNode <= SlotLength &&
							Parent.Children[IndexOfNode] != null; IndexOfNode++)
						{
							if (Parent.Children[IndexOfNode] == this)
								return (byte)IndexOfNode;
						}
						return 0;
					}
					return (byte)IndexOfNode;
				}
				// Just return 0 if called in the root node, anyway, the caller code should check if it is the root node and not call this function if it is!
				return 0;
			}
			short IndexOfNode = -1;

			/// <summary>
			/// Returns left sibling or null if finished traversing left nodes.
			/// </summary>
			/// <param name="SlotLength">Number of slots per node</param>
			/// <returns>Left sibling TreeNode reference</returns>
			private TreeNode GetLeftSibling(byte SlotLength)
			{
				int Index = GetIndexOfNode(SlotLength);
				// if we are not at the leftmost sibling yet..
				if (Index > 0) return Parent.Children[Index - 1];
				// leftmost was already reached..
				return (TreeNode)null;
			}

			/// <summary>
			/// Returns right sibling or null if finished traversing right nodes.
			/// </summary>
			/// <param name="SlotLength">Number of slots per node</param>
			/// <returns>Right sibling TreeNode reference</returns>
			private TreeNode GetRightSibling(byte SlotLength)
			{
				int Index = GetIndexOfNode(SlotLength);
				// if we are not at the Rightmost sibling yet..
				if (Index < SlotLength) return Parent.Children[Index + 1];
				// leftmost was already reached..
				return (TreeNode)null;
			}

			/// <summary>
			/// Returns true if a slot is available in left side siblings of this node modified to suit possible unbalanced branch.
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			/// <param name="IsUnBalanced">Will be updated to true if this branch is detected to be "unbalanced", else false</param>
			/// <returns>true if there is a vacant slot, else false</returns>
			private bool IsThereVacantSlotInLeft(BTreeAlgorithm ParentBTree, ref bool IsUnBalanced)
			{
				IsUnBalanced = false;
				// start from this node.
				TreeNode Temp = this;
				while ((Temp = Temp.GetLeftSibling(ParentBTree.SlotLength)) != null)
				{
					if (Temp.Children != null)
					{
						IsUnBalanced = true;
						return false;
					}
					else if (!Temp.IsFull(ParentBTree.SlotLength))
						return true;
				}
				return false;
			}
			/// <summary>
			/// Returns true if a slot is available in right side siblings of this node modified to suit possible unbalanced branch.
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			/// <param name="IsUnBalanced">Will be updated to true if this branch is detected to be "unbalanced", else false</param>
			/// <returns>true if there is a vacant slot, else false</returns>
			private bool IsThereVacantSlotInRight(BTreeAlgorithm ParentBTree, ref bool IsUnBalanced)
			{
				IsUnBalanced = false;
				// start from this node.
				TreeNode Temp = this;
				while ((Temp = Temp.GetRightSibling(ParentBTree.SlotLength)) != null)
				{
					if (Temp.Children != null)
					{
						IsUnBalanced = true;
						return false;
					}
					else if (!Temp.IsFull((byte)ParentBTree.SlotLength)) return true;
				}
				return false;
			}



			/// <summary>
			/// This gets called when the node's slots are overflowed and break up
			///	is needed. This does the necessary recursive promotion of the 
			///	newly born nodes as affected by the break up.<br/>
			///	Uses caller Btree object's Temporary Slots and Children nodes
			///	which are accessible via GetTempSlot() and _GetTempParentChildren()
			///	as storage of Parent and newly born siblings.<br/><br/>
			///	NOTE: Uses Temporary Slots and Children nodes which are accessible via GetTempSlot() and _GetTempParentChildren() as storage of Parent and newly born siblings.
			/// </summary>
			/// <param name="ParentBTree">parent BTree</param>
			/// <param name="Position">Position of the broken apart node in its parent node's slots</param>
			internal void Promote(BTreeAlgorithm ParentBTree, byte Position)
			{
				byte NoOfOccupiedSlots = this.count,
					Index = Position;
				if (NoOfOccupiedSlots < (byte)ParentBTree.SlotLength)
				{
					// node is not yet full.. insert the parent.
					ShiftSlots(Slots, Index, NoOfOccupiedSlots);

					if (Index > NoOfOccupiedSlots)
						Index = NoOfOccupiedSlots;

					Slots[Index] = ParentBTree.TempParent;
					// insert the left child
					Children[Index] = ParentBTree.TempParentChildren[(int)ChildNodes.LeftChild];
					// insert the right child
					ShiftSlots(Children, (byte)(Index + 1), (byte)(NoOfOccupiedSlots + 1));
					Children[Index + 1] = ParentBTree.TempParentChildren[(int)ChildNodes.RightChild];
					count++;
					return;	// successful
				}
				else
				{	// *** Insert to temp slots.. node is full, use pTempSlots
					CopyArrayElements(Slots, 0, ParentBTree.TempSlots, 0, (ushort)ParentBTree.SlotLength);
					ShiftSlots(ParentBTree.TempSlots, Index, (byte)ParentBTree.SlotLength);
					ParentBTree.TempSlots[Index] = ParentBTree.TempParent;
					CopyArrayElements(Children, 0, ParentBTree.TempChildren, 0, (ushort)(ParentBTree.SlotLength + 1));
					// insert the left child
					ParentBTree.TempChildren[Index] = ParentBTree.TempParentChildren[(int)ChildNodes.LeftChild];
					// insert the right child
					ShiftSlots(ParentBTree.TempChildren, (byte)(Index + 1), (byte)(NoOfOccupiedSlots + 1));
					ParentBTree.TempChildren[Index + 1] = ParentBTree.TempParentChildren[(int)ChildNodes.RightChild];
					// *** Try to break up the node into 2 siblings.
					TreeNode LeftNode = null;
					TreeNode RightNode = null;
					byte SlotsHalf = (byte)((byte)ParentBTree.SlotLength >> (byte)1);
					if (Parent != null)
					{	// prepare this and the right node sibling and promote the temporary parent node(pTempSlot). this is the left sibling !
						try
						{
							RightNode = ParentBTree.GetRecycleNode(Parent);
							RightNode.Children = new TreeNode[ParentBTree.SlotLength + 1];
							// zero out the current slot.
							ResetArray(Slots, null);
							// zero out this children node pointers.
							ResetArray(Children, null);
							// copy the left half of the slots to left sibling(this)
							CopyArrayElements(ParentBTree.TempSlots, 0, Slots, 0, SlotsHalf);
							// copy the right half of the slots to right sibling
							CopyArrayElements(ParentBTree.TempSlots, (ushort)(SlotsHalf + 1), RightNode.Slots, (ushort)0, (ushort)SlotsHalf);
							count = SlotsHalf;
							RightNode.count = SlotsHalf;
							// copy the left half of the children nodes.
							CopyArrayElements(ParentBTree.TempChildren, 0, Children, 0, (ushort)(SlotsHalf + 1));
							// copy the right half of the children nodes.
							CopyArrayElements(ParentBTree.TempChildren, (ushort)(SlotsHalf + 1), RightNode.Children, 0, (ushort)(SlotsHalf + 1));
							if (RightNode.Children != null)
								// left sibling is already parent of its children. make the right sibling parent of its children.
								for (Index = 0; Index <= SlotsHalf; Index++)
									RightNode.Children[Index].SetParent(RightNode);
							// copy the middle slot
							ParentBTree.TempParent = ParentBTree.TempSlots[SlotsHalf];
							// assign the new children nodes.
							ParentBTree.TempParentChildren[(int)ChildNodes.LeftChild] = this;
							ParentBTree.TempParentChildren[(int)ChildNodes.RightChild] = RightNode;

							ParentBTree.PromoteParent = Parent;
							ParentBTree.PromoteIndexOfNode = GetIndexOfNode(ParentBTree.SlotLength);
							//Parent.Promote(ParentBTree, GetIndexOfNode(ParentBTree.SlotLength));
							return;
						}
						catch (Exception e)
						{
							RightNode.Children = null;
							RightNode = null;
							throw new InvalidOperationException("Error in attempt to promote parent of a borken node.", e);
						}
					}
					else
					{	// no parent
						try
						{
							LeftNode = ParentBTree.GetRecycleNode(this);
							RightNode = ParentBTree.GetRecycleNode(this);
							// copy the left half of the slots
							CopyArrayElements(ParentBTree.TempSlots, 0, LeftNode.Slots, 0, SlotsHalf);
							LeftNode.count = SlotsHalf;
							// copy the right half of the slots
							CopyArrayElements(ParentBTree.TempSlots, (ushort)(SlotsHalf + 1), RightNode.Slots, 0, SlotsHalf);
							RightNode.count = SlotsHalf;
							LeftNode.Children = new TreeNode[ParentBTree.SlotLength + 1];
							RightNode.Children = new TreeNode[ParentBTree.SlotLength + 1];
							// copy the left half of the children nodes.
							CopyArrayElements(ParentBTree.TempChildren, 0, LeftNode.Children, 0, (ushort)(SlotsHalf + 1));
							// copy the right half of the children nodes.
							CopyArrayElements(ParentBTree.TempChildren, (ushort)(SlotsHalf + 1), RightNode.Children, 0, (ushort)(SlotsHalf + 1));
							// make the left sibling parent of its children.
							for (Index = 0; Index <= SlotsHalf; Index++)
								LeftNode.Children[Index].SetParent(LeftNode);
							// make the right sibling parent of its children.
							for (Index = 0; Index <= SlotsHalf; Index++)
								RightNode.Children[Index].SetParent(RightNode);
							// zero out the current slot.
							ResetArray(Slots, null);
							ResetArray(Children, null);
							// copy the middle slot
							Slots[0] = ParentBTree.TempSlots[SlotsHalf];
							count = 1;
							// assign the new children nodes.
							Children[(int)ChildNodes.LeftChild] = LeftNode;
							Children[(int)ChildNodes.RightChild] = RightNode;
							return;	// successful
						}
						catch (Exception e)
						{	// Delete resources prior to returning mem. alloc error
							LeftNode.Children = null;
							RightNode = null;
							LeftNode = null;
							throw new InvalidOperationException(BTree.GetStringResource("MemAllocError"), e);	// throw an error.
						}
					}
				}
			}

			/// <summary>
			/// Distribute to left siblings the item if the current slots are  all filled up.
			/// Used when balancing the nodes' load of the current sub-tree.
			/// </summary>
			/// <param name="SlotLength">Number of slots per node</param>
			/// <param name="Item">Item to distribute to left sibling node</param>
			private void DistributeToLeft(byte SlotLength, object Item)
			{
				if (IsFull(SlotLength))
				{	// counter-clockwise rotation..					
					//	----
					//	|  |
					//	-> |
					// NOTE: we don't check for null returns as this method is called only when there is vacant in left
					GetLeftSibling(SlotLength).DistributeToLeft(SlotLength, Parent.Slots[GetIndexOfNode(SlotLength) - 1]);
					Parent.Slots[GetIndexOfNode(SlotLength) - 1] = Slots[0];
					MoveArrayElements(Slots, 1, 0, (ushort)(SlotLength - 1));
					Slots[count - 1] = null;
				}
				else
					count++;
				Slots[count - 1] = Item;
			}

			/// <summary>
			/// Distribute to right siblings the item if the current slots are all filled up.
			/// Used when balancing the nodes' load of the current sub-tree.
			/// </summary>
			/// <param name="SlotLength">Number of slots per node</param>
			/// <param name="Item">Item to distribute to right sibling</param>
			private void DistributeToRight(byte SlotLength, object Item)
			{
				if (IsFull(SlotLength))
				{	// clockwise rotation..
					//	----
					//	|  |
					//	| <-
					GetRightSibling(SlotLength).DistributeToRight(SlotLength, Parent.Slots[GetIndexOfNode(SlotLength)]);
					Parent.Slots[GetIndexOfNode(SlotLength)] = Slots[count - 1];
				}
				else
					count++;
				ShiftSlots(Slots, 0, (byte)(SlotLength - 1));
				Slots[0] = Item;
			}

			/// <summary>
			/// Overwrite the current item with the item from the next or previous slot.
			/// Attempts to free the TreeNode object by setting Parent, Children and Slots to null.
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			internal void FixTheVacatedSlot(BTreeAlgorithm ParentBTree)
			{
				sbyte c;
				c = (sbyte)count;
				if (c > 1)	// if there are more than 1 items in slot then..
				{	//***** We don't fix the children since there are no children at this scenario.
					if (ParentBTree.CurrentItem.NodeItemIndex < c - 1)
						MoveArrayElements(Slots,
							(ushort)(ParentBTree.CurrentItem.NodeItemIndex + 1),
							ParentBTree.CurrentItem.NodeItemIndex,
							(ushort)(c - 1 - ParentBTree.CurrentItem.NodeItemIndex));
					count--;
					Slots[count] = null;	// nullify the last slot.
				}
				else
				{	// only 1 item in slot
					if (Parent != null)
					{
						byte ucIndex;
						// if there is a pullable item from sibling nodes.
						if (SearchForPullableItem(ParentBTree.SlotLength, out ucIndex))
						{
							if (ucIndex < GetIndexOfNode(ParentBTree.SlotLength))
								PullFromLeft(ParentBTree);	// pull an item from left
							else
								PullFromRight(ParentBTree);	// pull an item from right
						}
						else
						{	// Parent has only 2 children nodes..
							if (Parent.Children[0] == this)
							{	// this is left node
								TreeNode RightSibling = GetRightSibling(ParentBTree.SlotLength);
								Parent.Slots[1] = RightSibling.Slots[0];
								Parent.count = 2;
								ParentBTree.AddRecycleNode(RightSibling);
								RightSibling = null;
							}
							else
							{	// this is right node
								Parent.Slots[1] = Parent.Slots[0];
								TreeNode LeftSibling = GetLeftSibling(ParentBTree.SlotLength);
								Parent.Slots[0] = LeftSibling.Slots[0];
								Parent.count = 2;
								ParentBTree.AddRecycleNode(LeftSibling);
								LeftSibling = null;
							}
							// nullify Parent's children will cause this tree node instance to be garbage collected as this is child of parent!
							Parent.Children[0] = null;
							Parent.Children[1] = null;
							Parent.Children = null;
							Clear();
							//ParentBTree.AddRecycleNode(this);
						}
					}
					else
					{	// only 1 item in root node !
						Slots[0] = null;	// just nullIFY the slot.
						count = 0;
						ParentBTree.SetCurrentItemAddress(null, 0);	// Point the current item pointer to end of tree
					}
				}
			}

			/// <summary>
			/// Recursively pull item from left side. Modified to process unbalanced branch - 10/31/97.
			/// Pull an item from the left siblings. Used when this node run out of loaded items and instead of destroying itself, will pull an item from the left siblings to maintain the balanceness of this sub-tree.
			/// </summary>
			/// <param name="ParentBTree">Parent BTree</param>
			private void PullFromLeft(BTreeAlgorithm ParentBTree)
			{
				byte i = count;
				if (i > 1)	// more than 1 item.
				{
					count--;
					// we only need to nullify the last item since the caller code should have moved it to the slot, which item just got deleted or pulled.
					Slots[i - 1] = null;
				}
				// *********** Start of Unbalanced right sibling branch processing check if there is a right sibling and if it has children node.
				else
				{
					TreeNode LeftSibling = GetLeftSibling(ParentBTree.SlotLength);
					i = GetIndexOfNode(ParentBTree.SlotLength);
					if (LeftSibling != null && LeftSibling.Children != null)
					{	// the following code should process unbalanced sibling branch.
						//object MoveThisToLeft = Parent.Slots[i - 1];
						//int CopyItems = Parent.count - i;
						//if (CopyItems == 0)
						//    CopyItems++;
						//MoveArrayElements(Parent.Slots, (ushort)i, (ushort)(i - 1), (ushort)(CopyItems - 1));
						//Parent.Slots[Parent.count - 1] = null;
						//if (Parent.Children.Length > i + 1)
						//    MoveArrayElements(Parent.Children, (ushort)(i + 1), (ushort)i, (ushort)CopyItems);
						//Parent.Children[Parent.count] = null;
						//Parent.count--;
						//LeftSibling.Add(ParentBTree, MoveThisToLeft);
						//if (Parent.count == 0)
						//{
						//    Array.Copy(LeftSibling.Slots, Parent.Slots, LeftSibling.count);
						//    if (LeftSibling.Children != null)
						//    {
						//        Array.Copy(LeftSibling.Children, Parent.Children, LeftSibling.count + 1);
						//        for (int Index = 0; Index <= LeftSibling.count; Index++)
						//            Parent.Children[Index].SetParent(Parent);
						//    }
						//    else
						//    {
						//        Parent.Children[0] = null;
						//        Parent.Children[1] = null;
						//        Parent.Children = null;
						//    }
						//    Parent.count = LeftSibling.count;
						//    ParentBTree.AddRecycleNode(LeftSibling);
						//}
						//MoveThisToLeft = null;
						//ParentBTree.AddRecycleNode(this);

						i = (byte)(GetIndexOfNode(ParentBTree.SlotLength) - 1);
						Slots[0] = Parent.Slots[i];
						ParentBTree.SetCurrentItemAddress(Parent, i);
						ParentBTree.CurrentItem.Node.MovePrevious(ParentBTree);
						Parent.Slots[i] = ParentBTree.CurrentItem.Node.Slots[ParentBTree.CurrentItem.NodeItemIndex];
						ParentBTree.FixVacatedSlot = true;
						//ParentBTree.CurrentItem.Node.FixTheVacatedSlot(ParentBTree);
					}	// *********** End of Unbalanced right sibling branch processing
					else
					{
						// There is only 1 item in the slot and there is no unbalanced left sibling.
						if (i == 1 && LeftSibling.count == 1)
						{	// we need to combine the leftmost sibling's item with the
							// parent's 1st item and make them the leftmost node's items.
							// This scenario caters for this:
							//		[ 5 | 7 ]
							//     /    |    \
							//   [3]  [*7*] [10]
							// NOTE: slot containing 7 is this node's slot and which was already moved 
							// to the parent. See the slot in the parent containing 7.

							// After this block of code will be:
							//		[ 7 ]
							//     /     \
							//  [3|5]    [10]
							// NOTE: 5 was joined with 3 on the same slots container, 
							// parent's 7 moved to the slot previously occupied by 5, [*7] got deleted
							// and 10 became the parent's 1st item's right child.

							LeftSibling.Slots[1] = Parent.Slots[0];
							LeftSibling.count = 2;
							i = Parent.count;
							MoveArrayElements(Parent.Slots, 1, 0, (ushort)(i - 1));
							Parent.Slots[i - 1] = null;
							MoveArrayElements(Parent.Children, 2, 1, (ushort)(i - 1));
							Parent.Children[i] = null;
							Parent.count--;
							ParentBTree.AddRecycleNode(this);
						}
						else
						{
							Slots[0] = Parent.Slots[i - 1];
							Parent.Slots[i - 1] = LeftSibling.Slots[LeftSibling.count - 1];
							LeftSibling.PullFromLeft(ParentBTree);
						}
					}
					LeftSibling = null;
				}
			}
			
			/// <summary>
			/// Recursively pull item from right side. Modified to process unbalanced branch - 10/31/97
			/// Same as above except that the pull is from the right siblings.
			/// </summary>
			/// <param name="ParentBTree">Paren BTree</param>
			private void PullFromRight(BTreeAlgorithm ParentBTree)
			{
				byte i = count;
				if (i > 1)
				{
					count--;
					MoveArrayElements(Slots, 1, 0, count);
					Slots[i - 1] = null;
				}
				// *********** Start of Unbalanced right sibling branch processing check if there is a right sibling and if it has children node.
				else
				{
					TreeNode RightSibling = GetRightSibling(ParentBTree.SlotLength);
					i = GetIndexOfNode(ParentBTree.SlotLength);
					if (RightSibling != null && RightSibling.Children != null)
					{	// the following code should process unbalanced sibling branch.

						//object MoveThisToLeft = Parent.Slots[i];
						//MoveArrayElements(Parent.Slots, (ushort)(i + 1), (ushort)i, (ushort)(Parent.count - i - 1));
						//Parent.Slots[Parent.count - 1] = null;
						//MoveArrayElements(Parent.Children, (ushort)(i + 1), (ushort)i, (ushort)(Parent.count - i));
						//Parent.Children[Parent.count] = null;
						//Parent.count--;
						//RightSibling.Add(ParentBTree, MoveThisToLeft);
						//if (Parent.count == 0)
						//{
						//    Array.Copy(RightSibling.Slots, Parent.Slots, RightSibling.count);
						//    if (RightSibling.Children != null)
						//    {
						//        Array.Copy(RightSibling.Children, Parent.Children, RightSibling.count + 1);
						//        for (int Index = 0; Index <= RightSibling.count; Index++)
						//            Parent.Children[Index].SetParent(Parent);
						//    }
						//    else
						//    {
						//        Parent.Children[0] = null;
						//        Parent.Children[1] = null;
						//        Parent.Children = null;
						//    }
						//    Parent.count = RightSibling.count;
						//    ParentBTree.AddRecycleNode(RightSibling);
						//}
						//MoveThisToLeft = null;
						//ParentBTree.AddRecycleNode(this);

						i = GetIndexOfNode(ParentBTree.SlotLength);
						Slots[0] = Parent.Slots[i];
						ParentBTree.SetCurrentItemAddress(Parent, i);
						ParentBTree.CurrentItem.Node.MoveNext(ParentBTree);
						Parent.Slots[i] = ParentBTree.CurrentItem.Node.Slots[ParentBTree.CurrentItem.NodeItemIndex];
						ParentBTree.FixVacatedSlot = true;
						//ParentBTree.CurrentItem.Node.FixTheVacatedSlot(ParentBTree);
					}	// *********** End of Unbalanced right sibling branch processing
					else
					{
						if (i == Parent.count - 1 && RightSibling.count == 1)
						{	// we need to combine the Rightmost sibling's item with the parent's last item and make them the rightmost node's items.
							// This scenario caters for this:
							//		[ 5 | 7 ]
							//     /    |    \
							//   [3]  [*7*] [10]
							// NOTE: slot containing 7 is this node's slot and which was already moved 
							// to the parent. See the slot in the parent containing 7.

							// After this block of code will be:
							//		[ 5 ]
							//     /     \
							//  [3]    [7|10]
							// NOTE: 5 was joined with 3 on the same slots container, 
							// parent's 7 moved to the slot previously occupied by 5, [*7] got deleted
							// and 10 became the parent's 1st item's right child.

							RightSibling.Slots[1] = RightSibling.Slots[0];
							RightSibling.Slots[0] = Parent.Slots[Parent.count - 1];
							Parent.Children[i] = RightSibling;
							Parent.Children[i + 1] = null;
							Parent.Slots[i] = null;
							Parent.count--;
							RightSibling.count = 2;
							ParentBTree.AddRecycleNode(this);
						}
						else
						{
							Slots[0] = Parent.Slots[i];
							Parent.Slots[i] = RightSibling.Slots[0];
							RightSibling.PullFromRight(ParentBTree);
						}
					}
					RightSibling = null;
				}
			}

			/// <summary>
			/// Search for a pullable item from sibling nodes of this node. Modified for unbalanced branch's correct detection of pullable item. -10/31/97
			/// Find a pullable item. Will return true if there is one.
			/// </summary>
			/// <param name="SlotLength">Number of slots per node</param>
			/// <param name="Index">Will be updated of the pullable item's index in the slot</param>
			/// <returns>true if there is pullable item, else false</returns>
			private bool SearchForPullableItem(byte SlotLength, out byte Index)
			{
				Index = 0;
				if (Parent.count == 1)
				{
					Index = (byte)(GetIndexOfNode(SlotLength) ^ 1);
					return Parent.Children[Index].Children != null ||
						Parent.Children[Index].count > 1;
				}
				else
				{
					for (byte i = 0; i <= SlotLength && Parent.Children[i] != null; i++)
					{
						if (this != Parent.Children[i])
						{
							Index = i;	// pick one in case the below statement won't be true.
							if (Parent.Children[i].count > 1)
								break;
						}
					}
					return true;
				}
			}
			/// <summary>
			/// Slots of this TreeNode
			/// </summary>
			internal protected object[] Slots = null;			// available Slots
			protected byte count;
			/// <summary>
			/// Parent of this TreeNode
			/// </summary>
			protected TreeNode Parent = null;			// parent TreeNode node
			/// <summary>
			/// Children of this TreeNode
			/// </summary>
			protected TreeNode[] Children = null;		// Children TreeNode nodes
		}	// end of TreeNode
		/// <summary>
		/// The root node class. Encapsulates behavior specific to root nodes. 
		/// Also, since we support tree reuse, this adds attributes to support reuse.
		/// </summary>
		internal class TreeRootNode : TreeNode
		{
			/// <summary>
			/// Constructor
			/// </summary>
			/// <param name="ParentTree">Paren BTree</param>
			internal protected TreeRootNode(BTreeAlgorithm ParentTree) : base(ParentTree) { }

			/// <summary>
			/// Get: returns the number of loaded items in the tree<br/>
			/// Set: assigns the number of loaded items in the tree
			/// </summary>
			internal int Count = 0;

			/// <summary>
			/// Destroy all collected items and shell(slots) excluding the root shell. This renders the btree empty.
			/// </summary>
			internal new protected void Clear()
			{
				if (this.Children != null)
				{
					for (byte i = 0; i <= count ; i++)
						// Clear children nodes.
						Children[i].Clear();
				}
				Children = null;
				ResetArray(Slots, null);
				count = 0;
			}
		}	//end of TreeRootNode
	}
}

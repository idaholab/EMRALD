/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */
using System;
using System.Collections.Generic;
using System.Text;

namespace Sop.Collections.Generic.BTree
{
	internal class BTreeKeys<TKey, TValue> : System.Collections.Generic.ICollection<TKey>, IEnumerable<TKey>
	{
		public BTreeKeys(Sop.Collections.Generic.BTree.BTreeDictionary<TKey, TValue> Dictionary)
		{
			this.Dictionary = Dictionary;
		}
		public void Add(TKey item)
		{
			throw new InvalidOperationException();
		}

		public void Clear()
		{
			throw new InvalidOperationException();
		}

		public bool Contains(TKey item)
		{
			return Dictionary.Search(item);
		}

		public void CopyTo(TKey[] array, int arrayIndex)
		{
			if (array == null)
				throw new ArgumentNullException("array");
			if (arrayIndex < 0 || arrayIndex >= array.Length)
				throw new ArgumentOutOfRangeException("arrayIndex");
			if (Dictionary.Count > array.Length - arrayIndex)
				throw new InvalidOperationException("There are more items to copy than elements on target starting from index");
			if (Dictionary.MoveFirst())
			{
				do
				{
					array[arrayIndex++] = Dictionary.CurrentKey;
				} while (Dictionary.MoveNext());
			}
		}

		public int Count
		{
			get
			{
				return Dictionary.Count;
			}
		}

		public bool IsReadOnly
		{
			get
			{
				return true;
			}
		}

		public bool Remove(TKey item)
		{
			return Dictionary.btree.Remove(item);
		}

		IEnumerator<TKey> enumerator;
		public IEnumerator<TKey> GetEnumerator()
		{
			if (enumerator == null)
				enumerator = new BTreeDictionary<TKey, TValue>.BTreeEnumeratorKey(Dictionary);
			return enumerator;
		}

		System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
		{
			return this.GetEnumerator();
		}

        Sop.Collections.Generic.BTree.BTreeDictionary<TKey, TValue> Dictionary;
	}
}

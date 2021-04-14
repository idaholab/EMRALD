
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

namespace Sop.Collections.BTree
{
	using System;
	using System.Threading;
	/// <summary>
	/// ICollection defines the BTree "custom" Collection interface
	/// </summary>
	internal interface ICollection
	{
		/// <summary>
		/// Returns the count of items stored in the Collection
		/// </summary>
		int Count
		{
			get;
		}
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
		/// Returns the Current entry
		/// </summary>
		object CurrentEntry
		{
			get;
		}
		/// <summary>
		/// Search the Collection for existence of ObjectToSearch
		/// </summary>
		bool Search(object ObjectToSearch);	// return true if found, else false
		/// <summary>
		/// Add 'ObjectToAdd' to the Collection
		/// </summary>
		void Add(object ObjectToAdd);
		/// <summary>
		/// Remove ObjectToRemove from the Collection if found, else throws an exception
		/// </summary>
		void Remove(object ObjectToRemove);	// return true if found & removed, else false
		/// <summary>
		/// Clear the Collection of all its items
		/// </summary>
		void Clear();
		/// <summary>
		/// Shallow copy the Collection and returns a duplicate Collection.
		/// </summary>
		object Clone();		// Do a shallow copy of the Collection
	}
	/// <summary>
	/// Extends the Collections.BTreeICollection interface and adds Dictionary related api
	/// </summary>
	internal interface IDictionary : Collections.BTree.ICollection
	{
		/// <summary>
		/// Add Key and Value as entry to the Dictionary/Collection
		/// </summary>
		void Add(object Key, object Value);
		/// <summary>
		/// Returns the Current entry's key
		/// </summary>
		object CurrentKey
		{
			get;
		}
		/// <summary>
		/// Returns the Current entry's Value
		/// </summary>
		object CurrentValue
		{
			get;
		}
	}
	
	/*
	/// <summary>
	/// Collection is an abstract class having Synchronized method that returns a Synchronized
	/// wrapper object to a Collection. All ICollection interface is still declared abstract 
	/// methods/properties in this class.
	/// </summary>
	public abstract class Collection : ICollection	//, System.Collections.ICollection
	{
		/// <summary>
		/// Returns synchronized collection wrapper 
		/// </summary>
		/// <param name="Collection"></param>
		/// <returns></returns>
		public static ICollection Synchronized(ICollection Collection)
		{
			return new Collections.BTreeSyncCollection(Collection, new SyncCollection.Synchronizer());
		}
		public abstract int Count
		{
			get;
		}
		public abstract bool MoveNext();
		public abstract bool MovePrevious();
		public abstract bool MoveFirst();
		public abstract bool MoveLast();
		public abstract object CurrentEntry
		{
			get;
			set;
		}
		public abstract bool Search(object ObjectToSearch);	// return true if found, else false
		public abstract void Add(object ObjectToAdd);
		public abstract void Remove(object ObjectToRemove);
		public abstract void Clear();
		public abstract object Clone();
	}
	/// <summary>
	/// Dictionary extends Collection by adding associated Kay/Value entry api
	/// and a method that returns Synchronize object wrapper to a Dictionary.
	/// </summary>
	public abstract class Dictionary : Collection
	{
		public static IDictionary Synchronized(IDictionary Collection)
		{
			return new SyncDictionary(Collection, new SyncCollection.Synchronizer());
		}
		private new void Add(object ObjectToAdd){}
		public abstract void Add(object Key, object Value);
		public abstract object CurrentKey
		{
			get;
		}
		public abstract object CurrentValue
		{
			get;
			set;
		}
	}
	*/


	/*
	/// <summary>
	/// Synchronized Collection
	/// </summary>
	public abstract class SyncCollection : ICollection	//, System.Collections.ICollection
	{
		/// <summary>
		/// Collection operation types.
		/// </summary>
		public enum OperationType : byte
		{
			/// <summary>
			/// No operation
			/// </summary>
			Idle,
			/// <summary>
			/// In Move or get current object/key/value operation
			/// </summary>
			Read,
			/// <summary>
			/// In Search operation
			/// </summary>
			Search,
			/// <summary>
			/// In Add and Delete operation
			/// </summary>
			Write
		}
		/// <summary>
		/// Synchronizer wraps thread synchronization on Collection code.
		/// </summary>
		public class Synchronizer
		{
			private SingleThreadAccess ResCtrl = new SingleThreadAccess();
			/// <summary>
			/// ResControl returns a single thread access resource mngr
			/// </summary>
			internal SingleThreadAccess ResControl
			{
				get
				{
					return ResCtrl;
				}
			}
			/// <summary>
			/// Current operation being serviced by the Collection
			/// </summary>
			protected OperationType CurrentOperation;
			/// <summary>
			/// IsWriteRequested tells Collection if a request to update the Collection
			/// was received.
			/// </summary>
			protected bool IsWriteRequested;
			/// <summary>
			/// count of threads in read operation.
			/// </summary>
 			protected int ReadCount;
			//		Logic table:
			//Current Operation	: Requested Operation	: Result
			//Idle				: Read/Search or Write	: Allowed
			//Read/Search			: Read/Search			: Allowed
			//Read/Search			: Write					: Wait until Read/Search is done
			//Write				: Read/Search or Write	: Wait until Write is done
			//

			/// <summary>
			/// Locks this Synchronizer so that other threads won't be able to access this Synchronizer until this Synchronizer gets Unlocked. See Unlock function below.
			/// </summary>
			/// <param name="RequestedOperation">Lock resource for Read, Write or Search</param>
			public void Lock(OperationType RequestedOperation)
			{
				if (!IsWriteRequested && (CurrentOperation == OperationType.Read || CurrentOperation == OperationType.Search) 
						&& (RequestedOperation == OperationType.Read || RequestedOperation == OperationType.Search))
					// we don't need to lock since reading could be done by more than one thread. As result, multiple reads invoked by multiple threads will run in parallel!
					Interlocked.Increment(ref ReadCount);
				else
				{
					if (!IsWriteRequested)
						IsWriteRequested = (CurrentOperation == OperationType.Read || CurrentOperation == OperationType.Search) && RequestedOperation == OperationType.Write;
					ResControl.Lock();
					IsWriteRequested = false;
					CurrentOperation = RequestedOperation;
					if (RequestedOperation == OperationType.Read || RequestedOperation == OperationType.Search)
						ReadCount = 1;
				}
			}
			/// <summary>
			/// Unlock function. Removes Synchronizer lock so that pending operation waiting to get a lock on the Synchronizer, will be able to get one.
			/// </summary>
			public void Unlock()
			{
				if (((CurrentOperation == OperationType.Read || CurrentOperation == OperationType.Search) && Interlocked.Decrement(ref ReadCount) == 0) || 
					CurrentOperation == OperationType.Write)
				{
					CurrentOperation = OperationType.Idle;
					ResControl.Unlock();
					return;
				}
			}
			// Constructor
			public Synchronizer()
			{
				CurrentOperation = OperationType.Idle;
			}
		}	// End of Synchronizer class
		private Synchronizer oSynchronizer;
		private ushort nLockCtr;
		/// <summary>
		/// Collection is the Collection wrapped by the synchronize Collection wrapper
		/// </summary>
		protected ICollection Collection;		// the multi-thread shared Collection object!!
		/// <summary>
		/// Returns whether this Collection is synchronized. In this case, always returns true
		/// </summary>
		public bool IsSynchronized
		{
			get
			{
				return true;
			}
		}
		/// <summary>
		/// Returns the Synchronizer root
		/// </summary>
		public object SyncRoot
		{
			get
			{
				return this.oSynchronizer;
			}
		}
		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="Collection">Collection to be wrapped by synchronized Collection</param>
		/// <param name="oSync">synchronizer object used to do thread sync on Collection</param>
		public SyncCollection(ICollection Collection, Synchronizer oSync)
		{
			nLockCtr = 0;
			this.Collection = Collection;
			this.oSynchronizer = oSync;
		}
		// Locks this object if it is not locked by this thread yet. If it is then, just increment lock count. 
		// NOTE: not thread safe as this Synchronization object wrapper is designed for apartment thread.
		//		The multi-thread shared 'Collection' is the one having thread safety features.
		public void Lock(OperationType RequestedOperation)
		{
			if (nLockCtr == 0)
				((Synchronizer)SyncRoot).Lock(RequestedOperation);
			nLockCtr++;		// no need to synchronize as this lock ctr is for the current thread only
		}
		// Unlock function.
		// NOTE: not thread safe as this Synchronization object wrapper is designed for apartment thread.
		//		The multi-thread shared 'Collection' is the one having thread safety features.
		public void Unlock()
		{
			if (nLockCtr > 0 && --nLockCtr == 0)
				((Synchronizer)SyncRoot).Unlock();
		}
		// Removes lock. This ensures lock is removed.
		// NOTE: not thread safe as this Synchronization object wrapper is designed for apartment thread.
		//		The multi-thread shared 'Collection' is the one having thread safety features.
		public void ForceUnlock()
		{
			while (nLockCtr > 0)
			{
				if (--nLockCtr == 0)
					((Synchronizer)SyncRoot).Unlock();
			}
		}
		public int Count
		{
			get
			{
				return Collection.Count;
			}
		}
		public bool MoveNext()
		{
			bool r;
			Lock(OperationType.Read);
			r = Collection.MoveNext();
			Unlock();
			return r;
		}
		public bool MovePrevious()
		{
			bool r;
			Lock(OperationType.Read);
			r = Collection.MovePrevious();
			Unlock();
			return r;
		}
		public bool MoveFirst()
		{
			bool r;
			Lock(OperationType.Read);
			r = Collection.MoveFirst();
			Unlock();
			return r;
		}
		public bool MoveLast()
		{
			bool r;
			Lock(OperationType.Read);
			r = Collection.MoveFirst();
			Unlock();
			return r;
		}
		public object CurrentEntry
		{
			get
			{
				object o;
				Lock(OperationType.Read);
				o = Collection.CurrentEntry;
				Unlock();
				return o;
			}
		}
		public bool Search(object ObjectToSearch)	// return true if found, else false
		{
			bool r;
			Lock(OperationType.Read);
			r = Collection.Search(ObjectToSearch);
			Unlock();
			return r;
		}
		public void Add(object ObjectToAdd)
		{
			Lock(OperationType.Write);
			Collection.Add(ObjectToAdd);
			Unlock();
		}
		public void Remove(object ObjectToRemove)	// return true if found, else false
		{
			Lock(OperationType.Write);
			Collection.Remove(ObjectToRemove);
			Unlock();
		}
		public void Clear()
		{
			Lock(OperationType.Write);
			Collection.Clear();
			Unlock();
		}
		public object Clone()		// Do a shallow duplication of the Collection
		{
			object o;
			Lock(OperationType.Read);
			o = Collection.Clone();
			Unlock();
			return o;
		}
	}	// end of SyncCollection
*/


/*
	/// <summary>
	/// Synchronized Dictionary wrapper
	/// </summary>
	public class SyncDictionary :	SyncCollection, 
									IDictionary,
									System.Collections.IDictionary,
									System.Collections.ICollection, 
									System.Collections.IEnumerable,
									System.ICloneable
	{
		public SyncDictionary(IDictionary Collection, Synchronizer oSync) : base(Collection, oSync){}

		public static IDictionary Synchronized(IDictionary Collection)
		{
			return new SyncDictionary(Collection, new SyncCollection.Synchronizer());
		}

		public void Add(object Key, object Value)
		{
			Lock(OperationType.Read);
			((IDictionary)Collection).Add(Key, Value);
			Unlock();
		}
		public object CurrentKey
		{
			get
			{
				object o;
				Lock(OperationType.Read);
				o = ((IDictionary)Collection).CurrentKey;
				Unlock();
				return o;
			}
		}
		public object CurrentValue
		{
			get
			{
				object o;
				Lock(OperationType.Read);
				o = ((IDictionary)Collection).CurrentValue;
				Unlock();
				return o;
			}
		}
		//**** System.Collections.IDictionary API
		/// <summary>
		/// Contains determines whether this collection contains an entry with the specified key.
		/// </summary>
		/// <param name="key">key to look for</param>
		/// <returns></returns>
		public bool Contains(object key)
		{
			return true;
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
		/// Copy To array all items from this BTree tree
		/// </summary>
		/// <param name="DestArray">DestArray is the destination array</param>
		/// <param name="StartIndex">StartIndex is the dest array index where copy starts</param>
		public void CopyTo(Array DestArray, int StartIndex)
		{
			foreach(object o in this)
			{
				DestArray.SetValue(o,StartIndex);
				StartIndex++;
			}
		}
		/// <summary>
		/// IDictionary GetEnumerator Implementation
		/// </summary>
		/// <returns>Returns a clone of this collection that can track its tree traversal state (per current record pointer)</returns>
		public System.Collections.IDictionaryEnumerator GetEnumerator()
		{
			return null;
		}
		/// <summary>
		/// IEnumerable Interface Implementation
		/// </summary>
		/// <returns></returns>
		System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
		{
			return null;
		}
		/// <summary>
		/// BTree indexer. Given a key, will return its value.
		/// </summary>
		public object this[object key]
		{
			get
			{
				return null;
			}
			set
			{
				//Collection[key] = value;
			}
		}
		/// <summary>
		/// Returns a version of this BTree whose members are all Keys of the members
		/// </summary>
		public System.Collections.ICollection Keys
		{
			get
			{
				return null;
			}
		}
		/// <summary>
		/// Returns a version of this BTree whose members are all Values of the members
		/// </summary>
		public System.Collections.ICollection Values
		{
			get
			{
				return null;
			}
		}
	}
	*/
}


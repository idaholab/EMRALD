/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */
using System;
using System.Threading;

namespace Sop.Collections.BTree
{
    /// <summary>
    /// Synchronizer wraps thread synchronization on Collection code.
    /// Instances of this class can serve as SyncRoot for any collection type classes
    /// </summary>
    public class Synchronizer
    {
        //		Logic table:
        //Current Operation	: Requested Operation	: Result
        //Idle				: Read/Search or Write	: Allowed
        //Read/Search		: Read/Search			: Allowed
        //Read/Search		: Write					: Wait until Read/Search is done
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
                SingleThreadAccess.Lock(this);
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
                SingleThreadAccess.Unlock(this);
                return;
            }
        }
        /// <summary>
        /// Default constructor
        /// </summary>
        public Synchronizer()
        {
            CurrentOperation = OperationType.Idle;
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
    }
}

/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */

#region History Log
//Log :
// 6/3/2001  .NET migration
// 6/18/1998 Initial version.
#endregion

namespace Sop.Collections.BTree
{
    using System.Threading;
    /// <summary>
    ///    SingleThreadAccess contains api for single thread access to a resource.
    /// </summary>
    internal class SingleThreadAccess	// : ISingleThreadAccess
    {
		/// <summary>
		/// Default constructor
		/// </summary>
		public SingleThreadAccess() {}

		/// <summary>
		/// Lock this resource for update. This allows only a single thread to get
		/// access to the resource.
		/// </summary>
		public void Lock()
		{
			Monitor.Enter(this);
		}
		/// <summary>
		/// Lock this resource for update. This allows only a single thread to get
		/// access to the resource.
		/// </summary>
		/// <param name="Value">object resource to synchronize access with</param>
		static public void Lock(object Value)
		{
			Monitor.Enter(Value);
		}

		/// <summary>
		/// Unlock this resource so other thread(s) may acquire a Lock on it.
		/// </summary>
		public void Unlock()
		{
			Monitor.Exit(this);
		}
		/// <summary>
		/// Unlock this resource so other thread(s) may acquire a Lock on it.
		/// </summary>
		/// <param name="Value">object resource to synchronize access with</param>
		static public void Unlock(object Value)
		{
			Monitor.Exit(Value);
		}
	}
}

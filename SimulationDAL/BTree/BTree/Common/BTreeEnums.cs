/* 
 * Copyright(c) 2002 Gerardo Recinto/4A Technologies (http://www.4atech.net)
 * MIT License https://www.codeproject.com/Articles/96397/B-Tree-Sorted-Dictionary
 */
using System;
using System.Collections.Generic;
using System.Text;

namespace Sop.Collections.BTree
{
    /// <summary>
    /// Traversal/sort order enum
    /// </summary>
    public enum SortOrderType
    {
        /// <summary>
        /// Sort order is ascending
        /// </summary>
        Ascending,
        /// <summary>
        /// Sort order is descending
        /// </summary>
        Descending
    }
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
    /// BTree item type enumeration
    /// </summary>
    public enum ItemType
    {
        /// <summary>
        /// Default
        /// </summary>
        Default,
        /// <summary>
        /// Key item type
        /// </summary>
        Key,
        /// <summary>
        /// Value item type
        /// </summary>
        Value
    }
    /// <summary>
    /// Child nodes enumeration
    /// </summary>
    public enum ChildNodes
    {
        /// <summary>
        /// Left child
        /// </summary>
        LeftChild,
        /// <summary>
        /// Right child
        /// </summary>
        RightChild
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter
{
    /// <summary>
    /// HunterTask represents a task that the operator is performing.
    /// </summary>
    public class HunterTask
    {
        public Dictionary<string, Procedure> ProcedureCatalog { get; set; }
    }
}

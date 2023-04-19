using Hunter.Proc;

namespace Hunter.Model
{
    /// <summary>
    /// HunterTask represents a task that the operator is performing.
    /// </summary>
    public class HunterTask
    {
        public Dictionary<string, Procedure> ProcedureCatalog { get; set; }
    }
}

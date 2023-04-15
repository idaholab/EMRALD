using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Hunter.PerformanceShapingFactor;

namespace Hunter
{
    public interface IUpdateStrategy
    {
        void UpdateLevel(PerformanceShapingFactor psf, HRAEngine? hRAEngine, string jsonData);
    }

    // Important Developer Note:
    //
    // Define a Update Strategy for each Performance Shaping Factor Type or Type/Labels
    // and make sure PerformanceShapingFactorCollection.SetUpdateStrategy() intializes the strategy
    // if you don't do this second part it will be null and the UpdateLevel() method will not be called

    public class FitnessforDuty : IUpdateStrategy
    {
        public void UpdateLevel(PerformanceShapingFactor psf, HRAEngine? hRAEngine, string jsonData)
        {
            // Check if label "Fitness for Duty"
            if (psf.Label == "FitnessForDuty")
            {
                // Implement the logic for updating the level based on FitnessforDutyAction
                // For example, you can check properties of hRAEngine, like TimeOnShift or FatigueIndex,
                // and update the level accordingly
                if (hRAEngine != null)
                {
                    if (psf.Levels != null)
                    {
                        PerformanceShapingFactor.Level? newLevel;
                        if (hRAEngine.TimeOnShift.TotalHours > 18)
                        {
                            newLevel = psf.Levels.FirstOrDefault(l => l.LevelName == "Unfit");
                        }
                        else if (hRAEngine.TimeOnShift.TotalHours > 12)
                        {
                            newLevel = psf.Levels.FirstOrDefault(l => l.LevelName == "DegradedFitness");
                        }
                        else
                        {
                            newLevel = psf.Levels.FirstOrDefault(l => l.LevelName == "Nominal");
                        }

                        if (newLevel != null)
                        {
                            psf.CurrentLevel = newLevel;
                        }
                    }
                }
            }
            // The PerformanceShapingFactor does not match the criteria
            // Return without updating the level
        }
    }
}

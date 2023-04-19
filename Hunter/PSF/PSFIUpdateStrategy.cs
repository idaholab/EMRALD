using Hunter.Hra;

namespace Hunter.Psf
{
    public interface IUpdateStrategy
    {
        void UpdateLevel(PSF psf, HRAEngine? hRAEngine, string jsonData);
    }

    // Important Developer Note:
    //
    // Define a Update Strategy for each Performance Shaping Factor OperationDescription or OperationDescription/Factors
    // and make sure PSFCollection.SetUpdateStrategy() intializes the strategy

    // if you don't do this second part it will be null and the UpdateLevel() method will not be called
    /// <summary>
    /// The FitnessforDuty class implements the IUpdateStrategy interface to update PSF levels based on the "Fitness for Duty" factor.
    /// The class evaluates properties of an HRAEngine object, such as TimeOnShift, and updates the PSF levels accordingly.
    /// </summary>
    public class FitnessforDuty : IUpdateStrategy
    {
        /// <summary>
        /// Updates the level of the given PSF object based on the "Fitness for Duty" factor. The method evaluates properties of the HRAEngine object,
        /// such as TimeOnShift, and updates the PSF levels accordingly. If the PSF does not match the criteria, the method returns without updating the level.
        /// </summary>
        /// <param name="psf">The PSF object to update.</param>
        /// <param name="hRAEngine">The HRAEngine object containing relevant properties for updating the PSF level.</param>
        /// <param name="jsonData">JSON data string used for additional data input, if needed. Currently not utilized in this implementation.</param>
        public void UpdateLevel(PSF psf, HRAEngine? hRAEngine, string jsonData)
        {
            if (IsFitnessForDuty(psf) && hRAEngine != null && psf.Levels != null)
            {
                PSF.Level? newLevel = GetNewLevel(psf, hRAEngine.TimeOnShift.TotalHours);
                if (newLevel != null)
                {
                    psf.CurrentLevel = newLevel;
                }
            }
        }

        private bool IsFitnessForDuty(PSF psf)
        {
            return psf.Factor == PsfEnums.Factor.FitnessForDuty;
        }

        private PSF.Level? GetNewLevel(PSF psf, double totalHours)
        {
            if (totalHours >= 18)
            {
                return psf.Levels.FirstOrDefault(l => l.LevelName == PsfEnums.Level.FitnessForDuty.Unfit);
            }
            else if (totalHours >= 12)
            {
                return psf.Levels.FirstOrDefault(l => l.LevelName == PsfEnums.Level.FitnessForDuty.DegradedFitness);
            }
            else
            {
                return psf.Levels.FirstOrDefault(l => l.LevelName == PsfEnums.Level.FitnessForDuty.Nominal);
            }
        }
    }
}

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
    /// The AvailableTime class implements the IUpdateStrategy interface to update PSF levels based on the "Fitness for Duty" factor.
    /// The class evaluates properties of an HRAEngine object, such as TimeOnShift, and updates the PSF levels accordingly.
    /// </summary>
    public class AvailableTime : IUpdateStrategy
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
            if (IsAvailableTime(psf) && hRAEngine != null && psf.Levels != null)
            {
                PSF.Level? newLevel = GetNewLevel(psf, hRAEngine);
                if (newLevel != null)
                {
                    psf.CurrentLevel = newLevel;
                }
            }
        }

        private bool IsAvailableTime(PSF psf)
        {
            return psf.Factor == PsfEnums.Factor.AvailableTime;
        }

        private PSF.Level? GetNewLevel(PSF psf, HRAEngine hRAEngine)
        {
            if (hRAEngine.TaskTimeRequired != null && hRAEngine.TaskAvailableTime != null)
            {
                double timeRequired = hRAEngine.TaskTimeRequired.Value.RemainingTime.Value.TotalSeconds;
                double timeAvailable = hRAEngine.TaskAvailableTime.Value.RemainingTime.Value.TotalSeconds;

                if (timeRequired * 0.98 < timeAvailable && timeAvailable < timeRequired)
                {
                    return psf.Levels.FirstOrDefault(l => l.LevelName == PsfEnums.Level.AvailableTime.BarelyAdequateTime);
                }
                else if (timeRequired >= timeAvailable)
                {
                    return psf.Levels.FirstOrDefault(l => l.LevelName == PsfEnums.Level.AvailableTime.InadequateTime);
                }
                else if (timeAvailable > timeRequired * 50)
                {
                    return psf.Levels.FirstOrDefault(l => l.LevelName == PsfEnums.Level.AvailableTime.ExpansiveTime);
                }
                else if (timeAvailable > timeRequired * 5)
                {
                    return psf.Levels.FirstOrDefault(l => l.LevelName == PsfEnums.Level.AvailableTime.ExtraTime);
                }
            }
            return psf.Levels.FirstOrDefault(l => l.LevelName == PsfEnums.Level.AvailableTime.NominalTime);
        }
    }
}

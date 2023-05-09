using Hunter.Hra;
using Hunter.Psf;

namespace Hunter.Model
{
    /// <summary>
    /// HunterFactory is a static class that contains methods 
    /// for creating a Hunter HRAEngine and PSFCollection.
    /// </summary>
    public static class HunterFactory
    {
        public static HRAEngine FromHunterModelFilename(string hunterModelFilename)
        {
            HunterSnapshot hunterSnapshot = HunterSnapshot.FromHunterModelFilename(hunterModelFilename);
            return CreateOperator(hunterSnapshot);
        }

        public static HRAEngine CreateOperator(HunterSnapshot snapshot)
        {
            HRAEngine hraEngine = CreateOperator(
                snapshot.RepeatMode,
                snapshot.TimeOnShiftFatigueEnabled,
                snapshot.TimeOnShift,
                snapshot.HasTimePressure,
                snapshot.Experience,
                snapshot.MaxRepeat);

            hraEngine.SetCurrentProcedureId(snapshot._currentProcedureId);
            hraEngine.SetCurrentStepId(snapshot._currentStepId);
            hraEngine.SetCurrentEvalState(snapshot._currentEvalState);
            hraEngine.SetPrimitiveEvalCount(snapshot._primitiveEvalCount);
            hraEngine.SetRepeatCount(snapshot._repeatCount);

            return hraEngine;
        }
        public static HRAEngine CreateOperator(
            bool repeatMode = true,
            bool timeOnShiftFatigueEnabled = true,
            TimeSpan startTimeOnShift = default,
            bool hasTimePressure = false,
            string experience = default,
            int maxRepeat=4)
        {
            HRAEngine hraEngine = new HRAEngine
            {
                RepeatMode = repeatMode,
                TimeOnShiftFatigueEnabled = timeOnShiftFatigueEnabled,
                TimeOnShift = startTimeOnShift,
                MaxRepeatCount = maxRepeat
            };

            if (hasTimePressure)
            {
                hraEngine.psfCollection.SetLevel(PsfEnums.Id.TPa, PsfEnums.Level.TimePressure.High);
                hraEngine.psfCollection.SetLevel(PsfEnums.Id.TPd, PsfEnums.Level.TimePressure.High);
            }

            if (experience == PsfEnums.Level.ExperienceAndTraining.Low)
            {
                hraEngine.psfCollection.SetLevel(PsfEnums.Id.EaTa, PsfEnums.Level.ExperienceAndTraining.Low);
                hraEngine.psfCollection.SetLevel(PsfEnums.Id.EaTd, PsfEnums.Level.ExperienceAndTraining.Low);
            }
            else if (experience == PsfEnums.Level.ExperienceAndTraining.High)
            {
                hraEngine.psfCollection.SetLevel(PsfEnums.Id.EaTa, PsfEnums.Level.ExperienceAndTraining.High);
                hraEngine.psfCollection.SetLevel(PsfEnums.Id.EaTd, PsfEnums.Level.ExperienceAndTraining.High);
            }
            hraEngine.SetPSFCollection(hraEngine.psfCollection);

            return hraEngine;
        }

        public static HRAEngine CreateNoviceOperator()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.Low);
        }

        public static HRAEngine CreateDefaultOperator()
        {
            return CreateOperator();
        }

        public static HRAEngine CreateExpertOperator()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.High);
        }

        public static HRAEngine CreateDefaultOperatorWithTimePressure()
        {
            return CreateOperator(
                hasTimePressure: true);
        }

        public static HRAEngine CreateNoviceOperatorWithTimePressure()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.Low,
                hasTimePressure: true);
        }

        public static HRAEngine CreateExpertOperatorWithTimePressure()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.High,
                hasTimePressure: true);
        }
    }
}

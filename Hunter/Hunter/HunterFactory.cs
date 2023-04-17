using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter
{
    public static class HunterFactory
    {
        public static (HRAEngine, PSFCollection) FromHunterModelFilename(string hunterModelFilename)
        {
            HunterSnapshot hunterSnapshot = HunterSnapshot.FromHunterModelFilename(hunterModelFilename);
            return CreateOperator(hunterSnapshot);
        }

        public static (HRAEngine, PSFCollection) CreateOperator(HunterSnapshot snapshot)
        {
            (HRAEngine hraEngine, PSFCollection psfCollection) = CreateOperator(
                snapshot.RepeatMode,
                snapshot.TimeOnShiftFatigueEnabled,
                snapshot.TimeOnShift,
                snapshot.HasTimePressure,
                snapshot.Experience);

            hraEngine = new HRAEngine();
            hraEngine.RepeatMode = snapshot.RepeatMode;
            hraEngine.TimeOnShiftFatigueEnabled = snapshot.TimeOnShiftFatigueEnabled;
            hraEngine.TimeOnShift = snapshot.TimeOnShift;
            hraEngine.SetCurrentProcedureId(snapshot._currentProcedureId);
            hraEngine.SetCurrentStepId(snapshot._currentStepId);
            hraEngine.SetCurrentSuccess(snapshot._currentSuccess);
            hraEngine.SetPrimitiveEvalCount(snapshot._primitiveEvalCount);
            hraEngine.SetRepeatCount(snapshot._repeatCount);

            return (hraEngine, psfCollection);
        }
        public static (HRAEngine, PSFCollection) CreateOperator(
            bool repeatMode = true,
            bool timeOnShiftFatigueEnabled = true,
            TimeSpan startTimeOnShift = default,
            bool hasTimePressure = false,
            string experience = default)
        {
            HRAEngine hraEngine = new HRAEngine
            {
                RepeatMode = repeatMode,
                TimeOnShiftFatigueEnabled = timeOnShiftFatigueEnabled,
                TimeOnShift = startTimeOnShift
            };

            PSFCollection? psfCollection = new PSFCollection();
            if (hasTimePressure)
            {
                psfCollection.SetLevel(PsfEnums.Id.ATa, PsfEnums.Level.AvailableTime.BarelyAdequateTime);
                psfCollection.SetLevel(PsfEnums.Id.ATd, PsfEnums.Level.AvailableTime.BarelyAdequateTime);
            }

            if (experience == PsfEnums.Level.ExperienceAndTraining.Low)
            {
                psfCollection.SetLevel(PsfEnums.Id.EaTa, PsfEnums.Level.ExperienceAndTraining.Low);
                psfCollection.SetLevel(PsfEnums.Id.EaTd, PsfEnums.Level.ExperienceAndTraining.Low);
            }
            else if (experience == PsfEnums.Level.ExperienceAndTraining.High)
            {
                psfCollection.SetLevel(PsfEnums.Id.EaTa, PsfEnums.Level.ExperienceAndTraining.High);
                psfCollection.SetLevel(PsfEnums.Id.EaTd, PsfEnums.Level.ExperienceAndTraining.High);
            }

            return (hraEngine, psfCollection);
        }

        public static (HRAEngine, PSFCollection) CreateNoviceOperator()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.Low);
        }

        public static (HRAEngine, PSFCollection) CreateDefaultOperator()
        {
            return CreateOperator();
        }

        public static (HRAEngine, PSFCollection) CreateExpertOperator()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.High);
        }

        public static (HRAEngine, PSFCollection) CreateDefaultOperatorWithTimePressure()
        {
            return CreateOperator(
                hasTimePressure: true);
        }

        public static (HRAEngine, PSFCollection) CreateNoviceOperatorWithTimePressure()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.Low,
                hasTimePressure: true);
        }

        public static (HRAEngine, PSFCollection) CreateExpertOperatorWithTimePressure()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.High,
                hasTimePressure: true);
        }
    }
}

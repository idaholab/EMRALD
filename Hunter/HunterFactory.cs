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

        public static (HRAEngine, PSFCollection) CreateOperator(
            bool repeatMode = true, 
            bool timeOnShiftFatigueEnabled = true,
            TimeSpan timeOnShift = default,
            bool hasTimePressure = false,
            string experience = default
            )
        {
            HRAEngine hraEngine = new HRAEngine
            {
                RepeatMode = repeatMode,
                TimeOnShiftFatigueEnabled = timeOnShiftFatigueEnabled,
                TimeOnShift = timeOnShift       
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

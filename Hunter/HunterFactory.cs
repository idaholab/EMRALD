using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hunter
{
    public class HunterFactory
    {

        public (HRAEngine, PSFCollection) CreateOperator(
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

        public (HRAEngine, PSFCollection) CreateNoviceOperator()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.Low);
        }

        public (HRAEngine, PSFCollection) CreateDefaultOperator()
        {
            return CreateOperator();
        }

        public (HRAEngine, PSFCollection) CreateExpertOperator()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.High);
        }

        public (HRAEngine, PSFCollection) CreateDefaultOperatorWithTimePressure()
        {
            return CreateOperator(
                hasTimePressure: true);
        }

        public (HRAEngine, PSFCollection) CreateNoviceOperatorWithTimePressure()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.Low,
                hasTimePressure: true);
        }

        public (HRAEngine, PSFCollection) CreateExpertOperatorWithTimePressure()
        {
            return CreateOperator(
                experience: PsfEnums.Level.ExperienceAndTraining.High,
                hasTimePressure: true);
        }
    }
}

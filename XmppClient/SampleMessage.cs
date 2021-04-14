// Copyright 2021 Battelle Energy Alliance


namespace XmppMessageClient
{
    public class SampleMessage
    {
        public class MyDate
        {
            public int year, month, day;
        }

        public string msgType;
        public string description;
        public MyDate date;

        public override string ToString()
        {
            return "Message Type: " + msgType + "   Description: " + description + "   Date: " + date.month + "/" + date.day + "/" + date.year;
        }
    }
}

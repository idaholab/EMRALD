// Copyright 2021 Battelle Energy Alliance

using System.Collections.Generic;

namespace XmppMessageServer
{
    internal class Global
    {
        public static Dictionary<string, XmppServerConnection> ServerConnections = new Dictionary<string, XmppServerConnection>();
    }
}

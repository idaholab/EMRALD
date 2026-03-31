// Copyright 2021 Battelle Energy Alliance
// Holds global state for the XMPP message server, including the dictionary of active server connections.

using System.Collections.Generic;

namespace XmppMessageServer
{
    internal class Global
    {
        public static Dictionary<string, XmppServerConnection> ServerConnections = new Dictionary<string, XmppServerConnection>();
    }
}

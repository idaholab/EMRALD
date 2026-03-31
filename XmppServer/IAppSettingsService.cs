// Copyright 2021 Battelle Energy Alliance
// Interface for accessing XMPP server application settings such as the license key.

namespace XmppServer
{
    public interface IAppSettingsService
    {
        string XmppLicense { get; }
    }
}
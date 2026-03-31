// Copyright 2021 Battelle Energy Alliance
// Implements IAppSettingsService to retrieve XMPP server settings such as the license key from application configuration.

using Microsoft.Extensions.Configuration;

namespace XmppServer
{
  public class AppSettingsService : IAppSettingsService
  {
    private readonly IConfiguration _configuration;

    public AppSettingsService(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    public string XmppLicense => _configuration["Secrets:XmppLicense"];
  }
}
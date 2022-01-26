// Copyright 2021 Battelle Energy Alliance

using Microsoft.Extensions.Configuration;

namespace XmppMessageClient
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
let appInsights = require("applicationinsights");
appInsights
  .setup(process.env.APPLICATION_INSIGHTS_CONNECTION_STRING)
  .setAutoCollectConsole(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectHeartbeat(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectRequests(true)
  .setAutoDependencyCorrelation(true)
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
  .setSendLiveMetrics(true)
  .setUseDiskRetryCaching(true);
appInsights.defaultClient.setAutoPopulateAzureProperties(true);
appInsights.start();

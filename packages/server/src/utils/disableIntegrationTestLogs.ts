import { disableMetricsServiceLogs } from '../metrics/MetricsService.js';
import { disableAuthenticationServiceLogs } from '../authentication/AuthenticationService.js';
import { disableSmtpClientLogging } from '../email/SmtpClient.js';
import { disableConfigLoaderLogger } from '../config/ConfigLoader.js';
import { disableMetricsControllerLogs } from '../metrics/MetricsController.js';
import { disableAuthenticationControllerLogs } from '../authentication/AuthenticationController.js';

export function disableIntegrationTestLogs() {
  disableAuthenticationControllerLogs();
  disableAuthenticationServiceLogs();
  disableConfigLoaderLogger();
  disableMetricsControllerLogs();
  disableMetricsServiceLogs();
  disableSmtpClientLogging();
}

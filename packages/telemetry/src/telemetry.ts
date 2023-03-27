import {
  FeatureTag,
  MiddlewareException,
  Severity,
  TelemetryMiddleware,
  TelemetryProvider,
  TelemetryTags,
  TelemetryUser,
} from "./types";

export function createTelemetry(deps: { provider: TelemetryProvider }, middlewares: TelemetryMiddleware[]) {
  /**
   * Initialize the network logging provider.
   */
  function init() {
    deps.provider.init();
  }

  /**
   * Method to capture and log an error to specified network logging provider.
   */
  function captureError(error: Error, tag: FeatureTag) {
    console.log("Capture Error called")
    /** Run logic before cloud logging and return if instructed. */
    middlewares.forEach(middleware => {
      if (middleware.beforeEvent !== undefined) {
        const result = middleware.beforeEvent(error.message, { featureTag: tag, severity: Severity.Error });
        if (result.shouldExit) throw new MiddlewareException(result.message);
      }
    });

    /** Log specified error to the network. */
    deps.provider.captureError(error, tag);

    /** Run logic after cloud logging and return if instructed. */
    middlewares.forEach(middleware => {
      if (middleware?.afterEvent !== undefined) {
        const result = middleware.afterEvent(error.message, { featureTag: tag, severity: Severity.Error });
        if (result.shouldExit) throw new MiddlewareException(result.message);
      }
    });
  }

  /**
   * Method to capture a message to the network provider.
   */
  function captureMessage(message: string, tag: FeatureTag, severity = Severity.Info) {
    /** Run logic before cloud logging and return if instructed. */
    middlewares.forEach(middleware => {
      if (middleware?.beforeEvent !== undefined) {
        const result = middleware.beforeEvent(message, { featureTag: tag, severity });
        if (result.shouldExit) throw new MiddlewareException(message);
      }
    });

    /** Log specified error to the network. */
    deps.provider.captureMessage(message, tag, severity);

    /** Run logic after cloud logging and return if instructed. */
    middlewares.forEach(middleware => {
      if (middleware?.afterEvent !== undefined) {
        const result = middleware.afterEvent(message, { featureTag: tag, severity });
        if (result.shouldExit) throw new MiddlewareException(result.message);
      }
    });
  }

  /**
   * Method to capture breadcrumbs to network logging provider.
   */
  function addBreadcrumb(category: string, message: string, severity: Severity) {
    /** Run logic before cloud logging and return if instructed. */
    middlewares.forEach(middleware => {
      if (middleware?.beforeEvent !== undefined) {
        const result = middleware.beforeEvent(message, { featureTag: category as FeatureTag, severity });
        if (result.shouldExit) throw new MiddlewareException(message);
      }
    });

    /** Log specified error to the network. */
    deps.provider.addBreadcrumb(category, message, severity);

    /** Run logic after cloud logging and return if instructed. */
    middlewares.forEach(middleware => {
      if (middleware?.afterEvent !== undefined) {
        const result = middleware.afterEvent(message, { featureTag: category as FeatureTag, severity });
        if (result.shouldExit) throw new MiddlewareException(result.message);
      }
    });
  }

  /**
   * Method to add tags to each event that is logged. Tags are key value pairs that get merged if there is a collision
   */
  function setUser(user: TelemetryUser) {
    deps.provider.setUser(user);
  }

  /**
   * Method to add tags to each event that is logged. Tags are key value pairs that get merged if there is a collision
   */
  function setTags(tags: TelemetryTags) {
    deps.provider.setTags(tags);
  }

  return {
    init,
    captureError,
    captureMessage,
    addBreadcrumb,
    setUser,
    setTags,
  };
}

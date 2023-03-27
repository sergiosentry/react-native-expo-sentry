export interface TelemetryProvider {
  init: () => void;
  captureError: (error: Error, tag: FeatureTag) => void;
  captureMessage: (message: string, tag: FeatureTag, severity: Severity) => void;
  addBreadcrumb: (category: string, message: string, severity: Severity) => void;
  setUser: (user: TelemetryUser) => void;
  setTags: (tags: TelemetryTags) => void;
}

export interface TelemetryInterceptorResponse {
  modifiedData: string;
  shouldExit: boolean;
  message?: string;
}

export interface TelemetryMetadata {
  featureTag: FeatureTag;
  severity: Severity;
}

export interface TelemetryMiddleware {
  beforeEvent?: (data: string, metadata: TelemetryMetadata) => TelemetryInterceptorResponse;
  afterEvent?: (data: string, metadata: TelemetryMetadata) => TelemetryInterceptorResponse;
}

export enum FeatureTag {
  Account = "account",
  Collectibles = "collectibles",
  Fungibles = "fungibles",
  History = "history",
  Ledger = "ledger",
  MobileWalletAdapter = "mobileWalletAdapter",
  Network = "network",
  Prices = "prices",
  Provider = "provider",
  Staking = "staking",
  Storage = "storage",
  Swapper = "swapper",
  Transaction = "transaction",
  TrustedApps = "trustedApps",

  // This is a placeholder tag until we figure out proper tags. Refrain from using it.
  Generic = "generic",
}

export type TelemetryTags = Record<string, any>;

export enum Severity {
  // You want to know if something terrible happens even once, and if it does, get alerted
  Critical = "critical",

  // Use this for logging messages depciting error conditions that might not be critical but
  // if they occur more often, they should be acted on/alerted about
  Error = "error",

  // `Default` - Use this judicially to log important information that is helpful in debugging,
  // Note that logging non critical messages counts towards Sentry Quota
  Info = "info",
}

export class MiddlewareException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "MiddlewareException";
  }
}

export interface TelemetryUser {
  [key: string]: any;
  id?: string;
}

/**
 * OpenTelemetry Bootstrap
 *
 * Initializes OTel SDK with traces + metrics.
 * MUST be imported at the very start of the server entry.
 *
 * Environment variables:
 * - OTEL_SDK_DISABLED=true → Disables OTel (for tests)
 * - OTEL_EXPORTER_OTLP_ENDPOINT → OTLP endpoint (default: http://localhost:4318)
 * - OTEL_SERVICE_NAME → Service name (default: collateral-backend)
 * - NODE_ENV → deployment.environment attribute
 */
export declare function isOTelEnabled(): boolean;
export declare function shutdownOTel(): Promise<void>;

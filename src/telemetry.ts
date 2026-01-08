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

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
    ATTR_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// =============================================================================
// CONFIGURATION
// =============================================================================

const isDisabled = process.env.OTEL_SDK_DISABLED === 'true';
const serviceName = process.env.OTEL_SERVICE_NAME || 'collateral-backend';
const serviceVersion = process.env.npm_package_version || '1.0.0';
const deploymentEnvironment = process.env.NODE_ENV || 'development';
const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';

// Enable debug logging in development
if (deploymentEnvironment === 'development' && !isDisabled) {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
}

// =============================================================================
// SDK INITIALIZATION
// =============================================================================

let sdk: NodeSDK | null = null;

if (!isDisabled) {
    try {
        // Resource attributes
        const resource = new Resource({
            [ATTR_SERVICE_NAME]: serviceName,
            [ATTR_SERVICE_VERSION]: serviceVersion,
            [ATTR_DEPLOYMENT_ENVIRONMENT]: deploymentEnvironment,
        });

        // OTLP Exporters
        const traceExporter = new OTLPTraceExporter({
            url: `${otlpEndpoint}/v1/traces`,
        });

        const metricExporter = new OTLPMetricExporter({
            url: `${otlpEndpoint}/v1/metrics`,
        });

        const metricReader = new PeriodicExportingMetricReader({
            exporter: metricExporter,
            exportIntervalMillis: 60000, // Export every 60s
        });

        // Initialize SDK
        sdk = new NodeSDK({
            resource,
            traceExporter,
            metricReader,
            instrumentations: [
                getNodeAutoInstrumentations({
                    // Disable fs instrumentation (too noisy)
                    '@opentelemetry/instrumentation-fs': { enabled: false },
                    // Enable HTTP instrumentation
                    '@opentelemetry/instrumentation-http': { enabled: true },
                    // Enable Express if used
                    '@opentelemetry/instrumentation-express': { enabled: true },
                    // Enable pg if used
                    '@opentelemetry/instrumentation-pg': { enabled: true },
                    // Enable fetch/undici
                    '@opentelemetry/instrumentation-undici': { enabled: true },
                }),
            ],
        });

        sdk.start();
        console.log(`📊 OTel SDK initialized (${serviceName}@${serviceVersion}, env=${deploymentEnvironment})`);
        console.log(`📊 OTLP endpoint: ${otlpEndpoint}`);

        // Graceful shutdown
        process.on('SIGTERM', () => {
            sdk?.shutdown()
                .then(() => console.log('📊 OTel SDK shut down'))
                .catch(err => console.error('Error shutting down OTel SDK:', err))
                .finally(() => process.exit(0));
        });

    } catch (err) {
        console.warn('⚠️ OTel SDK initialization failed (continuing without telemetry):', err);
    }
} else {
    console.log('📊 OTel SDK DISABLED (OTEL_SDK_DISABLED=true)');
}

// =============================================================================
// EXPORTS
// =============================================================================

export function isOTelEnabled(): boolean {
    return !isDisabled && sdk !== null;
}

export function shutdownOTel(): Promise<void> {
    if (sdk) {
        return sdk.shutdown();
    }
    return Promise.resolve();
}

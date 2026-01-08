import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        globalSetup: ['./tests/global-setup.ts'],
        setupFiles: ['./tests/setup.ts'],
        hookTimeout: 60_000,
        testTimeout: 60_000,
        // CRITICAL: Run test files sequentially to prevent DB race conditions
        // Each file's beforeEach truncates tables, so parallel runs cause FK violations
        fileParallelism: false,
    },
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        // globalSetup: ['./tests/global-setup.ts'], // Disabled for unit tests
        // setupFiles: ['./tests/setup.ts'], // Disabled for unit tests
        hookTimeout: 60_000,
        testTimeout: 60_000,
        fileParallelism: true,
    },
});

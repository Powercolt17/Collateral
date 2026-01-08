import { execSync } from 'child_process';
const MAX_RETRIES = 30;
const DELAY_MS = 1000;
async function checkDb() {
    process.stdout.write('Waiting for Postgres...');
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // Check if ready using pg_isready inside the container
            execSync('docker exec collateral_postgres pg_isready -U postgres', { stdio: 'ignore' });
            console.log('\n✅ Postgres is ready!');
            process.exit(0);
        }
        catch (e) {
            process.stdout.write('.');
            await new Promise(r => setTimeout(r, DELAY_MS));
        }
    }
    console.error('\n❌ Timeout waiting for Postgres');
    process.exit(1);
}
checkDb();
//# sourceMappingURL=wait-for-db.js.map
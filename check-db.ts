import { db } from './server/db.js';
import { users, reports, zones, interventions } from './shared/schema.js';

async function checkDatabase() {
    console.log('Checking database contents...\n');

    try {
        // Check users
        const allUsers = await db.select().from(users);
        console.log(`📊 Users: ${allUsers.length} records`);
        allUsers.forEach(user => {
            console.log(`  - ${user.phoneNumber} (${user.role}) - ID: ${user.id}`);
        });

        // Check reports
        const allReports = await db.select().from(reports);
        console.log(`\n📊 Reports: ${allReports.length} records`);
        allReports.forEach(report => {
            console.log(`  - ${report.category} at (${report.latitude}, ${report.longitude}) - Status: ${report.status}`);
        });

        // Check zones
        const allZones = await db.select().from(zones);
        console.log(`\n📊 Zones: ${allZones.length} records`);
        allZones.forEach(zone => {
            console.log(`  - ${zone.name} (${zone.riskLevel})`);
        });

        // Check interventions
        const allInterventions = await db.select().from(interventions);
        console.log(`\n📊 Interventions: ${allInterventions.length} records`);
        allInterventions.forEach(intervention => {
            console.log(`  - ${intervention.type} in zone ${intervention.zoneId}`);
        });

        console.log('\n' + '='.repeat(50));
        console.log('Summary:');
        console.log(`Total Users: ${allUsers.length}`);
        console.log(`Total Reports: ${allReports.length}`);
        console.log(`Total Zones: ${allZones.length}`);
        console.log(`Total Interventions: ${allInterventions.length}`);
        console.log('='.repeat(50));

        if (allReports.length === 0 && allUsers.length === 0) {
            console.log('\n⚠️  No data found! The database is empty.');
            console.log('\nThis could mean:');
            console.log('1. You haven\'t submitted any reports yet');
            console.log('2. You haven\'t logged in yet (no users created)');
            console.log('3. The data is in a different database/schema');
            console.log('\nTo add test data, run: npm run seed');
        } else {
            console.log('\n✅ Data found! You can view it at:');
            console.log('https://supabase.com/dashboard → Your Project → Table Editor');
        }

    } catch (error) {
        console.error('Error checking database:', error);
    } finally {
        process.exit(0);
    }
}

checkDatabase();

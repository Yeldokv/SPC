import pg from 'pg';
const { Client } = pg;

async function checkSchemas() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('Connected to database\n');

        // Check all schemas
        const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY schema_name;
    `);

        console.log('Available schemas:');
        schemasResult.rows.forEach(row => {
            console.log(`  - ${row.schema_name}`);
        });

        // Check tables in public schema
        console.log('\n📊 Tables in "public" schema:');
        const tablesResult = await client.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

        for (const table of tablesResult.rows) {
            const countResult = await client.query(`SELECT COUNT(*) FROM public.${table.table_name}`);
            console.log(`  - ${table.table_name}: ${countResult.rows[0].count} rows (${table.column_count} columns)`);
        }

        // Show actual data from users table
        console.log('\n👥 Users table contents:');
        const usersResult = await client.query('SELECT id, phone_number, role, created_at FROM public.users ORDER BY id');
        if (usersResult.rows.length === 0) {
            console.log('  (empty)');
        } else {
            usersResult.rows.forEach(user => {
                console.log(`  - ID: ${user.id}, Phone: ${user.phone_number}, Role: ${user.role}`);
            });
        }

        // Show actual data from reports table
        console.log('\n📝 Reports table contents:');
        const reportsResult = await client.query('SELECT id, category, status, created_at FROM public.reports ORDER BY id LIMIT 5');
        if (reportsResult.rows.length === 0) {
            console.log('  (empty)');
        } else {
            reportsResult.rows.forEach(report => {
                console.log(`  - ID: ${report.id}, Category: ${report.category}, Status: ${report.status}`);
            });
            if (reportsResult.rows.length === 5) {
                const totalResult = await client.query('SELECT COUNT(*) FROM public.reports');
                console.log(`  ... and ${totalResult.rows[0].count - 5} more`);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.end();
    }
}

checkSchemas();

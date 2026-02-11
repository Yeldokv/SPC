import { db } from './server/db.js';
import { users, reports, zones, interventions } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function seedDatabase() {
    console.log('Starting database seeding...');

    try {
        // Check if data already exists
        const existingReports = await db.select().from(reports);
        if (existingReports.length > 0) {
            console.log(`Database already has ${existingReports.length} reports.`);
            console.log('Skipping seed to avoid duplicates.');
            console.log('\nTo view your data:');
            console.log('1. Go to https://supabase.com/dashboard');
            console.log('2. Select your project');
            console.log('3. Click "Table Editor" in the sidebar');
            process.exit(0);
        }

        // Get or create test user
        let testUser = (await db.select().from(users).where(eq(users.phoneNumber, '+919876543210')))[0];
        if (!testUser) {
            [testUser] = await db.insert(users).values({
                phoneNumber: '+919876543210',
                role: 'user'
            }).returning();
            console.log('Created test user:', testUser.phoneNumber);
        } else {
            console.log('Using existing test user:', testUser.phoneNumber);
        }

        // Get or create admin user
        let adminUser = (await db.select().from(users).where(eq(users.phoneNumber, 'admin')))[0];
        if (!adminUser) {
            [adminUser] = await db.insert(users).values({
                phoneNumber: 'admin',
                role: 'admin'
            }).returning();
            console.log('Created admin user');
        } else {
            console.log('Using existing admin user');
        }

        // Create zones
        const [zone1] = await db.insert(zones).values({
            name: 'Market Square',
            riskLevel: 'high',
            latitude: 10.8505,
            longitude: 76.2711,
            radius: 500
        }).returning();

        const [zone2] = await db.insert(zones).values({
            name: 'City Park',
            riskLevel: 'medium',
            latitude: 10.8540,
            longitude: 76.2750,
            radius: 300
        }).returning();

        const [zone3] = await db.insert(zones).values({
            name: 'School Area',
            riskLevel: 'low',
            latitude: 10.8560,
            longitude: 76.2780,
            radius: 200
        }).returning();

        console.log('Created 3 zones');

        // Create sample reports
        await db.insert(reports).values({
            userId: testUser.id,
            latitude: 10.8505,
            longitude: 76.2711,
            category: 'aggressive',
            description: 'Aggressive dog chasing bikes near market',
            imagePath: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
            status: 'pending'
        });

        await db.insert(reports).values({
            userId: testUser.id,
            latitude: 10.8540,
            longitude: 76.2750,
            category: 'group',
            description: 'Pack of 5 dogs near park entrance',
            imagePath: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
            status: 'verified'
        });

        await db.insert(reports).values({
            userId: testUser.id,
            latitude: 10.8520,
            longitude: 76.2730,
            category: 'injured',
            description: 'Limping dog needs medical attention',
            imagePath: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800',
            status: 'pending'
        });

        await db.insert(reports).values({
            userId: testUser.id,
            latitude: 10.8560,
            longitude: 76.2780,
            category: 'single',
            description: 'Single stray dog near school',
            imagePath: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
            status: 'closed'
        });

        console.log('Created 4 sample reports');

        // Create interventions
        await db.insert(interventions).values({
            zoneId: zone1.id,
            type: 'ABC',
            notes: 'Caught 3 dogs for sterilization',
            date: new Date()
        });

        await db.insert(interventions).values({
            zoneId: zone2.id,
            type: 'Vaccination',
            notes: 'Vaccinated 8 dogs in the area',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        });

        console.log('Created 2 interventions');
        console.log('\n✅ Database seeding completed successfully!');
        console.log('\nYou can now:');
        console.log('1. Login as admin (username: admin, password: admin)');
        console.log('2. Login as user (phone: +919876543210, use OTP from console)');
        console.log('3. View the data in Supabase dashboard at https://supabase.com/dashboard');
        console.log('4. Go to Table Editor and check: users, reports, zones, interventions');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        process.exit(0);
    }
}

seedDatabase();

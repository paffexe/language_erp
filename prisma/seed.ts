import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    // SuperAdmin mavjudligini tekshirish
    const superAdminExists = await prisma.admin.findFirst({
        where: { role: 'superAdmin', isDeleted: false },
    });

    if (!superAdminExists) {
        const hashedPassword = await bcrypt.hash('superadmin123', 10);

        const superAdmin = await prisma.admin.create({
            data: {
                username: 'superadmin',
                password: hashedPassword,
                role: 'superAdmin',
                phoneNumber: '+998900000000',
                isActive: true,
            },
        });

        console.log('✅ SuperAdmin yaratildi:');
        console.log(`   Username: superadmin`);
        console.log(`   Password: superadmin123`);
        console.log(`   ID: ${superAdmin.id}`);
    } else {
        console.log('ℹ️ SuperAdmin allaqachon mavjud');
    }
}

main()
    .catch((e) => {
        console.error('❌ Seed xatosi:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

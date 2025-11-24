import prisma from './src/lib/prisma';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await (prisma.user.create as any)({
      data: {
        username: 'admin',
        email: 'admin@barangtemu.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@barangtemu.com');
    console.log('Password: admin123');
    console.log('User ID:', admin.id);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('⚠️  Admin user already exists');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

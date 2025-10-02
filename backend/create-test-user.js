import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('=== Creando usuario de prueba ===');
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'seba@test.com' }
    });
    
    if (existingUser) {
      console.log('Usuario ya existe:', existingUser);
      return;
    }
    
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const user = await prisma.user.create({
      data: {
        name: 'Seba',
        lastName: 'Test',
        cedula: '12345678',
        username: 'seba_test',
        email: 'seba@test.com',
        birthDate: new Date('1990-01-01'),
        age: 34,
        department: 'Montevideo',
        password: hashedPassword
      }
    });
    
    console.log('Usuario creado:', {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email
    });
    
  } catch (error) {
    console.error('Error creando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();

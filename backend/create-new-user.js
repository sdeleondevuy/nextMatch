import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createNewUser() {
  try {
    console.log('=== Creando nuevo usuario de prueba ===');
    
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        lastName: 'User',
        cedula: '87654321',
        username: 'testuser',
        email: 'test@test.com',
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

createNewUser();

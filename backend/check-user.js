import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log('=== Verificando usuario ID 1 ===');
    
    const user = await prisma.user.findUnique({
      where: { id: 1 },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true
      }
    });
    
    console.log('Usuario encontrado:', user);
    
    if (user) {
      console.log('UUID del usuario:', user.uuid);
      
      // Verificar si hay deportes para este usuario
      const userSports = await prisma.userSport.findMany({
        where: { userUuid: user.uuid }
      });
      
      console.log('Deportes del usuario:', userSports);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();

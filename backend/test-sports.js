import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSports() {
  try {
    console.log('=== Probando conexión a la base de datos ===');
    
    // Verificar que las tablas existen
    const sports = await prisma.sport.findMany();
    console.log('Deportes en la BD:', sports);
    
    const users = await prisma.user.findMany({
      select: { id: true, uuid: true, name: true, email: true }
    });
    console.log('Usuarios en la BD:', users);
    
    const userSports = await prisma.userSport.findMany();
    console.log('UserSports en la BD:', userSports);
    
    // Probar crear un UserSport
    if (users.length > 0 && sports.length > 0) {
      console.log('\n=== Probando crear UserSport ===');
      const testUserSport = await prisma.userSport.create({
        data: {
          userUuid: users[0].uuid,
          sportUuid: sports[0].uuid
        }
      });
      console.log('UserSport creado:', testUserSport);
      
      // Limpiar el test
      await prisma.userSport.delete({
        where: { id: testUserSport.id }
      });
      console.log('UserSport de prueba eliminado');
    }
    
  } catch (error) {
    console.error('Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSports();

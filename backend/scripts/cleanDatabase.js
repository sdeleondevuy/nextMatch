import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🧹 Iniciando limpieza de la base de datos...');
    
    // Limpiar en el orden correcto para respetar las foreign keys
    // Primero las tablas que tienen foreign keys hacia otras tablas
    
    console.log('📊 Limpiando tabla UserPoints...');
    await prisma.userPoints.deleteMany({});
    console.log('✅ UserPoints limpiada');
    
    console.log('🔗 Limpiando tabla UserSport...');
    await prisma.userSport.deleteMany({});
    console.log('✅ UserSport limpiada');
    
    console.log('👤 Limpiando tabla User...');
    await prisma.user.deleteMany({});
    console.log('✅ User limpiada');
    
    console.log('🏃 Limpiando tabla Sport...');
    await prisma.sport.deleteMany({});
    console.log('✅ Sport limpiada');
    
    console.log('🎉 ¡Base de datos limpiada exitosamente!');
    console.log('📝 Todas las tablas están vacías y listas para nuevos datos');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para confirmar antes de ejecutar
async function confirmCleanup() {
  console.log('⚠️  ADVERTENCIA: Esta operación eliminará TODOS los datos de la base de datos');
  console.log('📋 Tablas que se limpiarán:');
  console.log('   - UserPoints');
  console.log('   - UserSport'); 
  console.log('   - User');
  console.log('   - Sport');
  console.log('');
  console.log('🔄 La estructura de las tablas se mantendrá intacta');
  console.log('');
  
  // En un entorno de producción, aquí podrías agregar una confirmación interactiva
  // Por ahora, ejecutamos directamente para facilitar el uso
  console.log('🚀 Ejecutando limpieza...');
  await cleanDatabase();
}

// Ejecutar si se llama directamente
if (process.argv[1] && process.argv[1].endsWith('cleanDatabase.js')) {
  confirmCleanup()
    .then(() => {
      console.log('✨ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { cleanDatabase, confirmCleanup };

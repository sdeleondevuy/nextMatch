import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para limpiar una tabla específica
async function cleanTable(tableName) {
  try {
    console.log(`🧹 Limpiando tabla ${tableName}...`);
    
    switch (tableName.toLowerCase()) {
      case 'userpoints':
        await prisma.userPoints.deleteMany({});
        break;
      case 'usersport':
        await prisma.userSport.deleteMany({});
        break;
      case 'user':
        // Primero limpiar UserPoints y UserSport que dependen de User
        await prisma.userPoints.deleteMany({});
        await prisma.userSport.deleteMany({});
        await prisma.user.deleteMany({});
        break;
      case 'sport':
        // Primero limpiar UserSport que depende de Sport
        await prisma.userSport.deleteMany({});
        await prisma.sport.deleteMany({});
        break;
      default:
        throw new Error(`Tabla '${tableName}' no reconocida`);
    }
    
    console.log(`✅ Tabla ${tableName} limpiada exitosamente`);
    
  } catch (error) {
    console.error(`❌ Error limpiando tabla ${tableName}:`, error);
    throw error;
  }
}

// Función para limpiar todas las tablas
async function cleanAllTables() {
  const tables = ['UserPoints', 'UserSport', 'User', 'Sport'];
  
  for (const table of tables) {
    await cleanTable(table);
  }
}

// Función para mostrar estadísticas de la base de datos
async function showDatabaseStats() {
  try {
    console.log('📊 Estadísticas de la base de datos:');
    console.log('================================');
    
    const userCount = await prisma.user.count();
    const sportCount = await prisma.sport.count();
    const userSportCount = await prisma.userSport.count();
    const userPointsCount = await prisma.userPoints.count();
    
    console.log(`👤 Usuarios: ${userCount}`);
    console.log(`🏃 Deportes: ${sportCount}`);
    console.log(`🔗 Relaciones Usuario-Deporte: ${userSportCount}`);
    console.log(`📈 Puntos de Usuario: ${userPointsCount}`);
    console.log('================================');
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
  }
}

// Función principal con opciones
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'all':
        console.log('🧹 Limpiando todas las tablas...');
        await cleanAllTables();
        console.log('🎉 ¡Todas las tablas limpiadas!');
        break;
        
      case 'table':
        const tableName = args[1];
        if (!tableName) {
          console.error('❌ Debes especificar el nombre de la tabla');
          console.log('💡 Uso: node cleanDatabaseAdvanced.js table <nombre_tabla>');
          console.log('📋 Tablas disponibles: User, Sport, UserSport, UserPoints');
          process.exit(1);
        }
        await cleanTable(tableName);
        break;
        
      case 'stats':
        await showDatabaseStats();
        break;
        
      default:
        console.log('🔧 Script de limpieza avanzada de base de datos');
        console.log('');
        console.log('📖 Uso:');
        console.log('  node cleanDatabaseAdvanced.js all          # Limpiar todas las tablas');
        console.log('  node cleanDatabaseAdvanced.js table <tabla> # Limpiar tabla específica');
        console.log('  node cleanDatabaseAdvanced.js stats        # Mostrar estadísticas');
        console.log('');
        console.log('📋 Tablas disponibles: User, Sport, UserSport, UserPoints');
        break;
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (process.argv[1] && process.argv[1].endsWith('cleanDatabaseAdvanced.js')) {
  main();
}

export { cleanTable, cleanAllTables, showDatabaseStats };

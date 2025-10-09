import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sports = [
  'Tenis Singles',
  'Tenis Dobles', 
  'Pádel',
  'Pickleball'
];

async function seedSports() {
  try {
    console.log('🌱 Iniciando seed de deportes...');
    
    // Verificar si ya existen deportes
    const existingSports = await prisma.sport.count();
    if (existingSports > 0) {
      console.log('✅ Los deportes ya existen en la base de datos');
      return;
    }
    
    // Crear deportes
    for (const sportName of sports) {
      await prisma.sport.create({
        data: {
          name: sportName
        }
      });
      console.log(`✅ Deporte creado: ${sportName}`);
    }
    
    console.log('🎉 Seed de deportes completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seed de deportes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSports();

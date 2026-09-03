/**
 * Carga datos de prueba de SoftwareAI: usuarios, categorias y cursos.
 * Uso: npm run seed
 */
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { UserModel } from '../models/User.js';
import { CategoryModel } from '../models/Category.js';
import { EventModel } from '../models/Event.js';
import { TicketModel } from '../models/Ticket.js';
import { createHash } from '../utils/hash.js';

const daysFromNow = days => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const USERS = [
  { first_name: 'Fernando', last_name: 'Sanchez', email: 'admin@softwareai.com.mx', password: 'Admin123', role: 'admin' },
  { first_name: 'Mariana', last_name: 'Ortega', email: 'instructor@softwareai.com.mx', password: 'Organizer123', role: 'organizer' },
  { first_name: 'Diego', last_name: 'Ramirez', email: 'instructor2@softwareai.com.mx', password: 'Organizer123', role: 'organizer' },
  { first_name: 'Sofia', last_name: 'Gutierrez', email: 'estudiante@softwareai.com.mx', password: 'Usuario123', role: 'user' }
];

const CATEGORIES = [
  { name: 'Desarrollo con IA', slug: 'desarrollo-con-ia', description: 'Programar acompanado de asistentes de inteligencia artificial.' },
  { name: 'Backend', slug: 'backend', description: 'APIs, bases de datos y arquitectura del lado del servidor.' },
  { name: 'Ingenieria de Datos', slug: 'ingenieria-de-datos', description: 'Pipelines, modelado y calidad de datos.' },
  { name: 'Frontend', slug: 'frontend', description: 'Interfaces web modernas y accesibles.' }
];

const buildEvents = (categories, organizers) => [
  {
    title: 'Desarrollo de Software con IA: GitHub Copilot',
    description:
      'Curso practico para dirigir a GitHub Copilot en proyectos reales: generar y entender codigo, depurar, refactorizar, escribir pruebas y documentar. La programacion cambio, el criterio sigue siendo tuyo.',
    category: categories['desarrollo-con-ia'],
    format: 'curso',
    level: 'intermediate',
    date: daysFromNow(21),
    location: 'Online',
    capacity: 40,
    price: 4800,
    status: 'published',
    organizer: organizers[0]
  },
  {
    title: 'Desarrollo de Software con IA: Claude Code',
    description:
      'Aprende a trabajar con Claude Code en la terminal: saber que pedir, como evaluar el resultado y como integrarlo correctamente en un proyecto existente.',
    category: categories['desarrollo-con-ia'],
    format: 'curso',
    level: 'intermediate',
    date: daysFromNow(45),
    location: 'Online',
    capacity: 40,
    price: 4800,
    status: 'draft',
    organizer: organizers[0]
  },
  {
    title: 'Workshop: Analisis de errores en codigo generado por IA',
    description:
      'Sesion intensiva para revisar propuestas de IA antes de implementarlas: lectura critica, deteccion de errores sutiles y criterios de aceptacion.',
    category: categories['desarrollo-con-ia'],
    format: 'workshop',
    level: 'advanced',
    date: daysFromNow(14),
    location: 'Online',
    capacity: 25,
    price: 1500,
    status: 'published',
    organizer: organizers[1]
  },
  {
    title: 'Bootcamp Backend con Node.js y MongoDB',
    description:
      'Programa intensivo de APIs REST con Express, Mongoose, autenticacion con JWT y arquitectura por capas.',
    category: categories.backend,
    format: 'bootcamp',
    level: 'beginner',
    date: daysFromNow(30),
    location: 'Ciudad de Mexico',
    capacity: 30,
    price: 12500,
    status: 'published',
    organizer: organizers[1]
  },
  {
    title: 'Diplomado en Ingenieria de Datos',
    description:
      'Diplomado de pipelines de datos, modelado dimensional, orquestacion y calidad de datos con Python y SQL.',
    category: categories['ingenieria-de-datos'],
    format: 'diplomado',
    level: 'advanced',
    date: daysFromNow(60),
    location: 'Online',
    capacity: 20,
    price: 24000,
    status: 'published',
    organizer: organizers[0]
  },
  {
    title: 'Workshop: Prompts efectivos para equipos de datos',
    description:
      'Como dirigir asistentes de IA para explorar datasets, documentar modelos y generar consultas SQL confiables.',
    category: categories['ingenieria-de-datos'],
    format: 'workshop',
    level: 'beginner',
    date: daysFromNow(7),
    location: 'Online',
    capacity: 50,
    price: 0,
    status: 'published',
    organizer: organizers[1]
  }
];

const seed = async () => {
  const connected = await connectDB();

  if (!connected) {
    console.error('No hay conexion a MongoDB. Revisa MONGO_URL en tu .env');
    process.exit(1);
  }

  await Promise.all([
    TicketModel.deleteMany({}),
    EventModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    UserModel.deleteMany({})
  ]);

  const users = await UserModel.insertMany(
    await Promise.all(
      USERS.map(async user => ({ ...user, password: await createHash(user.password) }))
    )
  );

  const categories = await CategoryModel.insertMany(CATEGORIES);
  const categoriesBySlug = Object.fromEntries(categories.map(category => [category.slug, category._id]));
  const organizers = users.filter(user => user.role === 'organizer').map(user => user._id);

  const events = await EventModel.insertMany(buildEvents(categoriesBySlug, organizers));

  console.log('Datos de prueba cargados:');
  console.log(`  usuarios:   ${users.length}`);
  console.log(`  categorias: ${categories.length}`);
  console.log(`  cursos:     ${events.length}`);
  console.log('\nCredenciales de prueba (password entre parentesis):');
  USERS.forEach(user => console.log(`  ${user.role.padEnd(9)} ${user.email} (${user.password})`));

  await mongoose.disconnect();
};

seed().catch(async error => {
  console.error(`Error al cargar datos de prueba: ${error.message}`);
  await mongoose.disconnect();
  process.exit(1);
});

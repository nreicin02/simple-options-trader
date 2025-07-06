import env from '../config/env';

// Test setup file
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-secret';
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/simpli_options_test';
process.env['REDIS_URL'] = 'redis://localhost:6379'; 
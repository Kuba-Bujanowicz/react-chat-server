import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const mongoDbUrl = process.env.DB_CONNECT_URL;

if (mongoDbUrl) {
  mongoose.connect(mongoDbUrl);
}

const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

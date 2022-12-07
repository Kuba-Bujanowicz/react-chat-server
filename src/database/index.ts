import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const mongoDbUrl = process.env.DB_CONNECT_URL;

if (mongoDbUrl) {
  mongoose
    .connect(mongoDbUrl)
    .then(() => {
      console.log('Database Connected');
    })
    .catch((error) => {
      console.log(error);
    });
}

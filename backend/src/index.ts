import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'body-parser';
import { schema } from './graphql/schema';
import dicomRoutes from './routes/dicom';

const app = express();
const port = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({
    schema,
  });

  await server.start();

  // Configure CORS
  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  };

  // Apply global middleware
  app.use(cors(corsOptions));
  app.use(json({ limit: '50mb' }));
  
  // Mount DICOM routes before GraphQL
  app.use(dicomRoutes);
  
  // Mount GraphQL endpoint
  app.use('/graphql', expressMiddleware(server));

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
}); 
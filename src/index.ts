import * as dotenv from 'dotenv';
dotenv.config();

import {ApplicationConfig, CollectionCoreApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new CollectionCoreApplication(options);
  await app.boot();
  await app.migrateSchema();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,

      cors: {
        origin: (origin: string, callback: Function) => {
          const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);

          return callback(new Error("Not allowed by CORS: " + origin));
        },
        credentials: true,
      },

      gracePeriodForClose: 5000,
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}

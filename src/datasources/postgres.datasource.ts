import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
// Add import for pg-connection-string
import {parse as parseConnectionString} from 'pg-connection-string';

// Local database configuration
const localConfig = {
  name: 'postgres',
  connector: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'collection_local',
  username: 'postgres',
  password: 'admin',
  // No SSL needed for local
  max: 20,
  connectionTimeoutMillis: 30000
};

// Use DATABASE_URL from environment if available, otherwise use localConfig
const config = process.env.DATABASE_URL
  ? {
    ...parseConnectionString(process.env.DATABASE_URL),
    name: 'postgres',
    connector: 'postgresql',
    max: 20,
    connectionTimeoutMillis: 30000,
    // Optionally add ssl: { rejectUnauthorized: false } if needed for production
  }
  : localConfig;

// To switch configs: comment out the active config and uncomment the one you want to use.

@lifeCycleObserver('datasource')
export class PostgresDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'postgres';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.postgres', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);

    // Add connection error handler
    this.on('error', (err: Error) => {
      console.error('Database connection error:', err);
    });
  }
}

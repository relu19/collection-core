import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const sslMode = (process.env.ENVIRONMENT ?? 'local') !== 'local';


// Local
// const config = {
//   name: 'postgres',
//   connector: 'postgresql',
//   url: process.env.DATABASE_URL,
//   ssl: sslMode ? { rejectUnauthorized: false } : false,
//   connectionTimeoutMillis: 10000,  // Set the timeout to 10 seconds
//   statement_timeout: 30000,
// };

// Heroku
const config = {
  name: 'postgres',
  connector: 'postgresql',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 20000,
  statement_timeout: 30000,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
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
  }
}

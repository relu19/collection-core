import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import path from 'path';
import {MySequence} from './sequence';
import {JWTAuthenticationStrategy} from './authentication-strategies';
import {JWTService} from './services';

export {ApplicationConfig};

export class CollectionCoreApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Authentication component
    this.component(AuthenticationComponent);

    // JWT secret - in production, use environment variable
    this.bind('authentication.jwt.secret').to(
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    );
    this.bind('authentication.jwt.expiresIn').to(
      process.env.JWT_EXPIRES_IN || '7d',
    );

    // Bind JWT service
    this.bind('services.JWTService').toClass(JWTService);

    // Register authentication strategies
    registerAuthenticationStrategy(this as any, JWTAuthenticationStrategy);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }


  async migrateSchema(options?: SchemaMigrationOptions) {
    // 1. Run migration scripts provided by connectors
    await super.migrateSchema({
      existingSchema: 'alter',
      models: [
        'Numbers',
        'Set',
        'Users',
        'Category',
        'SetType',
        'SetUsers',
      ],
    });
  }
}

import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Users, UsersRelations} from '../models';

export class UsersRepository extends DefaultCrudRepository<Users,
  typeof Users.prototype.id,
  UsersRelations> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Users, dataSource);
  }

  async createGod() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.updateAll({type: process.env.REACT_APP_FACEBOOK_ADMIN_TYPE}, {fbId: process.env.REACT_APP_FACEBOOK_ADMIN_ID});
  }
}

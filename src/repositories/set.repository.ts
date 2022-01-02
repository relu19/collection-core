import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Set, SetRelations} from '../models';

export class SetRepository extends DefaultCrudRepository<
  Set,
  typeof Set.prototype.id,
  SetRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Set, dataSource);
  }
}

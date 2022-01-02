import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Numbers, NumbersRelations} from '../models';

export class NumbersRepository extends DefaultCrudRepository<
  Numbers,
  typeof Numbers.prototype.id,
  NumbersRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Numbers, dataSource);
  }
}

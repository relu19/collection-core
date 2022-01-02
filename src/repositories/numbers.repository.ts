import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Numbers, NumbersRelations, Set, Users} from '../models';
import {SetRepository} from './set.repository';
import {UsersRepository} from './users.repository';

export class NumbersRepository extends DefaultCrudRepository<
  Numbers,
  typeof Numbers.prototype.id,
  NumbersRelations
> {

  public readonly set: BelongsToAccessor<Set, typeof Numbers.prototype.id>;

  public readonly user: BelongsToAccessor<Users, typeof Numbers.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('SetRepository') protected setRepositoryGetter: Getter<SetRepository>, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Numbers, dataSource);
    this.user = this.createBelongsToAccessorFor('user', usersRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.set = this.createBelongsToAccessorFor('set', setRepositoryGetter,);
    this.registerInclusionResolver('set', this.set.inclusionResolver);
  }
}

import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {SetUsers, SetUsersRelations, SetType, Category, Users, Set} from '../models';
import {SetTypeRepository} from './set-type.repository';
import {CategoryRepository} from './category.repository';
import {UsersRepository} from './users.repository';
import {SetRepository} from './set.repository';

export class SetUsersRepository extends DefaultCrudRepository<
  SetUsers,
  typeof SetUsers.prototype.id,
  SetUsersRelations
> {

  public readonly setType: BelongsToAccessor<SetType, typeof SetUsers.prototype.id>;

  public readonly category: BelongsToAccessor<Category, typeof SetUsers.prototype.id>;

  public readonly users: BelongsToAccessor<Users, typeof SetUsers.prototype.id>;

  public readonly set: BelongsToAccessor<Set, typeof SetUsers.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('SetTypeRepository') protected setTypeRepositoryGetter: Getter<SetTypeRepository>, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>, @repository.getter('SetRepository') protected setRepositoryGetter: Getter<SetRepository>,
  ) {
    super(SetUsers, dataSource);
    this.set = this.createBelongsToAccessorFor('set', setRepositoryGetter,);
    this.registerInclusionResolver('set', this.set.inclusionResolver);
    this.users = this.createBelongsToAccessorFor('users', usersRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
    this.setType = this.createBelongsToAccessorFor('setType', setTypeRepositoryGetter,);
    this.registerInclusionResolver('setType', this.setType.inclusionResolver);
  }
}

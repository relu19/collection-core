import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Set, SetRelations, SetType, Category} from '../models';
import {SetTypeRepository} from './set-type.repository';
import {CategoryRepository} from './category.repository';

export class SetRepository extends DefaultCrudRepository<
  Set,
  typeof Set.prototype.id,
  SetRelations
> {

  public readonly setType: BelongsToAccessor<SetType, typeof Set.prototype.id>;

  public readonly category: BelongsToAccessor<Category, typeof Set.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('SetTypeRepository') protected setTypeRepositoryGetter: Getter<SetTypeRepository>, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Set, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
    this.setType = this.createBelongsToAccessorFor('setType', setTypeRepositoryGetter,);
    this.registerInclusionResolver('setType', this.setType.inclusionResolver);
  }
}

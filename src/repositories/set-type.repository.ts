import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {SetType, SetTypeRelations, Category} from '../models';
import {CategoryRepository} from './category.repository';

export class SetTypeRepository extends DefaultCrudRepository<
  SetType,
  typeof SetType.prototype.id,
  SetTypeRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof SetType.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(SetType, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}

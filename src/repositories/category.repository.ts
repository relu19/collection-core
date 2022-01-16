import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Category, CategoryRelations, Numbers} from '../models';
import {NumbersRepository} from './numbers.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly numbers: HasManyRepositoryFactory<Numbers, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('NumbersRepository') protected numbersRepositoryGetter: Getter<NumbersRepository>,
  ) {
    super(Category, dataSource);
    this.numbers = this.createHasManyRepositoryFactoryFor('numbers', numbersRepositoryGetter,);
    this.registerInclusionResolver('numbers', this.numbers.inclusionResolver);
  }
}

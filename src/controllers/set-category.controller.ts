import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Set,
  Category,
} from '../models';
import {SetRepository} from '../repositories';

export class SetCategoryController {
  constructor(
    @repository(SetRepository)
    public setRepository: SetRepository,
  ) { }

  @get('/sets/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Set',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.number('id') id: typeof Set.prototype.id,
  ): Promise<Category> {
    return this.setRepository.category(id);
  }
}

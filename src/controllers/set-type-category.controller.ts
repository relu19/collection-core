import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SetType,
  Category,
} from '../models';
import {SetTypeRepository} from '../repositories';

export class SetTypeCategoryController {
  constructor(
    @repository(SetTypeRepository)
    public setTypeRepository: SetTypeRepository,
  ) { }

  @get('/set-types/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to SetType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.number('id') id: typeof SetType.prototype.id,
  ): Promise<Category> {
    return this.setTypeRepository.category(id);
  }
}

import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SetUsers,
  Category,
} from '../models';
import {SetUsersRepository} from '../repositories';

export class SetUsersCategoryController {
  constructor(
    @repository(SetUsersRepository)
    public setUsersRepository: SetUsersRepository,
  ) { }

  @get('/set-users/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to SetUsers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.number('id') id: typeof SetUsers.prototype.id,
  ): Promise<Category> {
    return this.setUsersRepository.category(id);
  }
}

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
  Set,
} from '../models';
import {SetUsersRepository} from '../repositories';

export class SetUsersSetController {
  constructor(
    @repository(SetUsersRepository)
    public setUsersRepository: SetUsersRepository,
  ) { }

  @get('/set-users/{id}/set', {
    responses: {
      '200': {
        description: 'Set belonging to SetUsers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Set)},
          },
        },
      },
    },
  })
  async getSet(
    @param.path.number('id') id: typeof SetUsers.prototype.id,
  ): Promise<Set> {
    return this.setUsersRepository.set(id);
  }
}

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
  SetType,
} from '../models';
import {SetUsersRepository} from '../repositories';

export class SetUsersSetTypeController {
  constructor(
    @repository(SetUsersRepository)
    public setUsersRepository: SetUsersRepository,
  ) { }

  @get('/set-users/{id}/set-type', {
    responses: {
      '200': {
        description: 'SetType belonging to SetUsers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SetType)},
          },
        },
      },
    },
  })
  async getSetType(
    @param.path.number('id') id: typeof SetUsers.prototype.id,
  ): Promise<SetType> {
    return this.setUsersRepository.setType(id);
  }
}

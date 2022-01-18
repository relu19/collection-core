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
  Users,
} from '../models';
import {SetUsersRepository} from '../repositories';

export class SetUsersUsersController {
  constructor(
    @repository(SetUsersRepository)
    public setUsersRepository: SetUsersRepository,
  ) { }

  @get('/set-users/{id}/users', {
    responses: {
      '200': {
        description: 'Users belonging to SetUsers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Users)},
          },
        },
      },
    },
  })
  async getUsers(
    @param.path.number('id') id: typeof SetUsers.prototype.id,
  ): Promise<Users> {
    return this.setUsersRepository.users(id);
  }
}

import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Numbers,
  Users,
} from '../models';
import {NumbersRepository} from '../repositories';

export class NumbersUsersController {
  constructor(
    @repository(NumbersRepository)
    public numbersRepository: NumbersRepository,
  ) { }

  @get('/numbers/{id}/users', {
    responses: {
      '200': {
        description: 'Users belonging to Numbers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Users)},
          },
        },
      },
    },
  })
  async getUsers(
    @param.path.number('id') id: typeof Numbers.prototype.id,
  ): Promise<Users> {
    return this.numbersRepository.user(id);
  }
}

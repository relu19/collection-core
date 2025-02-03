import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Users} from '../models';
import {NumbersRepository, UsersRepository} from '../repositories';


export class UsersController {
  constructor(
    @repository(NumbersRepository) public numbersRepository: NumbersRepository,
    @repository(UsersRepository) public usersRepository: UsersRepository,
    ) {
  }

  @post('/remove-users')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async remove(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'RemoveUsers',
            exclude: ['id'],
          }),
        },
      },
    })
      users: Omit<Users, 'id'>,
  ): Promise<Users> {
    const existingUser = await this.usersRepository.findOne({
      where: {email: users.email},
    });
    if (existingUser) {
      await this.numbersRepository.deleteAll({
        userId: existingUser.id,
      });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.usersRepository.deleteById(existingUser.id);
  }


  @post('/users')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsers',
            exclude: ['id'],
          }),
        },
      },
    })
      users: Omit<Users, 'id'>,
  ): Promise<Users> {
    const existingUser = await this.usersRepository.findOne({
      where: {email: users.email},
    });
    if (!existingUser) {
      return this.usersRepository.create({...users});
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.usersRepository.updateById(existingUser.id, {name: users.name, email: users.email, phone: users.phone, logo: users.logo});
  }

  @get('/users/count')
  @response(200, {
    description: 'Users model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Users) filter?: Filter<Users>,
  ): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'Users PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
      users: Users,
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Users, {exclude: 'where'}) filter?: FilterExcludingWhere<Users>,
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'Users PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
      users: Users,
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'Users PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() users: Users,
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'Users DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usersRepository.deleteById(id);
  }
}

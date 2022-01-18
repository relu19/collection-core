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
import {SetUsers} from '../models';
import {SetUsersRepository} from '../repositories';

export class SetUserController {
  constructor(
    @repository(SetUsersRepository)
    public setUsersRepository : SetUsersRepository,
  ) {}

  @post('/set-users')
  @response(200, {
    description: 'SetUsers model instance',
    content: {'application/json': {schema: getModelSchemaRef(SetUsers)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetUsers, {
            title: 'NewSetUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    setUsers: Omit<SetUsers, 'id'>,
  ): Promise<SetUsers> {
    return this.setUsersRepository.create(setUsers);
  }

  @get('/set-users/count')
  @response(200, {
    description: 'SetUsers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SetUsers) where?: Where<SetUsers>,
  ): Promise<Count> {
    return this.setUsersRepository.count(where);
  }

  @get('/set-users')
  @response(200, {
    description: 'Array of SetUsers model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SetUsers, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SetUsers) filter?: Filter<SetUsers>,
  ): Promise<SetUsers[]> {
    return this.setUsersRepository.find(filter);
  }

  @patch('/set-users')
  @response(200, {
    description: 'SetUsers PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetUsers, {partial: true}),
        },
      },
    })
    setUsers: SetUsers,
    @param.where(SetUsers) where?: Where<SetUsers>,
  ): Promise<Count> {
    return this.setUsersRepository.updateAll(setUsers, where);
  }

  @get('/set-users/{id}')
  @response(200, {
    description: 'SetUsers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SetUsers, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SetUsers, {exclude: 'where'}) filter?: FilterExcludingWhere<SetUsers>
  ): Promise<SetUsers> {
    return this.setUsersRepository.findById(id, filter);
  }

  @patch('/set-users/{id}')
  @response(204, {
    description: 'SetUsers PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetUsers, {partial: true}),
        },
      },
    })
    setUsers: SetUsers,
  ): Promise<void> {
    await this.setUsersRepository.updateById(id, setUsers);
  }

  @put('/set-users/{id}')
  @response(204, {
    description: 'SetUsers PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() setUsers: SetUsers,
  ): Promise<void> {
    await this.setUsersRepository.replaceById(id, setUsers);
  }

  @del('/set-users/{id}')
  @response(204, {
    description: 'SetUsers DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.setUsersRepository.deleteById(id);
  }
}

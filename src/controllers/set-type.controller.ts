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
import {SetType} from '../models';
import {SetTypeRepository} from '../repositories';

export class SetTypeController {
  constructor(
    @repository(SetTypeRepository)
    public setTypeRepository : SetTypeRepository,
  ) {}

  @post('/set-types')
  @response(200, {
    description: 'SetType model instance',
    content: {'application/json': {schema: getModelSchemaRef(SetType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetType, {
            title: 'NewSetType',
            exclude: ['id'],
          }),
        },
      },
    })
    setType: Omit<SetType, 'id'>,
  ): Promise<SetType> {
    return this.setTypeRepository.create(setType);
  }

  @post('/remove-set-type')
  @response(200, {
    description: 'SetType model instance',
    content: {'application/json': {schema: getModelSchemaRef(SetType)}},
  })
  async deleteSetType(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetType, {
            title: 'DeleteSetType',
          }),
        },
      },
    })
      setType: SetType,
  ): Promise<void> {
    return this.setTypeRepository.deleteById(setType.id);
  }


  @get('/set-types/count')
  @response(200, {
    description: 'SetType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SetType) where?: Where<SetType>,
  ): Promise<Count> {
    return this.setTypeRepository.count(where);
  }

  @get('/set-types')
  @response(200, {
    description: 'Array of SetType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SetType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SetType) filter?: Filter<SetType>,
  ): Promise<SetType[]> {
    return this.setTypeRepository.find(filter);
  }

  @patch('/set-types')
  @response(200, {
    description: 'SetType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetType, {partial: true}),
        },
      },
    })
    setType: SetType,
    @param.where(SetType) where?: Where<SetType>,
  ): Promise<Count> {
    return this.setTypeRepository.updateAll(setType, where);
  }

  @get('/set-types/{id}')
  @response(200, {
    description: 'SetType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SetType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SetType, {exclude: 'where'}) filter?: FilterExcludingWhere<SetType>
  ): Promise<SetType> {
    return this.setTypeRepository.findById(id, filter);
  }

  @patch('/set-types/{id}')
  @response(204, {
    description: 'SetType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SetType, {partial: true}),
        },
      },
    })
    setType: SetType,
  ): Promise<void> {
    await this.setTypeRepository.updateById(id, setType);
  }

  @put('/set-types/{id}')
  @response(204, {
    description: 'SetType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() setType: SetType,
  ): Promise<void> {
    await this.setTypeRepository.replaceById(id, setType);
  }

  @del('/set-types/{id}')
  @response(204, {
    description: 'SetType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.setTypeRepository.deleteById(id);
  }
}

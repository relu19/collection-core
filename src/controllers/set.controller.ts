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
  HttpErrors,
} from '@loopback/rest';
import {Set} from '../models';
import {NumbersRepository, SetRepository} from '../repositories';

export class SetController {
  constructor(
    @repository(SetRepository) public setRepository: SetRepository,
    @repository(NumbersRepository) public numberRepository: NumbersRepository,
  ) {}

  @post('/sets')
  @response(200, {
    description: 'Set model instance',
    content: {'application/json': {schema: getModelSchemaRef(Set)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Set, {
            title: 'NewSet',

          }),
        },
      },
    })
    set: Set,
  ): Promise<{
    setData: object
  }> {
    const createdSet = await this.setRepository.create(set);

    // if (createdSet) {
    //   for (let i = createdSet.minNr; i <= createdSet.maxNr; i++) {
    //     await this.numberRepository.create({
    //       number: i,
    //       type: 0,
    //       setId: createdSet.id
    //     });
    //   }
    // }
    try {
      return {
        setData: createdSet
      };
    } catch (error) {
      throw new HttpErrors.ExpectationFailed('Something went wrong');
    }
  }

  @get('/sets/count')
  @response(200, {
    description: 'Set model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Set) where?: Where<Set>,
  ): Promise<Count> {
    return this.setRepository.count(where);
  }

  @get('/sets')
  @response(200, {
    description: 'Array of Set model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Set, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Set) filter?: Filter<Set>,
  ): Promise<Set[]> {
    return this.setRepository.find({...filter, order: ['id ASC']});
  }

  @patch('/sets')
  @response(200, {
    description: 'Set PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Set, {partial: true}),
        },
      },
    })
    set: Set,
    @param.where(Set) where?: Where<Set>,
  ): Promise<Count> {
    return this.setRepository.updateAll(set, where);
  }

  @get('/sets/{id}')
  @response(200, {
    description: 'Set model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Set, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Set, {exclude: 'where'}) filter?: FilterExcludingWhere<Set>
  ): Promise<Set> {
    return this.setRepository.findById(id, filter);
  }

  @patch('/sets/{id}')
  @response(204, {
    description: 'Set PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Set, {partial: true}),
        },
      },
    })
    set: Set,
  ): Promise<void> {
    await this.setRepository.updateById(id, set);
  }

  @put('/sets/{id}')
  @response(204, {
    description: 'Set PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() set: Set,
  ): Promise<void> {
    await this.setRepository.replaceById(id, set);
  }

  @del('/sets/{id}')
  @response(204, {
    description: 'Set DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.setRepository.deleteById(id);
  }
}

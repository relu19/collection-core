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
import {Numbers} from '../models';
import {NumbersRepository, UsersRepository} from '../repositories';

export class NumbersController {
  constructor(
    @repository(NumbersRepository) public numbersRepository: NumbersRepository,
    @repository(UsersRepository) public usersRepository: UsersRepository,
  ) {
  }

  @post('/numbers')
  @response(200, {
    description: 'Numbers model instance',
    content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Numbers, {
            title: 'NewNumbers',
            exclude: ['id'],
          }),
        },
      },
    })
      numbers: any,
  ): Promise<Numbers> {
    for (let i = numbers.minNr; i <= numbers.maxNr; i++) {
      await this.numbersRepository.create({
        number: i,
        type: 0,
        setId: numbers.setId,
        userId: numbers.userId
      });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return {};
  }


  @post('/remove-numbers')
  @response(200, {
    description: 'Numbers model instance',
    content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
  })
  async delete(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Numbers, {
            title: 'NewNumbers',
            exclude: ['id'],
          }),
        },
      },
    })
      numbers: any,
  ): Promise<Numbers> {
      await this.numbersRepository.deleteAll( {setId: numbers.setId, userId: numbers.userId})
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return {};
  }


  @get('/numbers/count')
  @response(200, {
    description: 'Numbers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Numbers) where?: Where<Numbers>,
  ): Promise<Count> {
    return this.numbersRepository.count(where);
  }

  @get('/numbers')
  @response(200, {
    description: 'Array of Numbers model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Numbers, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Numbers) filter?: Filter<Numbers>,
  ): Promise<Numbers[]> {
    return this.numbersRepository.find({...filter, order: ['id ASC']});
  }

  @patch('/numbers')
  @response(200, {
    description: 'Numbers PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Numbers, {partial: true}),
        },
      },
    })
      numbers: Numbers,
    @param.where(Numbers) where?: Where<Numbers>,
  ): Promise<Count> {
    return this.numbersRepository.updateAll(numbers, where);
  }

  @get('/numbers/{id}')
  @response(200, {
    description: 'Numbers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Numbers, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Numbers, {exclude: 'where'}) filter?: FilterExcludingWhere<Numbers>,
  ): Promise<Numbers> {
    return this.numbersRepository.findById(id, filter);
  }

  @patch('/numbers/{id}')
  @response(204, {
    description: 'Numbers PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Numbers, {partial: true}),
        },
      },
    })
      numbers: Numbers,
  ): Promise<void> {
    await this.numbersRepository.updateById(id, numbers);
  }

  @put('/numbers/{id}')
  @response(204, {
    description: 'Numbers PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() numbers: Numbers,
  ): Promise<void> {
    await this.numbersRepository.replaceById(id, numbers);
  }

  @del('/numbers/{id}')
  @response(204, {
    description: 'Numbers DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.numbersRepository.deleteById(id);
  }
}

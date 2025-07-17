import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Numbers, NumbersRelations} from '../models';
import {NumbersRepository, SetRepository, SetUsersRepository, UsersRepository} from '../repositories';

export class NumbersController {
  constructor(
    @repository(NumbersRepository) public numbersRepository: NumbersRepository,
    @repository(UsersRepository) public usersRepository: UsersRepository,
    @repository(SetRepository) public setRepository: SetRepository,
    @repository(SetUsersRepository) public setUsersRepository: SetUsersRepository,
  ) {
  }

  @post('/number')
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
    numbers: Omit<Numbers, 'id'>,
  ): Promise<(Numbers & NumbersRelations)[]> {
    await this.numbersRepository.create(numbers);
    return this.numbersRepository.find({where: {userId: numbers.userId, setId: numbers.setId}});
  }

  @patch('/number/{id}')
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
  ): Promise<(Numbers & NumbersRelations)[]> {
    await this.numbersRepository.updateById(id, numbers);
    return this.numbersRepository.find({where: {userId: numbers.userId, setId: numbers.setId}});
  }

  @post('/remove-number')
  @response(200, {
    description: 'Numbers model instance',
    content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
  })
  async deleteNumber(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Numbers, {
            title: 'RemoveNumbers',
          }),
        },
      },
    })
    numbers: Numbers,
  ): Promise<(Numbers & NumbersRelations)[]> {
    await this.numbersRepository.deleteById(numbers.id);
    return this.numbersRepository.find({where: {userId: numbers.userId, setId: numbers.setId}});
  }

  @post('/remove-set-from-collection')
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
    numbers: Omit<Numbers, 'id'>,
  ): Promise<Count> {
    await this.setUsersRepository.deleteAll({setId: numbers.setId, usersId: numbers.userId});
    return this.numbersRepository.deleteAll({setId: numbers.setId, userId: numbers.userId});
  }

  @post('/add-all-numbers')
  @response(200, {
    description: 'Numbers model instance',
    content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
  })
  async createAll(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              numbers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    number: {type: 'string'},
                    extra: {type: 'boolean'},
                    desc: {type: 'string'}
                  },
                  required: ['number', 'extra']
                }
              },
              type: {type: 'number'},
              setId: {type: 'number'},
              userId: {type: 'number'}
            },
            required: ['numbers', 'type', 'setId', 'userId']
          }
        },
      },
    })
    payload: {
      numbers: {number: string; extra: boolean; desc?: string}[];
      type: number;
      setId: number;
      userId: number;
    },
  ): Promise<(Numbers & NumbersRelations)[]> {
    // Find all existing numbers for this set/user
    const existingNumbers = await this.numbersRepository.find({
      where: {setId: payload.setId, userId: payload.userId}
    });
    // Always compare numbers as strings, skip if n.number is undefined
    const existingNumbersMap = new Map(existingNumbers.filter(n => n.number !== undefined).map(n => [n.number!.toString(), n]));

    for (const numObj of payload.numbers) {
      const {number, extra, desc} = numObj;
      const key = number.toString();
      if (existingNumbersMap.has(key)) {
        const existing = existingNumbersMap.get(key);
        // Always update type, even if it's the same
        if (existing) {
          await this.numbersRepository.updateById(existing.id, {type: payload.type});
        }
      } else {
        // Create new number
        await this.numbersRepository.create({
          number: key,
          type: payload.type,
          setId: payload.setId,
          userId: payload.userId,
          extra: extra,
          desc: desc
        });
      }
    }

    return this.numbersRepository.find({where: {userId: payload.userId, setId: payload.setId}});
  }

  @post('/remove-all-numbers')
  @response(200, {
    description: 'Numbers model instance',
    content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
  })
  async deleteAll(
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
    numbers: Omit<Numbers, 'id'>,
  ): Promise<(Numbers & NumbersRelations)[]> {
    await this.numbersRepository.deleteAll({setId: numbers.setId, userId: numbers.userId});
    return this.numbersRepository.find({where: {userId: numbers.userId, setId: numbers.setId}});
  }

  @post('/remove-set')
  @response(200, {
    description: 'Set model instance',
    content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
  })
  async deleteSetWithNumbers(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Numbers, {
            title: 'NewSet',

          }),
        },
      },
    })
    numbers: any,
  ): Promise<(Numbers & NumbersRelations)[]> {
    await this.numbersRepository.deleteAll({setId: numbers.id});
    await this.setUsersRepository.deleteAll({setId: numbers.id, usersId: numbers.userId});
    await this.setRepository.deleteAll({id: numbers.id});
    return this.numbersRepository.find({where: {userId: numbers.userId, setId: numbers.setId}});
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

  @post('/remove-extra-numbers')
  @response(200, {
    description: 'Remove all extra numbers for a set',
    content: {'application/json': {schema: {type: 'object', properties: {count: {type: 'number'}}}}},
  })
  async deleteExtraNumbers(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              setId: {type: 'number'},
            },
            required: ['setId'],
          },
        },
      },
    })
    payload: {setId: number},
  ): Promise<{count: number}> {
    const result = await this.numbersRepository.deleteAll({setId: payload.setId, extra: true});
    // Also clear extraNumbers field in the set
    await this.setRepository.updateById(payload.setId, {extraNumbers: ''});
    return {count: result.count};
  }
}

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
import {NumbersRepository, SetRepository, SetTypeRepository, SetUsersRepository, UsersRepository} from '../repositories';

export class NumbersController {
  constructor(
    @repository(NumbersRepository) public numbersRepository: NumbersRepository,
    @repository(UsersRepository) public usersRepository: UsersRepository,
    @repository(SetRepository) public setRepository: SetRepository,
    @repository(SetUsersRepository) public setUsersRepository: SetUsersRepository,
    @repository(SetTypeRepository) public setTypeRepository: SetTypeRepository,
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

  @post('/remove-multiple-numbers')
  @response(200, {
    description: 'Remove multiple numbers',
    content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
  })
  async deleteMultipleNumbers(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              setId: {type: 'number'},
              userId: {type: 'number'},
              numbers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {type: 'number'},
                    number: {type: 'string'}
                  }
                }
              }
            },
            required: ['setId', 'userId', 'numbers']
          }
        },
      },
    })
    payload: {
      setId: number;
      userId: number;
      numbers: {id: number; number: string}[];
    },
  ): Promise<(Numbers & NumbersRelations)[]> {
    // Delete multiple numbers by their IDs
    for (const num of payload.numbers) {
      await this.numbersRepository.deleteById(num.id);
    }
    return this.numbersRepository.find({where: {userId: payload.userId, setId: payload.setId}});
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

  @post('/add-numbers-preserve-status')
  @response(200, {
    description: 'Add numbers while preserving existing status',
    content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
  })
  async addNumbersPreserveStatus(
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
              setId: {type: 'number'},
              userId: {type: 'number'}
            },
            required: ['numbers', 'setId', 'userId']
          }
        },
      },
    })
    payload: {
      numbers: {number: string; extra: boolean; desc?: string}[];
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
        // Skip existing numbers - preserve their status
        continue;
      } else {
        // Create new number with default type 0 (missing)
        await this.numbersRepository.create({
          number: key,
          type: 0, // Default to missing
          setId: payload.setId,
          userId: payload.userId,
          extra: extra,
          desc: desc
        });
      }
    }

    return this.numbersRepository.find({where: {userId: payload.userId, setId: payload.setId}});
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

  @post('/global-exchanges')
  @response(200, {
    description: 'Get global exchanges for a user',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            exchanges: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: {type: 'number'},
                  userName: {type: 'string'},
                  userEmail: {type: 'string'},
                  userLogo: {type: 'string'},
                  exchanges: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        setId: {type: 'number'},
                        setName: {type: 'string'},
                        user1CanGive: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              number: {type: 'string'},
                              extra: {type: 'boolean'},
                              desc: {type: 'string'}
                            }
                          }
                        },
                        user2CanGive: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              number: {type: 'string'},
                              extra: {type: 'boolean'},
                              desc: {type: 'string'}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async getGlobalExchanges(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userId: {type: 'number'},
            },
            required: ['userId'],
          },
        },
      },
    })
    payload: {userId: number},
  ): Promise<{
    exchanges: Array<{
      userId: number;
      userName: string;
      userEmail: string;
      userLogo: string;
      exchanges: Array<{
        setId: number;
        setName: string;
        user1CanGive: Array<{number: string; extra: boolean; desc?: string}>;
        user2CanGive: Array<{number: string; extra: boolean; desc?: string}>;
      }>;
    }>;
  }> {
    try {
      // Get all users
      const allUsers = await this.usersRepository.find();

      // Get all sets
      const allSets = await this.setRepository.find();

      // Get all set types
      const allSetTypes = await this.setTypeRepository.find();

      // Get all set-user relationships
      const allSetUsers = await this.setUsersRepository.find();

      // Get all numbers for all users and sets
      const allNumbers = await this.numbersRepository.find();

      // Group numbers by user and set
      const numbersByUserAndSet = new Map<string, Numbers[]>();
      allNumbers.forEach(num => {
        const key = `${num.userId}-${num.setId}`;
        if (!numbersByUserAndSet.has(key)) {
          numbersByUserAndSet.set(key, []);
        }
        numbersByUserAndSet.get(key)!.push(num);
      });

      // Find users who have sets in common with the current user
      const currentUserSets = allSetUsers.filter(su => su.usersId === payload.userId);
      const currentUserSetIds = currentUserSets.map(su => su.setId);

      const exchanges: Array<{
        userId: number;
        userName: string;
        userEmail: string;
        userLogo: string;
        exchanges: Array<{
          setId: number;
          setName: string;
          user1CanGive: Array<{number: string; extra: boolean; desc?: string}>;
          user2CanGive: Array<{number: string; extra: boolean; desc?: string}>;
        }>;
      }> = [];

      // Check each user for potential exchanges
      for (const user of allUsers) {
        if (user.id === payload.userId) continue; // Skip current user

        const userSets = allSetUsers.filter(su => su.usersId === user.id);
        const userSetIds = userSets.map(su => su.setId);

        // Find common sets between current user and this user
        const commonSetIds = currentUserSetIds.filter(setId => userSetIds.includes(setId));

        if (commonSetIds.length === 0) continue; // No common sets

        const userExchanges: Array<{
          setId: number;
          setName: string;
          user1CanGive: Array<{number: string; extra: boolean; desc?: string}>;
          user2CanGive: Array<{number: string; extra: boolean; desc?: string}>;
        }> = [];

        // Check each common set for exchanges
        for (const setId of commonSetIds) {
          const currentUserNumbers = numbersByUserAndSet.get(`${payload.userId}-${setId}`) || [];
          const otherUserNumbers = numbersByUserAndSet.get(`${user.id}-${setId}`) || [];

          if (currentUserNumbers.length === 0 || otherUserNumbers.length === 0) continue;

          // Apply exchange logic
          // Type 0 OR Type 3 = "I need this number" (both are needed)
          // Type 2 = "I have this for exchange" (only type 2 is exchangeable)
          const currentUserExchange = currentUserNumbers.filter(n => n.type === 2);
          const currentUserNeed = currentUserNumbers.filter(n => n.type === 0 || n.type === 3);
          const otherUserExchange = otherUserNumbers.filter(n => n.type === 2);
          const otherUserNeed = otherUserNumbers.filter(n => n.type === 0 || n.type === 3);

          // Find matches - must match both number AND extra flag (handle null/undefined extra values)
          const currentUserCanGive = currentUserExchange.filter(num =>
            otherUserNeed.some(n => n.number === num.number &&
              ((num.extra === true && n.extra === true) || (num.extra !== true && n.extra !== true)))
          );
          const otherUserCanGive = otherUserExchange.filter(num =>
            currentUserNeed.some(n => n.number === num.number &&
              ((num.extra === true && n.extra === true) || (num.extra !== true && n.extra !== true)))
          );



          if (currentUserCanGive.length > 0 || otherUserCanGive.length > 0) {
            const set = allSets.find(s => s.id === setId);
            userExchanges.push({
              setId: setId,
              setName: set?.name || '',
              user1CanGive: currentUserCanGive.map(n => ({
                number: n.number || '',
                extra: n.extra || false,
                desc: n.desc || ''
              })),
              user2CanGive: otherUserCanGive.map(n => ({
                number: n.number || '',
                extra: n.extra || false,
                desc: n.desc || ''
              }))
            });
          }
        }

        if (userExchanges.length > 0) {
          // Remove duplicates based on setId
          const uniqueExchanges = userExchanges.filter((exchange, index, self) =>
            index === self.findIndex(e => e.setId === exchange.setId)
          );

          // Sort exchanges by setType order first, then by set order
          const sortedExchanges = uniqueExchanges.sort((a, b) => {
            const setA = allSets.find(s => s.id === a.setId);
            const setB = allSets.find(s => s.id === b.setId);

            const setTypeA = allSetTypes.find(st => st.id === setA?.setTypeId);
            const setTypeB = allSetTypes.find(st => st.id === setB?.setTypeId);

            // First sort by setType order
            const setTypeOrderDiff = (setTypeA?.order || 0) - (setTypeB?.order || 0);
            if (setTypeOrderDiff !== 0) {
              return setTypeOrderDiff;
            }

            // If same setType, sort by set order
            return (setA?.order || 0) - (setB?.order || 0);
          });

          exchanges.push({
            userId: user.id || 0,
            userName: user.name || '',
            userEmail: user.email || '',
            userLogo: user.logo || '',
            exchanges: sortedExchanges
          });
        }
      }

      return {exchanges};
    } catch (error) {
      console.error('Error getting global exchanges:', error);
      return {exchanges: []};
    }
  }

  @post('/set-exchanges')
  @response(200, {
    description: 'Get exchanges for a specific set between users',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            exchanges: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: {type: 'number'},
                  userName: {type: 'string'},
                  userEmail: {type: 'string'},
                  userLogo: {type: 'string'},
                  exchanges: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        setId: {type: 'number'},
                        setName: {type: 'string'},
                        user1CanGive: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              number: {type: 'string'},
                              extra: {type: 'boolean'},
                              desc: {type: 'string'}
                            }
                          }
                        },
                        user2CanGive: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              number: {type: 'string'},
                              extra: {type: 'boolean'},
                              desc: {type: 'string'}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async getSetExchanges(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              setId: {type: 'number'},
              userId: {type: 'number'},
            },
            required: ['setId', 'userId'],
          },
        },
      },
    })
    payload: {setId: number; userId: number},
  ): Promise<{
    exchanges: Array<{
      userId: number;
      userName: string;
      userEmail: string;
      userLogo: string;
      exchanges: Array<{
        setId: number;
        setName: string;
        user1CanGive: Array<{number: string; extra: boolean; desc?: string}>;
        user2CanGive: Array<{number: string; extra: boolean; desc?: string}>;
      }>;
    }>;
  }> {
    try {
      // Get the specific set
      const set = await this.setRepository.findById(payload.setId);
      if (!set) {
        return {exchanges: []};
      }

      // Get all users who have this set in their collection
      const setUsers = await this.setUsersRepository.find({
        where: {
          setId: payload.setId,
          categoryId: set.categoryId,
          setTypeId: set.setTypeId,
        }
      });

      if (setUsers.length === 0) {
        return {exchanges: []};
      }

      // Get user details for users who have the set
      const userIdsWithSet = setUsers.map(su => su.usersId).filter((id): id is number => id !== undefined);
      const usersWithSet = await this.usersRepository.find({
        where: {
          id: {inq: userIdsWithSet}
        }
      });

      // Filter out current user
      const otherUsers = usersWithSet.filter(user => user.id !== payload.userId);

      // Get all numbers for this set
      const otherUserIds = otherUsers.map(u => u.id).filter((id): id is number => id !== undefined);
      const allNumbersForSet = await this.numbersRepository.find({
        where: {
          setId: payload.setId,
          userId: {inq: [payload.userId, ...otherUserIds]}
        }
      });

      // Group numbers by user
      const numbersByUser = new Map<number, Numbers[]>();
      allNumbersForSet.forEach(num => {
        if (!numbersByUser.has(num.userId)) {
          numbersByUser.set(num.userId, []);
        }
        numbersByUser.get(num.userId)!.push(num);
      });

      const exchanges: Array<{
        userId: number;
        userName: string;
        userEmail: string;
        userLogo: string;
        exchanges: Array<{
          setId: number;
          setName: string;
          user1CanGive: Array<{number: string; extra: boolean; desc?: string}>;
          user2CanGive: Array<{number: string; extra: boolean; desc?: string}>;
        }>;
      }> = [];

      // Check each user for potential exchanges
      for (const user of otherUsers) {
        if (!user.id) continue; // Skip users without valid ID
        const currentUserNumbers = numbersByUser.get(payload.userId) || [];
        const otherUserNumbers = numbersByUser.get(user.id) || [];

        if (currentUserNumbers.length === 0 || otherUserNumbers.length === 0) continue;

        // Apply exchange logic
        // Type 0 OR Type 3 = "I need this number" (both are needed)
        // Type 2 = "I have this for exchange" (only type 2 is exchangeable)
        const currentUserExchange = currentUserNumbers.filter(n => n.type === 2);
        const currentUserNeed = currentUserNumbers.filter(n => n.type === 0 || n.type === 3);
        const otherUserExchange = otherUserNumbers.filter(n => n.type === 2);
        const otherUserNeed = otherUserNumbers.filter(n => n.type === 0 || n.type === 3);

        // Find matches - must match both number AND extra flag (handle null/undefined extra values)
        const currentUserCanGive = currentUserExchange.filter(num =>
          otherUserNeed.some(n => n.number === num.number &&
            ((num.extra === true && n.extra === true) || (num.extra !== true && n.extra !== true)))
        );
        const otherUserCanGive = otherUserExchange.filter(num =>
          currentUserNeed.some(n => n.number === num.number &&
            ((num.extra === true && n.extra === true) || (num.extra !== true && n.extra !== true)))
        );



        if (currentUserCanGive.length > 0 || otherUserCanGive.length > 0) {
          exchanges.push({
            userId: user.id ?? 0,
            userName: user.name || '',
            userEmail: user.email || '',
            userLogo: user.logo || '',
            exchanges: [{
              setId: payload.setId,
              setName: set.name || '',
              user1CanGive: currentUserCanGive.map(n => ({
                number: n.number || '',
                extra: n.extra || false,
                desc: n.desc || ''
              })),
              user2CanGive: otherUserCanGive.map(n => ({
                number: n.number || '',
                extra: n.extra || false,
                desc: n.desc || ''
              }))
            }]
          });
        }
      }

      return {exchanges};
    } catch (error) {
      console.error('Error getting set exchanges:', error);
      return {exchanges: []};
    }
  }
}

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
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Users} from '../models';
import {NumbersRepository, UsersRepository} from '../repositories';


export class UsersController {
  constructor(
    @repository(NumbersRepository) public numbersRepository: NumbersRepository,
    @repository(UsersRepository) public usersRepository: UsersRepository,
    @inject(SecurityBindings.USER, {optional: true})
    public currentUserProfile: UserProfile,
    ) {
  }

  @authenticate('jwt')
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
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Users> {
    const existingUser = await this.usersRepository.findOne({
      where: {email: users.email},
    });

    if (!existingUser) {
      throw new HttpErrors.NotFound('User not found');
    }

    // Users can only delete their own account
    if (existingUser.id?.toString() !== currentUserProfile.id) {
      throw new HttpErrors.Forbidden('You can only delete your own account');
    }

    await this.numbersRepository.deleteAll({
      userId: existingUser.id,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.usersRepository.deleteById(existingUser.id);
  }


  @authenticate('jwt')
  @post('/users')
  @response(200, {
    description: 'Users model instance - Update current user profile',
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
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Users> {
    // Users can only update their own profile
    const userId = parseInt(currentUserProfile.id);
    const existingUser = await this.usersRepository.findById(userId);

    if (!existingUser) {
      throw new HttpErrors.NotFound('User not found');
    }

    // Update only allowed fields
    await this.usersRepository.updateById(userId, {
      name: users.name,
      phone: users.phone,
      logo: users.logo,
      username: users.username,
      contactEmail: users.contactEmail,
    });

    return this.usersRepository.findById(userId);
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

  @authenticate('jwt')
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
    @inject(SecurityBindings.USER, {optional: true})
    currentUserProfile?: UserProfile,
  ): Promise<Count> {
    // Only allow updating own user
    const userId = parseInt(currentUserProfile!.id);
    return this.usersRepository.updateAll(users, {id: userId});
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

  @authenticate('jwt')
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
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // Users can only update their own profile
    if (id.toString() !== currentUserProfile.id) {
      throw new HttpErrors.Forbidden('You can only update your own profile');
    }
    await this.usersRepository.updateById(id, users);
  }

  @authenticate('jwt')
  @put('/users/{id}')
  @response(204, {
    description: 'Users PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() users: Users,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // Users can only replace their own profile
    if (id.toString() !== currentUserProfile.id) {
      throw new HttpErrors.Forbidden('You can only update your own profile');
    }
    await this.usersRepository.replaceById(id, users);
  }

  @authenticate('jwt')
  @del('/users/{id}')
  @response(204, {
    description: 'Users DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // Users can only delete their own account
    if (id.toString() !== currentUserProfile.id) {
      throw new HttpErrors.Forbidden('You can only delete your own account');
    }
    await this.usersRepository.deleteById(id);
  }
}

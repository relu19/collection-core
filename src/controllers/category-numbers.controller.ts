import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Category,
  Numbers,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryNumbersController {
  constructor(
    @repository(CategoryRepository) protected categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/numbers', {
    responses: {
      '200': {
        description: 'Array of Category has many Numbers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Numbers)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Numbers>,
  ): Promise<Numbers[]> {
    return this.categoryRepository.numbers(id).find(filter);
  }

  @post('/categories/{id}/numbers', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Numbers)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Category.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Numbers, {
            title: 'NewNumbersInCategory',
            exclude: ['id'],
            optional: ['categoryId']
          }),
        },
      },
    }) numbers: Omit<Numbers, 'id'>,
  ): Promise<Numbers> {
    return this.categoryRepository.numbers(id).create(numbers);
  }

  @patch('/categories/{id}/numbers', {
    responses: {
      '200': {
        description: 'Category.Numbers PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Numbers, {partial: true}),
        },
      },
    })
    numbers: Partial<Numbers>,
    @param.query.object('where', getWhereSchemaFor(Numbers)) where?: Where<Numbers>,
  ): Promise<Count> {
    return this.categoryRepository.numbers(id).patch(numbers, where);
  }

  @del('/categories/{id}/numbers', {
    responses: {
      '200': {
        description: 'Category.Numbers DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Numbers)) where?: Where<Numbers>,
  ): Promise<Count> {
    return this.categoryRepository.numbers(id).delete(where);
  }
}

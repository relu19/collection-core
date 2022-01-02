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
  Set,
} from '../models';
import {NumbersRepository} from '../repositories';

export class NumbersSetController {
  constructor(
    @repository(NumbersRepository)
    public numbersRepository: NumbersRepository,
  ) { }

  @get('/numbers/{id}/set', {
    responses: {
      '200': {
        description: 'Set belonging to Numbers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Set)},
          },
        },
      },
    },
  })
  async getSet(
    @param.path.number('id') id: typeof Numbers.prototype.id,
  ): Promise<Set> {
    return this.numbersRepository.set(id);
  }
}

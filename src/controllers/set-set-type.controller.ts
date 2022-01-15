import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Set,
  SetType,
} from '../models';
import {SetRepository} from '../repositories';

export class SetSetTypeController {
  constructor(
    @repository(SetRepository)
    public setRepository: SetRepository,
  ) { }

  @get('/sets/{id}/set-type', {
    responses: {
      '200': {
        description: 'SetType belonging to Set',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SetType)},
          },
        },
      },
    },
  })
  async getSetType(
    @param.path.number('id') id: typeof Set.prototype.id,
  ): Promise<SetType> {
    return this.setRepository.setType(id);
  }
}

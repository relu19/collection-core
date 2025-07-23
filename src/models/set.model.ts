import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Category} from './category.model';
import {SetType} from './set-type.model';

@model()
export class Set extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  minNr: number;

  @property({
    type: 'number',
    required: true,
  })
  maxNr: number;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'string',
  })
  link?: string;

  @property({
    type: 'number',
  })
  order?: number;

  @property({
    type: 'string',
  })
  group?: string;

  @property({
    type: 'string',
  })
  extraNumbers?: string;

  @property({
    type: 'string',
  })
  extraNumbersTitle?: string;

  @belongsTo(() => SetType)
  setTypeId: number;

  @belongsTo(() => Category)
  categoryId: number;

  constructor(data?: Partial<Set>) {
    super(data);
  }
}

export interface SetRelations {
  // describe navigational properties here
}

export type SetWithRelations = Set & SetRelations;

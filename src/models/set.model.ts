import {Entity, model, property, belongsTo} from '@loopback/repository';
import {SetType} from './set-type.model';
import {Category} from './category.model';

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

import {Entity, model, property} from '@loopback/repository';

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
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

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


  constructor(data?: Partial<Set>) {
    super(data);
  }
}

export interface SetRelations {
  // describe navigational properties here
}

export type SetWithRelations = Set & SetRelations;

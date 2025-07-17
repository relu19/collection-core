import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Set} from './set.model';
import {Users} from './users.model';

@model()
export class Numbers extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  number?: string;

  @property({
    type: 'number',
  })
  type?: number;

  @property({
    type: 'string',
  })
  desc?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  extra?: boolean;

  @belongsTo(() => Set)
  setId: number;

  @belongsTo(() => Users)
  userId: number;

  constructor(data?: Partial<Numbers>) {
    super(data);
  }
}

export interface NumbersRelations {
  // describe navigational properties here
}

export type NumbersWithRelations = Numbers & NumbersRelations;

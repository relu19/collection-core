import {Entity, model, property, belongsTo} from '@loopback/repository';
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
    type: 'number',
  })
  number?: number;

  @property({
    type: 'number',
  })
  type?: number;

  @belongsTo(() => Set)
  setId: number;

  @belongsTo(() => Users)
  userId: number;

  @property({
    type: 'number',
  })
  categoryId?: number;

  constructor(data?: Partial<Numbers>) {
    super(data);
  }
}

export interface NumbersRelations {
  // describe navigational properties here
}

export type NumbersWithRelations = Numbers & NumbersRelations;

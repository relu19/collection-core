import {Entity, model, property} from '@loopback/repository';

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
    required: true,
  })
  number: number;

  @property({
    type: 'number',
    required: true,
  })
  type: number;


  constructor(data?: Partial<Numbers>) {
    super(data);
  }
}

export interface NumbersRelations {
  // describe navigational properties here
}

export type NumbersWithRelations = Numbers & NumbersRelations;

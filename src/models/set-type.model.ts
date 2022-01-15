import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Category} from './category.model';

@model()
export class SetType extends Entity {
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
    type: 'string',
  })
  icon?: string;

  @property({
    type: 'number',
  })
  order?: number;

  @belongsTo(() => Category)
  categoryId: number;

  constructor(data?: Partial<SetType>) {
    super(data);
  }
}

export interface SetTypeRelations {
  // describe navigational properties here
}

export type SetTypeWithRelations = SetType & SetTypeRelations;

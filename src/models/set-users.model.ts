import {Entity, model, property, belongsTo} from '@loopback/repository';
import {SetType} from './set-type.model';
import {Category} from './category.model';
import {Users} from './users.model';
import {Set} from './set.model';

@model()
export class SetUsers extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => SetType)
  setTypeId: number;

  @belongsTo(() => Category)
  categoryId: number;

  @belongsTo(() => Users)
  usersId: number;

  @belongsTo(() => Set)
  setId: number;

  constructor(data?: Partial<SetUsers>) {
    super(data);
  }
}

export interface SetUsersRelations {
  // describe navigational properties here
}

export type SetUsersWithRelations = SetUsers & SetUsersRelations;

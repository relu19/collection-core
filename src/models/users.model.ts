import {Entity, model, property} from '@loopback/repository';

@model()
export class Users extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    default: '', // default value to avoid undefined if no value is provided
  })
  email?: string;

  @property({
    type: 'string',
    default: '', // default value to avoid undefined if no value is provided
  })
  phone?: string;

  @property({
    type: 'string',
    default: '', // default value to avoid undefined if no value is provided
  })
  logo?: string;

  @property({
    type: 'string',
    default: '', // default value to avoid undefined if no value is provided
  })
  username?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  type: number;

  @property({
    type: 'string',
    required: false,
  })
  contactEmail: string;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;

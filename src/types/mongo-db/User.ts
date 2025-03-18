import { ObjectId } from 'mongodb';
import { User } from '@/types/user';
import { Address } from 'intuit-oauth';

export interface DBUser extends Omit<User, 'id'> {
  _id?: ObjectId | string;
  address?: Address;
  phoneNumber?: string;
  companyName?: string;
  password: string;
  lastLogin?: Date;
}

export interface CreateDBUser extends Omit<DBUser, '_id' | 'lastLogin'> {
  lastLogin?: Date;
} 
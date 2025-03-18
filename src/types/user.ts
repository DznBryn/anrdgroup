import { Address } from 'intuit-oauth';

export type AccountType = 'tenant' | 'landlord' | 'manager' | 'admin';

export interface User {
  id: string;
  intuitCustomerId: string;
  address?: Address;
  firstName: string;
  lastName: string;
  email: string;
  accountType: AccountType;
  properties?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  intuitCustomerId: string;
  address?: Address;
  firstName: string;
  lastName: string;
  email: string;
  accountType: AccountType;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
} 
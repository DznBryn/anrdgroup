import { User } from '@/types/user';

export const users: User[] = [
  {
    id: '123',
    intuitCustomerId: '1',
    firstName: "Amy",
    lastName: "Lauterbach",
    email: "Birds@Intuit.com",
    accountType: 'tenant',
    address: {
      Id: '2',
      Line1: "4581 Finch St.",
      City: 'Bayshore',
      PostalCode: "94326",
      CountrySubDivisionCode: "CA"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    intuitCustomerId: '456',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    accountType: 'landlord',
    address: {
      Id: '2',
      Line1: '456 Market St',
      City: 'San Francisco',
      PostalCode: '94105',
      CountrySubDivisionCode: 'CA'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]; 
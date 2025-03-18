import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, updateUser } from '@/utils/api/mongodb';
import { CreateDBUser, DBUser } from '@/types/mongo-db/User';
import { Customer, QuickBooksResponse, Vendor } from 'intuit-oauth';
import { getCustomers, createCustomer, getVendors, createVendor } from '@/utils/api/quickbooks';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const cookieStore = await cookies();
    const tokens = {
      access_token: cookieStore.get('qb_access_token')?.value,
      refresh_token: cookieStore.get('qb_refresh_token')?.value
    };

    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(userData.email) as DBUser;
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered'
        },
      );
    }
    
    const newUser: CreateDBUser = {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber || null,
      companyName: userData.companyName || null,
      accountType: userData.accountType || 'tenant',
      intuitCustomerId: userData.intuitCustomerId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };


    if (newUser.intuitCustomerId.length === 0 && newUser.accountType !== 'manager') {
      if( newUser.accountType === 'tenant') {
        const customers = await getCustomers(tokens.access_token!, tokens.refresh_token!) as Customer[];

        const customer = customers.find((c: Customer) => c?.PrimaryEmailAddr?.Address?.toLowerCase() === `${newUser.email}`.toLowerCase());
        if (customer && customer.Id) {
          newUser.intuitCustomerId = customer.Id;
        } else {
          const initCustomer: Customer = {
            FullyQualifiedName: `${newUser.firstName} ${newUser.lastName}`,
            PrimaryEmailAddr: {
              Address: newUser.email
            },
            DisplayName: `${newUser.firstName} ${newUser.lastName}`,
            Suffix: "",
            Title: "",
            MiddleName: "",
            Notes: "",
            FamilyName: "",
            PrimaryPhone: {
              FreeFormNumber: ''
            },
            CompanyName: "",
            // TODO: Add bill address from properties
            BillAddr: {
              CountrySubDivisionCode: "",
              City: "",
              PostalCode: "",
              Line1: "",
            },
            GivenName: newUser.firstName
          }
          const customer = await createCustomer(tokens.access_token!, tokens.refresh_token!, initCustomer) as QuickBooksResponse<Customer>;
          const { Customer: { Id } } = customer as unknown as { Customer: { Id: string } };
          console.log('Created customer', customer)
          const existingUser = await findUserByEmail(newUser.email) as DBUser;

          if (existingUser && existingUser._id) {
            await updateUser(existingUser._id.toString(), { intuitCustomerId: Id });
          }
          newUser.intuitCustomerId = Id;
        }
      }

      if(newUser.accountType === 'landlord') {
        const vendors = await getVendors(tokens.access_token!, tokens.refresh_token!) as Vendor[];
        const vendor = vendors.find((v: Vendor) => v.PrimaryEmailAddr?.Address.toLowerCase() === `${newUser.email}`.toLowerCase());
        if (vendor && vendor.Id) {
          newUser.intuitCustomerId = vendor.Id;
        } else {
          const initVendor: Vendor = {
            PrimaryEmailAddr: {
              Address: newUser.email
            },
            GivenName: newUser.firstName ?? "",
            DisplayName: newUser.companyName ?? `${newUser.firstName} ${newUser.lastName}`,
            CompanyName: newUser.companyName ?? "",
            FamilyName: newUser.lastName ?? "",
            PrimaryPhone: {
              FreeFormNumber: newUser.phoneNumber ?? ""
            },
            PrintOnCheckName: newUser.companyName ?? `${newUser.firstName} ${newUser.lastName}`,
            BillAddr: {
              CountrySubDivisionCode: "",
              City: "",
              PostalCode: "",
              Line1: "",
            }, 
          }
          const vendor = await createVendor(tokens.access_token!, tokens.refresh_token!, initVendor) as QuickBooksResponse<Vendor>;
          const { Vendor: { Id } } = vendor as unknown as { Vendor: { Id: string } };
          console.log('Created vendor', vendor)
          const existingUser = await findUserByEmail(newUser.email) as DBUser;

          if (existingUser && existingUser._id) {
            await updateUser(existingUser._id.toString(), { intuitCustomerId: Id });
          }
          newUser.intuitCustomerId = Id;
        }
      }
    }

    const result = await createUser(newUser);

    return NextResponse.json({
      success: true,
      userId: 'insertedId' in result ? result.insertedId : undefined
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed'
      },
      { status: 500 }
    );
  }
}

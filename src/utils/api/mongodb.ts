import clientPromise from '@/lib/mongodb';
import { DBUser, CreateDBUser } from '@/types/mongo-db/User';
import { User } from '@/types/user';
import { hash, compare } from 'bcryptjs';
import { Customer, QuickBooksResponse, TokenResponse } from 'intuit-oauth';
import { verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { Property, PropertyDocument } from '@/lib/classes/Property';
import { createCustomer, getCustomers } from './quickbooks';
import { JWTPayload } from '@/types/type';

export async function createUser(userData: CreateDBUser) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const hashedPassword = await hash(userData.password, 12);

    const result = await db.collection<DBUser>('users').insertOne({
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function updateUser(userId: string, updates: Partial<DBUser>) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection<DBUser>('users').updateOne({ _id: new ObjectId(userId) }, { $set: updates });
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return db.collection<DBUser>('users').findOne({ email });
}

export async function validateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function updateQuickBooksToken(token: TokenResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const qbAuthCollection = process.env.NODE_ENV === 'development' ? db.collection('qb_auth') : db.collection('qb_auth_prod');

  const existingDocs = await qbAuthCollection.countDocuments();
  // console.log("existingDocs", qbAuthCollection);c
  if (existingDocs > 0) {
    await qbAuthCollection.updateOne(
      { _id: { $exists: true } },
      { $set: token }
    );
  } else {
    await qbAuthCollection.insertOne(token);
  }
}

export async function getUserFromToken(token: string) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as JWTPayload;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const user = await db.collection<DBUser>('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    if (!user) return null;

    user._id = user._id.toString();
    return {
      ...user,
      id: user._id.toString()
    };
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

export async function getQuickBooksToken(): Promise<TokenResponse | null> {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const qbAuthCollection = process.env.NODE_ENV === 'development' ? db.collection('qb_auth') : db.collection('qb_auth_prod');

    // There should only be one token document in the collection
    const tokenDoc = await qbAuthCollection.findOne({});

    if (!tokenDoc) {
      console.log("No QuickBooks token found in database");
      return null;
    }

    return tokenDoc as unknown as TokenResponse;
  } catch (error) {
    console.error("Error retrieving QuickBooks token:", error);
    return null;
  }
}

export const checkAccountType = async (userData: User | null, pathname: string, tokens: Partial<TokenResponse>) => {

  if (!userData) {
    redirect('/login');
  }

  let customerId: string | undefined;

  if (userData.intuitCustomerId.length === 0) {
    const customers = await getCustomers(tokens.access_token!, tokens.refresh_token!) as Customer[];

    const customer = customers.find((c: Customer) => c.DisplayName.toLowerCase() === `${userData.firstName} ${userData.lastName}`.toLowerCase());
    if (customer) {
      await updateUser(userData.id, { intuitCustomerId: customer.Id });
      customerId = customer.Id;
    } else {
      const initCustomer: Customer = {
        FullyQualifiedName: `${userData.firstName} ${userData.lastName}`,
        PrimaryEmailAddr: {
          Address: userData.email
        },
        DisplayName: `${userData.firstName} ${userData.lastName}`,
        Suffix: "",
        Title: "",
        MiddleName: "",
        Notes: "",
        FamilyName: "",
        PrimaryPhone: {
          FreeFormNumber: ''
        },
        CompanyName: "",
        BillAddr: {
          CountrySubDivisionCode: "",
          City: "",
          PostalCode: "",
          Line1: "",
        },
        GivenName: userData.firstName
      }
      const customer = await createCustomer(tokens.access_token!, tokens.refresh_token!, initCustomer) as QuickBooksResponse<Customer>;
      const { Customer: { Id } } = customer as unknown as { Customer: { Id: string } };
      console.log('Created customer', customer)
      await updateUser(userData.id, { intuitCustomerId: Id });
      customerId = Id;
    }
  }

  if (userData.accountType === 'tenant' && !pathname.includes(`/dashboard/tenant/${customerId ?? userData.intuitCustomerId}`)) {
    redirect(`/dashboard/tenant/${customerId ?? userData.intuitCustomerId}`);
  }

  if (userData.accountType === 'landlord' && !pathname.includes(`/dashboard/landlord/${userData.intuitCustomerId}`)) {
    redirect(`/dashboard/landlord/${userData.intuitCustomerId}`);
  }
}

// Property Functions
export async function createProperty(propertyData: PropertyDocument) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('properties');
    console.log(propertyData);
    const result = await collection.insertOne(propertyData);

    return {
      success: true,
      id: result.insertedId.toString(),
      property: { ...propertyData, _id: result.insertedId }
    };
  } catch (error) {
    console.error('Error creating property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getPropertyById(propertyId: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('properties');

    const property = await collection.findOne({ _id: new ObjectId(propertyId) });

    if (!property) {
      return {
        success: false,
        error: 'Property not found'
      };
    }

    return {
      success: true,
      property: new Property(property as PropertyDocument)
    };
  } catch (error) {
    console.error('Error getting property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getPropertiesByLandlord(landlordId: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('properties');

    const properties = await collection.find({ landlordId }).toArray();

    return {
      success: true,
      properties: properties.map(p => new Property(p as PropertyDocument))
    };
  } catch (error) {
    console.error('Error getting properties by landlord:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function updateProperty(propertyId: string, updates: Partial<PropertyDocument>) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('properties');

    updates.updatedAt = new Date();

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(propertyId) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return {
        success: false,
        error: 'Property not found or update failed'
      };
    }

    return {
      success: true,
      property: new Property(result as PropertyDocument)
    };
  } catch (error) {
    console.error('Error updating property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function deleteProperty(propertyId: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('properties');

    const result = await collection.deleteOne({ _id: new ObjectId(propertyId) });

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: 'Property not found or already deleted'
      };
    }

    return {
      success: true,
      message: 'Property successfully deleted'
    };
  } catch (error) {
    console.error('Error deleting property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}


export async function getAllProperties(page = 1, limit = 10) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('properties');

    const skip = (page - 1) * limit;

    const properties = await collection.find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments({});

    return {
      success: true,
      properties: properties.map((p) => new Property(p as PropertyDocument)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting all properties:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

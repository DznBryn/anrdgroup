import { cookies } from "next/headers";
import { Customer } from "intuit-oauth";
import { DBUser } from "@/types/mongo-db/User";
import { findUserByEmail, updateUser } from "@/utils/api/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { updateCustomer } from "@/utils/api/quickbooks";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const cookieStore = await cookies();
    const tokens = {
      access_token: cookieStore.get('qb_access_token')?.value,
      refresh_token: cookieStore.get('qb_refresh_token')?.value
    };

    const existingUser = await findUserByEmail(userData.email) as DBUser;
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if(userData.accountType === 'tenant' || userData.accountType === 'landlord') {
      const initCustomer: Customer = {
        FullyQualifiedName: `${existingUser.firstName} ${existingUser.lastName}`,
        PrimaryEmailAddr: {
          Address: existingUser.email
        },
        DisplayName: `${existingUser.firstName} ${existingUser.lastName}`,
        Suffix: "",
        Title: "",
        MiddleName: "",
        Notes: "",
        FamilyName: existingUser?.lastName ?? "",
        PrimaryPhone: {
          FreeFormNumber: existingUser?.phoneNumber ?? ""
        },
        CompanyName: existingUser?.companyName ?? "",
        // TODO: Add bill address from properties
        BillAddr: {
          CountrySubDivisionCode: existingUser?.address?.CountrySubDivisionCode ?? "",
          City: existingUser?.address?.City ?? "",
          PostalCode: existingUser?.address?.PostalCode ?? "",
          Line1: existingUser?.address?.Line1 ?? "",
        },
        GivenName: existingUser.firstName
      }
      const updatedUser = await updateCustomer(tokens.access_token!, tokens.refresh_token!, initCustomer);
      return NextResponse.json({ success: true, user: updatedUser });
    } else {
      const updatedUser = await updateUser(existingUser?._id?.toString() ?? "", userData);
      return NextResponse.json({ success: true, user: updatedUser });
    }
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Update user failed' }, { status: 500 });
  }
}
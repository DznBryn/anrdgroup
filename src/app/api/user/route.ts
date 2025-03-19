import { cookies } from "next/headers";
import { Customer, Vendor } from "intuit-oauth";
import { DBUser } from "@/types/mongo-db/User";
import { findUserById, findUserByIntuitCustomerId, updateUser } from "@/utils/api/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { updateCustomer, updateVendor } from "@/utils/api/quickbooks";

export async function PUT(request: NextRequest) {
  try {
    const userData = await request.json();
    const cookieStore = await cookies();
    const tokens = {
      access_token: cookieStore.get('qb_access_token')?.value,
      refresh_token: cookieStore.get('qb_refresh_token')?.value
    };

    const existingUser = await findUserByIntuitCustomerId(userData.intuitCustomerId) as DBUser;

    if (userData.accountType === 'tenant' || userData.accountType === 'landlord') {
      switch (userData.accountType) {
        case 'tenant':
          const initCustomer: Customer = {
            Id: userData?.intuitCustomerId ?? "",
            SyncToken: userData?.syncToken ?? "",
            FullyQualifiedName: `${userData.firstName} ${userData.lastName}`,
            PrimaryEmailAddr: {
              Address: userData.email
            },
            DisplayName: `${userData.firstName} ${userData.lastName}`,
            Suffix: "",
            Title: "",
            MiddleName: "",
            Notes: "Tenant",
            FamilyName: userData?.lastName ?? "",
            PrimaryPhone: {
              FreeFormNumber: userData?.phoneNumber ?? ""
            },
            CompanyName: userData?.companyName ?? "",
            // TODO: Add bill address from properties
            // BillAddr: {
            //   CountrySubDivisionCode: userData?.address?.CountrySubDivisionCode ?? "",
            //   City: userData?.address?.City ?? "",
            //   PostalCode: userData?.address?.PostalCode ?? "",
            //   Line1: userData?.address?.Line1 ?? "",
            // },
            GivenName: userData.firstName
          }
          const { Customer: updatedCustomerUser } = await updateCustomer(tokens.access_token!, tokens.refresh_token!, initCustomer) as unknown as { Customer: Customer };

          if (existingUser) {
            delete userData.syncToken;
            await updateUser(existingUser?._id?.toString() ?? "", {
              ...userData,
              intuitCustomerId: updatedCustomerUser.Id,
              
            });
          }
          return NextResponse.json({ success: true, user: updatedCustomerUser });
        case 'landlord':
          const initVendor: Vendor = {
            Id: userData?.intuitCustomerId ?? "",
            SyncToken: userData?.syncToken ?? "",
            PrimaryEmailAddr: {
              Address: userData.email
            },
            GivenName: userData.firstName ?? "",
            DisplayName: userData.organization ?? `${userData.firstName} ${userData.lastName}`,
            CompanyName: userData.organization ?? "",
            FamilyName: userData.lastName ?? "",
            PrimaryPhone: {
              FreeFormNumber: userData.phoneNumber ?? ""
            },
            PrintOnCheckName: userData.organization ?? `${userData.firstName} ${userData.lastName}`,
            Notes: "Landlord",
            // BillAddr: {
            //   CountrySubDivisionCode: "",
            //   City: "",
            //   PostalCode: "",
            //   Line1: "",
            // },
          }
          const { Vendor: updatedVendorUser } = await updateVendor(tokens.access_token!, tokens.refresh_token!, initVendor) as unknown as { Vendor: Vendor };
          if (existingUser) {
            delete userData.syncToken;
            await updateUser(existingUser?._id?.toString() ?? "", {
              ...userData,
              companyName: updatedVendorUser.CompanyName,
              intuitCustomerId: updatedVendorUser.Id,
            });
          }
          return NextResponse.json({ success: true, user: updatedVendorUser });
      }
    } else {
      const existingUserById = await findUserById(userData?.id ?? "") as DBUser;
      if (!existingUserById) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      delete userData.syncToken;
      const updatedUser = await updateUser(existingUserById?._id?.toString() ?? "", userData);
      return NextResponse.json({ success: true, user: updatedUser });
    }
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Update user failed' }, { status: 500 });
  }
}
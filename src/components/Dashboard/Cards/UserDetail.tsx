'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserDetailProps {
  displayName: string;
  companyName: string;
  email: string;
  phone: string;
  fullAddress: string;
  handleEdit: () => void;
}

export default function UserDetail({
  displayName,
  companyName,
  email,
  phone,
  fullAddress,
  handleEdit
}: UserDetailProps) {
  return (
    <Card className="col-span-2 border-0 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Information</CardTitle>
        <Button 
          onClick={handleEdit}
          variant="outline"
          className="text-blue-500 hover:text-blue-700"
        >
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold">{displayName}</p>
          </div>
          {companyName && (
            <div>
              <p className="text-sm font-medium text-gray-500">Company</p>
              <p className="text-lg font-semibold">{companyName}</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg font-semibold">{email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-lg font-semibold">{phone || 'N/A'}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Address</p>
          <p className="text-lg font-semibold">{fullAddress}</p>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="bg-white border-none shadow-md">
        <CardHeader className="border-b pb-6">
          <CardTitle className="text-3xl font-bold text-center">Terms and Conditions</CardTitle>
          <p className="text-gray-500 text-center mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing or using our property management services, you agree to be bound by these Terms and Conditions. 
              If you do not agree to all the terms and conditions, you may not access or use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">2. Description of Service</h2>
            <p className="text-gray-600">
              Our platform provides property management tools for landlords, property managers, and tenants to manage 
              rental properties, payments, maintenance requests, and communications.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">3. User Accounts</h2>
            <p className="text-gray-600">
              You are responsible for maintaining the confidentiality of your account information and password. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">4. Privacy Policy</h2>
            <p className="text-gray-600">
              Your use of our services is also governed by our Privacy Policy, which is incorporated by reference into these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">5. Payment Terms</h2>
            <p className="text-gray-600">
              Subscription fees are billed in advance on a monthly basis. All payments are non-refundable. 
              You agree to provide current, complete, and accurate billing information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">6. Limitation of Liability</h2>
            <p className="text-gray-600">
              In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">7. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will provide notice of any material changes 
              through our service or by other means.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">8. Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms, please contact us at support@anrdgroup.com.
            </p>
          </section>

          <section className="space-y-4" id="sms-messaging">
            <h2 className="text-2xl font-semibold text-gray-800">9. SMS Messaging Consent</h2>
            <p className="text-gray-600">
              By providing your phone number and using our services, you expressly consent to receive SMS text messages from ANRD Group 
              related to your account, property maintenance issues, appointment reminders, and service requests.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Opt-In Process</h3>
            <p className="text-gray-600">
              During the tenant onboarding process or when submitting a service request through our platform, you will be asked 
              to provide your phone number and consent to receive text messages. You will be presented with language such as:
              &quot;We&apos;ll text you updates about your maintenance requests and property information – is that okay?&quot; Your affirmative 
              response (verbal or by checking a box) constitutes your consent to receive SMS messages.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Message Frequency</h3>
            <p className="text-gray-600">
              Message frequency varies based on your account activity and interaction with our services. You may receive 
              messages related to maintenance requests, appointment confirmations, payment reminders, and property updates.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Opting Out</h3>
            <p className="text-gray-600">
              You can opt out of receiving SMS messages at any time by replying &quot;STOP&quot; to any message you receive from us, 
              or by contacting customer support at support@anrdgroup.com. After opting out, you will receive one final message 
              confirming your opt-out.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Message and Data Rates</h3>
            <p className="text-gray-600">
              Message and data rates may apply for any messages sent to or from you. Please contact your wireless carrier for 
              more information about your messaging plan.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Support</h3>
            <p className="text-gray-600">
              For support regarding our SMS messaging service, please email hello@anrd.app or call our customer service line.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
} 
import React, { useState } from 'react';
import { Copy, Check, Heart, CreditCard, Smartphone, Building } from 'lucide-react';

export default function DonatePage() {
  const [copiedField, setCopiedField] = useState<string>('');

  const bankDetails = {
    accountName: 'Mauka Foundation',
    accountNumber: '1234567890123456',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    branchName: 'Mumbai Central Branch',
    accountType: 'Current Account'
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    });
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Heart className="text-pink-600" size={64} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Support Our Mission
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your donations help us maintain our platform, organize volunteer programs, 
              and create lasting impact across India. Every contribution, no matter how small, 
              makes a difference in someone's life.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">₹100</div>
              <div className="text-sm text-gray-600">Can provide learning materials for 5 children</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">₹500</div>
              <div className="text-sm text-gray-600">Can support a volunteer program for one week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 mb-2">₹1,000</div>
              <div className="text-sm text-gray-600">Can fund digital literacy training for 20 people</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">₹5,000</div>
              <div className="text-sm text-gray-600">Can organize a community health camp</div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ways to Donate</h2>
            <p className="text-lg text-gray-600">
              Choose the method that's most convenient for you. All donations are secure and tax-deductible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bank Transfer */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Bank Transfer</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Account Name</div>
                    <div className="font-medium text-gray-900">{bankDetails.accountName}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountName, 'accountName')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedField === 'accountName' ? (
                      <Check className="text-green-600" size={16} />
                    ) : (
                      <Copy className="text-gray-600" size={16} />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Account Number</div>
                    <div className="font-medium text-gray-900 font-mono">{bankDetails.accountNumber}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedField === 'accountNumber' ? (
                      <Check className="text-green-600" size={16} />
                    ) : (
                      <Copy className="text-gray-600" size={16} />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">IFSC Code</div>
                    <div className="font-medium text-gray-900 font-mono">{bankDetails.ifscCode}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.ifscCode, 'ifscCode')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedField === 'ifscCode' ? (
                      <Check className="text-green-600" size={16} />
                    ) : (
                      <Copy className="text-gray-600" size={16} />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Bank</div>
                    <div className="font-medium text-gray-900">{bankDetails.bankName}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Branch</div>
                    <div className="font-medium text-gray-900">{bankDetails.branchName}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Please use "Donation for Mauka" as the transaction reference 
                  and send us a screenshot at projectmaukajpis@gmail.com for acknowledgment.
                </p>
              </div>
            </div>

            {/* UPI Payment */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Smartphone className="text-green-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">UPI Payment</h3>
              </div>

              <div className="text-center">
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6 inline-block">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=projectmauka@upi&pn=Mauka%20Foundation&cu=INR" 
                    alt="UPI QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">UPI ID</div>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="font-mono text-lg font-medium text-gray-900">
                      projectmauka@upi
                    </span>
                    <button
                      onClick={() => copyToClipboard('projectmauka@upi', 'upiId')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'upiId' ? (
                        <Check className="text-green-600" size={16} />
                      ) : (
                        <Copy className="text-gray-600" size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Scan the QR code with any UPI app like:
                  </p>
                  <div className="flex justify-center space-x-4 text-sm text-gray-500">
                    <span>Google Pay</span>
                    <span>•</span>
                    <span>PhonePe</span>
                    <span>•</span>
                    <span>Paytm</span>
                    <span>•</span>
                    <span>BHIM</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Quick & Easy:</strong> Scan, enter amount, and pay instantly. 
                  You'll receive a confirmation on your registered mobile number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <CreditCard className="text-blue-600 mx-auto mb-4" size={48} />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tax Benefits</h2>
              <p className="text-lg text-gray-600">
                Your donations to Mauka are eligible for tax deductions under Section 80G of the Income Tax Act.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
                <div className="text-gray-700">Tax deduction available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-700">Of your donation goes to programs</div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">How to claim:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Keep the transaction receipt/screenshot</li>
                <li>We'll email you the official 80G receipt within 3 working days</li>
                <li>Use this receipt while filing your IT returns</li>
                <li>Claim deduction under Section 80G</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="mx-auto mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Thank You for Your Support
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Every donation helps us connect more volunteers with meaningful opportunities 
            and create lasting positive change in communities across India.
          </p>
          <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg italic">
              "The best way to find yourself is to lose yourself in the service of others."
            </p>
            <p className="text-sm opacity-80 mt-2">— Mahatma Gandhi</p>
          </div>
        </div>
      </section>

      {/* Contact for Queries */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Have questions about donations?
          </h3>
          <p className="text-gray-600 mb-4">
            Contact us at{' '}
            <a href="mailto:projectmaukajpis@gmail.com" className="text-blue-600 hover:text-blue-700">
              projectmaukajpis@gmail.com
            </a>
            {' '}or call us at +91 98759 77777
          </p>
        </div>
      </section>
    </div>
  );
}
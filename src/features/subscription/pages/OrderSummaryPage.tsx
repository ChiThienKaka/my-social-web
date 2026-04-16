import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ArrowRight, Building2, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
}

interface CompanyInfo {
  companyName: string;
  registrationNumber: string;
  address: string;
  website: string;
  description: string;
  contactPersonName: string;
  contactPhone: string;
}

export function OrderSummaryPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const user = sessionStorage.getItem('user');
    if (!user) {
      navigate('/subscription/auth');
      return;
    }

    // Load selected plan
    const planData = sessionStorage.getItem('selectedPlan');
    if (!planData) {
      navigate('/subscription/pricing');
      return;
    }
    setSelectedPlan(JSON.parse(planData));

    // Load company info
    const companyData = sessionStorage.getItem('companyInfo');
    if (!companyData) {
      navigate('/subscription/company-info');
      return;
    }
    setCompanyInfo(JSON.parse(companyData));
  }, [navigate]);

  const handleProceedToPayment = () => {
    // In real app, this would redirect to payment gateway
    // Simulate successful payment and redirect to employer dashboard
    alert('Payment successful! Welcome to TalentHub.\n\nRedirecting to your dashboard...');
    
    // Redirect to employer dashboard
    navigate('/employer/overview');
  };

  if (!selectedPlan || !companyInfo) {
    return null;
  }

  const subtotal = selectedPlan.price;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              TalentHub
            </button>
            <Badge className="bg-blue-100 text-blue-700">Step 3 of 3</Badge>
          </div>
        </div>
      </nav>

      {/* Summary Section */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Order Summary
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900">Review Your Order</h1>
            <p className="mt-2 text-gray-600">
              Please review your subscription details before proceeding to payment
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Plan & Company Info */}
            <div className="col-span-2 space-y-6">
              {/* Selected Plan */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Selected Plan</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/subscription/pricing')}
                    >
                      Change Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600 text-white">
                          {selectedPlan.id === 'free' ? 'STARTER' : selectedPlan.id === 'standard' ? 'PROFESSIONAL' : 'ENTERPRISE'}
                        </Badge>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h3>
                      </div>
                      <p className="text-gray-600">{selectedPlan.description}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          ${selectedPlan.price}
                        </span>
                        {selectedPlan.price > 0 && (
                          <span className="text-lg text-gray-600">/ {selectedPlan.duration}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Plan Features:</h4>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Company Information</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/subscription/company-info')}
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">{companyInfo.companyName}</div>
                        <div className="text-sm text-gray-600">
                          Registration: {companyInfo.registrationNumber}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="text-gray-700">{companyInfo.address}</div>
                    </div>

                    {companyInfo.website && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-blue-600 mt-1" />
                          <a
                            href={companyInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {companyInfo.website}
                          </a>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div>
                      <div className="mb-2 font-semibold text-gray-900">Contact Person:</div>
                      <div className="space-y-2 pl-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium">{companyInfo.contactPersonName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{companyInfo.contactPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment Summary */}
            <div className="col-span-1">
              <Card className="sticky top-6 border-2 border-blue-600 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Summary
                  </h2>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plan Subscription</span>
                      <span className="font-semibold text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium text-gray-900">{selectedPlan.duration}</span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-lg">
                      <span className="font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button
                      onClick={handleProceedToPayment}
                      className="h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-base font-semibold shadow-xl shadow-blue-600/30 hover:shadow-2xl"
                      size="lg"
                    >
                      Proceed to Payment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-xl border-2 border-gray-300"
                      onClick={() => navigate('/subscription/company-info')}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back to Edit
                    </Button>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Cancel anytime with full refund</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Access to all features immediately</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

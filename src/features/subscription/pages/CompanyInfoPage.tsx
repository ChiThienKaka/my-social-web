import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, MapPin, Globe, User, Phone, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CompanyInfoPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    address: '',
    website: '',
    description: '',
    contactPersonName: '',
    contactPhone: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    const user = sessionStorage.getItem('user');
    if (!user) {
      navigate('/subscription/auth');
      return;
    }

    // Check if plan is selected
    const selectedPlan = sessionStorage.getItem('selectedPlan');
    if (!selectedPlan) {
      navigate('/subscription/pricing');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const requiredFields = [
      'companyName',
      'registrationNumber',
      'address',
      'contactPersonName',
      'contactPhone',
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    // Save company info
    sessionStorage.setItem('companyInfo', JSON.stringify(formData));
    navigate('/subscription/order-summary');
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

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
            <Badge className="bg-blue-100 text-blue-700">Step 2 of 3</Badge>
          </div>
        </div>
      </nav>

      {/* Form Section */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Company Information
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900">Tell Us About Your Company</h1>
            <p className="mt-2 text-gray-600">
              We need a few details to create your employer profile
            </p>
          </div>

          <Card className="border-2 border-blue-100 shadow-xl">
            <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white p-8">
              <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
              <p className="text-gray-600">All fields marked with * are required</p>
            </CardHeader>

            <CardContent className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="shrink-0" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Company Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Company Information
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">
                        Company Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        placeholder="ABC Corporation Ltd."
                        className="h-12"
                        value={formData.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">
                        Business Registration Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="registrationNumber"
                          placeholder="1234567890"
                          className="h-12 pl-10"
                          value={formData.registrationNumber}
                          onChange={(e) => handleChange('registrationNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Company Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Textarea
                        id="address"
                        placeholder="123 Business Street, District, City, Country"
                        className="min-h-[80px] pl-10"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://www.yourcompany.com"
                        className="h-12 pl-10"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your company, industry, and hiring needs..."
                      className="min-h-[120px]"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      This will be visible to candidates on your company profile
                    </p>
                  </div>
                </div>

                {/* Contact Person Section */}
                <div className="space-y-6 border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Contact Person
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonName">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="contactPersonName"
                          placeholder="John Doe"
                          className="h-12 pl-10"
                          value={formData.contactPersonName}
                          onChange={(e) => handleChange('contactPersonName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">
                        Contact Phone <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="h-12 pl-10"
                          value={formData.contactPhone}
                          onChange={(e) => handleChange('contactPhone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-xl border-2 border-gray-300 px-6"
                    onClick={() => navigate('/subscription/auth')}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 font-semibold shadow-lg shadow-blue-600/30"
                    size="lg"
                  >
                    Save & Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

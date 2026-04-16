import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    duration: '30 days',
    description: 'Perfect to get started',
    features: [
      '1 Active Job Post',
      'Basic Search Filters',
      '30 Days Active Period',
      'Email Support',
    ],
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: 299,
    duration: '2 months',
    description: 'For growing teams',
    popular: true,
    features: [
      '5 Active Job Posts',
      'Advanced Search & Filters',
      'Branded Company Profile',
      'Unlimited Applications',
      'Priority Support 24/7',
      'Analytics Dashboard',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 699,
    duration: '6 months',
    description: 'For high-volume hiring',
    features: [
      'Unlimited Job Posts',
      'All Advanced Features',
      'Featured Company Spotlight',
      'Direct Candidate Messaging',
      'Advanced Analytics & Insights',
      'Dedicated Account Manager',
      'API Access',
    ],
  },
];

export function PricingPage() {
  const navigate = useNavigate();

  const handleChoosePlan = (planId: string) => {
    // Store selected plan in sessionStorage
    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan) {
      sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
      navigate('/subscription/auth');
    }
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
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/subscription/auth')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Subscription Plans
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900">Choose Your Plan</h1>
            <p className="mt-4 text-xl text-gray-600">
              Flexible pricing to match your hiring needs
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden rounded-2xl transition-all hover:shadow-xl ${
                  plan.popular
                    ? 'border-4 border-blue-600 shadow-2xl'
                    : 'border-2 border-gray-200 hover:border-blue-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute left-0 right-0 top-0 bg-gradient-to-r from-blue-600 to-blue-700 py-2 text-center">
                    <Badge className="bg-white/20 font-bold uppercase text-white hover:bg-white/20">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`pb-8 ${plan.popular ? 'pt-16' : 'pt-10'}`}>
                  <div className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                    {plan.id === 'free' ? 'Starter' : plan.id === 'standard' ? 'Professional' : 'Enterprise'}
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mb-2 flex items-baseline">
                    <span className="text-6xl font-extrabold text-gray-900">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="ml-2 text-xl text-gray-600">/{plan.duration}</span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6 pb-10">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <span className={plan.popular ? 'font-medium text-gray-900' : 'text-gray-700'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleChoosePlan(plan.id)}
                    className={`w-full h-12 rounded-xl font-semibold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-xl'
                        : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    Choose Plan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-12 text-center text-gray-600">
            ✓ All plans include verified candidate profiles • Application tracking • Mobile access
          </p>
        </div>
      </section>
    </div>
  );
}

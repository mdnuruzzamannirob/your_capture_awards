import React from 'react';

// Demo data
const pricingPlans = [
  {
    name: 'FREE',
    price: '0',
    description: 'Perfect for beginners trying out the platform.',
    features: ['Create a Team', 'Normal Host', '1x Exhibition entry'],
    buttonText: 'Get Started',
    highlight: false,
  },
  {
    name: 'PREMIUM',
    price: '19,95',
    description: 'Great for active photographers and teams.',
    features: [
      'Create a Team',
      'Normal Host',
      'Monthly bundle',
      '2x Exhibition entry',
      'Enter Photographer of the year',
    ],
    buttonText: 'Go Premium',
    highlight: true,
  },
  {
    name: 'PRO',
    price: '29,95',
    description: 'The ultimate power for professional creators.',
    features: [
      'Create a Team',
      'Normal Host',
      'Host Exhibition',
      'Monthly bundle',
      '4x Exhibition entry',
      'Enter Photographer of the year',
    ],
    buttonText: 'Go Pro',
    highlight: false,
  },
];

export default function PricingPage() {
  const currentPlanName = 'PRO';

  return (
    <main className="margin container py-16">
      {/* Header Section */}
      <div className="mb-16 text-center">
        <h1 className="text-white-2-light font-kumbh mb-4 text-4xl font-extrabold md:text-5xl">
          Our Pricing <span className="text-primary">Plans</span>
        </h1>
        <p className="mx-auto max-w-2xl text-zinc-400">
          Unlock exclusive features and showcase your photography to the world. Select the plan that
          fits your journey.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {pricingPlans.map((plan, index) => {
          // Logic to check if this is the active plan
          const isCurrentPlan = plan.name === currentPlanName;

          return (
            <div
              key={index}
              className={`flex flex-col rounded-xl border p-8 transition-all duration-300 ${
                plan.highlight
                  ? 'border-primary bg-black-2-700 z-10 scale-105 shadow-[0_0_20px_rgba(252,102,0,0.2)]'
                  : 'border-black-2-700 bg-black-2-800/50 hover:border-black-2-500'
              }`}
            >
              {plan.highlight && (
                <span className="bg-primary mb-6 self-start rounded-full px-4 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                  Most Popular
                </span>
              )}

              <div className="mb-8">
                <h2 className="text-white-2-light font-kumbh text-2xl font-bold">{plan.name}</h2>
                <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-white-2-light text-4xl font-bold">${plan.price}</span>
                  <span className="ml-1 text-zinc-400">(Per Month)</span>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-white-2-dark mb-4 text-xs font-semibold tracking-wider uppercase">
                  What You&apos;ll Get
                </p>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-black-2-200 flex items-start text-sm">
                      <svg
                        className="text-primary mr-3 h-5 w-5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={isCurrentPlan}
                className={`mt-10 w-full rounded-md px-6 py-3 font-bold transition-all ${
                  isCurrentPlan
                    ? 'cursor-not-allowed border border-zinc-600 bg-zinc-700 text-zinc-400'
                    : plan.highlight
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-lg active:scale-95'
                      : 'border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-600 active:scale-95'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}

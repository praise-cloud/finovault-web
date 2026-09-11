'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MastercardGateway } from '@/features/payment/MastercardGateway';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const rawPlan = searchParams.get('plan');
  const plan = rawPlan === 'business' || rawPlan === 'biz' ? 'business' : 'plus';

  return <MastercardGateway initialPlan={plan} />;
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[var(--fv-bg)] text-[var(--fv-text)]">
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center font-mono text-xs font-black uppercase tracking-widest text-[var(--fv-text-secondary)]">
            INITIALIZING MASTERCARD PAYMENT GATEWAY (MPGS)...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </div>
  );
}

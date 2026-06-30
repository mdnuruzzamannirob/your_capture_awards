import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
  return (
    <main className="container flex min-h-dvh items-center justify-center py-20">
      <section className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400">
          <CheckCircle className="size-7" />
        </div>
        <h1 className="text-3xl font-bold">Payment successful</h1>
        <p className="text-muted-foreground">
          Your coin purchase is being processed. Your balance will update shortly.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex rounded-md px-5 py-2 text-sm font-semibold transition"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
};

export default PaymentSuccessPage;

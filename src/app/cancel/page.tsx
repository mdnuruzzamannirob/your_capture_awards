import Link from 'next/link';
import { XCircle } from 'lucide-react';

const PaymentCancelPage = () => {
  return (
    <main className="container flex min-h-dvh items-center justify-center py-20">
      <section className="max-w-md space-y-4 text-center">
        <div className="bg-destructive/15 text-destructive mx-auto flex size-14 items-center justify-center rounded-full text-2xl">
          <XCircle className="size-7" />
        </div>
        <h1 className="text-3xl font-bold">Payment cancelled</h1>
        <p className="text-muted-foreground">
          The checkout was cancelled, so no coins were added to your account.
        </p>
        <Link
          href="/"
          className="bg-primary text-background hover:bg-primary/90 inline-flex rounded-md px-5 py-2 text-sm font-semibold transition"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
};

export default PaymentCancelPage;

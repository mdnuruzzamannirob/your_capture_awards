import { getUser } from '@/lib/server/getUser';
import { redirect } from 'next/navigation';

export default async function ContestPage() {
  const { user, token } = await getUser();

  // If authenticated, redirect to joined contests
  if (user && token) {
    return redirect('/contest/joined');
  }

  // If not authenticated, redirect to open contests
  return redirect('/contest/open');
}

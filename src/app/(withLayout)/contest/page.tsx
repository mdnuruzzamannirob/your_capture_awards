import { decodeToken } from '@/utils/decodeToken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ContestPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? null;

  const decoded = decodeToken(token);
  const role = decoded?.role;

  if (role !== 'USER') {
    redirect('/signin');
  }

  return redirect('/contest/joined');
}

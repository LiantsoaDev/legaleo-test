import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to legaleo</h1>
      <p><Link href="/login">Login</Link></p>
      <p><Link href="/signup">Sign up</Link></p>
      <p><Link href="/reset-password">Reset Password</Link></p>
    </div>
  );
}

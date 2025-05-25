'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'; // 导入 useSearchParams
import { useState, FormEvent, useEffect } from 'react'; // 导入 useEffect

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // 用于显示来自注册页面的消息
  const router = useRouter();
  const searchParams = useSearchParams(); // 获取查询参数

  useEffect(() => {
    const registrationMessage = searchParams.get('message');
    if (registrationMessage) {
      setMessage(decodeURIComponent(registrationMessage));
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null); // 清除之前的消息

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      // 根据 NextAuth 返回的错误信息进行更友好的提示
      if (result.error === 'CredentialsSignin') {
        setError('Invalid username or password.');
      } else {
        setError(result.error);
      }
    } else if (result?.ok) {
      router.push('/'); // 登录成功后重定向到首页
    } else {
      setError('An unknown error occurred.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-teal-400">Sign In</h1>
        {message && <p className="mb-4 text-center text-sm text-green-400">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-teal-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/auth/register" className="font-medium text-teal-400 hover:text-teal-300">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
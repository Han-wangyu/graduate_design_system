import { NextResponse } from 'next/server';
import { createUser, findUserByEmail, findUserByUsername } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing username, email, or password' }, { status: 400 });
    }

    // 检查用户名是否已存在
    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
    }

    // 检查邮箱是否已存在
    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    const newUser = await createUser(username, email, password);

    if (!newUser) {
      return NextResponse.json({ message: 'User creation failed' }, { status: 500 });
    }

    // 不返回密码哈希
    const { passwordHash, ...userWithoutPassword } = newUser;
    return NextResponse.json({ message: 'User created successfully', user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
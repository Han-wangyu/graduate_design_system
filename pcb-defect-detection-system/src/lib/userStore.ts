import bcrypt from 'bcryptjs';

// 简单用户模型接口
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

// 内存用户存储 (仅用于演示)
const users: User[] = [];

// 创建用户
export async function createUser(username: string, email: string, password: string): Promise<User | null> {
  if (users.find(u => u.username === username) || users.find(u => u.email === email)) {
    return null; // 用户名或邮箱已存在
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: String(users.length + 1),
    username,
    email,
    passwordHash,
  };
  users.push(newUser);
  return newUser;
}

// 按用户名查找用户
export async function findUserByUsername(username: string): Promise<User | null> {
  return users.find(u => u.username === username) || null;
}

// 按邮箱查找用户
export async function findUserByEmail(email: string): Promise<User | null> {
  return users.find(u => u.email === email) || null;
}

// 验证密码
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
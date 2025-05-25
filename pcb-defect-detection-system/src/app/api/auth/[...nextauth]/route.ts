import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByUsername, verifyPassword } from '@/lib/userStore'; // 导入用户存储和验证函数

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }
        const user = await findUserByUsername(credentials.username);

        if (user && (await verifyPassword(credentials.password, user.passwordHash))) {
          // 返回不包含密码哈希的用户对象
          return { id: user.id, name: user.username, email: user.email };
        }
        return null; // 凭据无效
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // 指定自定义登录页面
    // signOut: '/auth/signout', // 如果需要自定义登出页面
    // error: '/auth/error', // 如果需要自定义错误页面
    // verifyRequest: '/auth/verify-request', // 如果使用邮件验证
    newUser: '/auth/register', // 可以添加注册页面路由
  },
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        // 如果需要，可以在 token 中添加更多用户信息
        // token.username = user.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        // 如果在 jwt 回调中添加了其他信息，也在这里添加到 session
        // if (token.username) {
        //   session.user.name = token.username as string;
        // }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
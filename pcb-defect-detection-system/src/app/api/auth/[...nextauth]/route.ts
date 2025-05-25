import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // 在这里添加用户验证逻辑
        // 例如，从数据库中查找用户
        // 为了演示，我们使用一个硬编码的用户
        if (credentials?.username === 'user' && credentials?.password === 'password') {
          return { id: '1', name: 'Test User', email: 'test@example.com' };
        }
        // 如果凭据无效，则返回 null
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // 指定自定义登录页面
  },
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/db";
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) {
          throw new Error("Missing email or password");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new Error("No user found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    // creates token by adding the data of user inside the token
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.name = user.name as string;
        token.email = user.email as string;
        token.role = user.role as string;
      }
      return token;
    },

    // creates session by adding the data of user inside the session by the help of token's data
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.AUTH_SECRET,
});

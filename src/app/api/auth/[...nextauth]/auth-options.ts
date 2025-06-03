import { AuthOptions, DefaultSession } from "next-auth";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../db/mongoDB/user-schema";
import dbConnect from "../../../../db/mongoDB/db-connect";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          console.log("Connecting to DB...");
          await dbConnect();
          console.log("DB Connected!");

          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { phoneNumber: credentials.identifier },
            ],
          });

          console.log("User Found: ", user);

          if (!user){
            console.log("No user found with that identifier");
            return null;
          } 

          // if (user.password !== credentials.password) {
          //   console.log("Invalid password");
          //   return null;
          // }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
          };
        } catch (error) {
          console.error("DB Connection failed:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      console.log("Session callback triggered");
      console.log("Session before modification:", session);
      console.log("Token:", token);

      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };

      session.accessToken = token.accessToken

      console.log("Session after modification:", session);
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback triggered");
      console.log("JWT before modification:", token);
      console.log("User:", user);
      
      if (user) {
        token.id = user.id;
        token.accessToken = `Token-${user.id}`;
      }

      console.log("Token after modification:", token);
      return token;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  events: {
    async signIn({ user }) {
      console.log("User signed in:", user);
    },
    async signOut() {
      console.log("User signed out");
    },
    async createUser({ user }) {
      console.log("New user created:", user);
    },
    async linkAccount({ user }) {
      console.log("Account linked to user:", user);
    },
  },
};
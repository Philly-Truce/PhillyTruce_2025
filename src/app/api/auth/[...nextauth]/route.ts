import { AuthOptions, DefaultSession } from "next-auth";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../db/mongoDB/user-schema";
import dbConnect from "../../../../db/mongoDB/db-connect";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const authOptions: AuthOptions = {
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
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
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
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
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
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

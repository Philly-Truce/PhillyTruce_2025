import NextAuth from "next-auth";
import { authOptions } from "../../../app/api/auth/[...nextauth]/auth-options"; 

export default NextAuth(authOptions);
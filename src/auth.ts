import NextAuth, { CredentialsSignin } from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { connectToDB } from "./lib/dbConnect";
import { UserModel } from "./model/user.model";
import bcrypt from "bcryptjs";
import { UserInterface } from "./app/api/sign-up/route";
import { SigninCode } from "./types/signin_codes";


export const { auth, handlers, signIn, signOut } = NextAuth({
  providers:
    [
      Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        id: "credentials",
        credentials: {
          email: {
            label: "Email",
            type: "email",
          },
          password: {
            label: "Password",
            type: "password"
          },
        },
        //this is the login function
        authorize: async (credentials) => {
          await connectToDB();
          const email = credentials.email;
          const password = credentials.password;
          try {

            if (!email || !password) {
              return new CredentialsSignin(SigninCode.NO_USERNAME_OR_PASS)
            }

            const user = await UserModel.findOne<UserInterface>({ email }).select('+password');

            if (!user) {
              throw new CredentialsSignin(SigninCode.NO_USER_WITH_EMAIL)
            }

            if (!user.isVerified) {
              throw new CredentialsSignin("Please verify your account before login");
            }
            const isPasswordCorrect = await bcrypt.compare(password as string, user.password!)

            if (!isPasswordCorrect) {
              throw new CredentialsSignin(SigninCode.INCORRECT_PASS);
            }

            return { id: user._id?.toString(), username: user.username, email: user.email, isVerified: user.isVerified, isAcceptingMessages: user.isAcceptingMessage };

          } catch (err: any) {
            // console.log("error occured:\n",err)
            throw new CredentialsSignin(SigninCode.SERVER_ERROR);
          }
        }
      }),

    ],

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.isAcceptingMessages = token.isAcceptingMessages;
      session.user.isVerified = token.isVerified;
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString()
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username
        token.isVerified = user.isVerified
      }

      return token
    }

  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  },
  session: {
    strategy: 'jwt'
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET
})
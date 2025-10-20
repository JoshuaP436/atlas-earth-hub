import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Simple user store for demo - in production this would be your database
const users: Array<{ id: string; email: string; password: string; name?: string }> = []

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 Authorization attempt:', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        // For demo - check if user exists
        const user = users.find(u => u.email === credentials.email)
        console.log('👤 User lookup:', { found: !!user, totalUsers: users.length })
        
        if (!user) {
          // Auto-register for demo purposes
          console.log('✨ Creating new user')
          const hashedPassword = await bcrypt.hash(credentials.password as string, 12)
          const newUser = {
            id: Date.now().toString(),
            email: credentials.email as string,
            password: hashedPassword,
            name: (credentials.email as string)?.split('@')[0]
          }
          users.push(newUser)
          console.log('✅ New user created:', { id: newUser.id, email: newUser.email })
          
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          }
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          console.log('❌ Invalid password')
          return null
        }

        console.log('✅ User authenticated successfully')
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
})
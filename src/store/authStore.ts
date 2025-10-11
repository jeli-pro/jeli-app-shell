import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: {
    email: string
    name: string
  } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - in real app, validate with backend
    if (email && password) {
      set({
        isAuthenticated: true,
        user: {
          email,
          name: email.split('@')[0], // Simple name extraction
        },
      })
    } else {
      throw new Error('Invalid credentials')
    }
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    })
  },
  
  forgotPassword: async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, send reset email via backend
    console.log(`Password reset link sent to: ${email}`)
  },
}))
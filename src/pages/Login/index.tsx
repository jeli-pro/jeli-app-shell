import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'

interface LoginPageProps {
  onLogin?: (email: string, password: string) => void
  onForgotPassword?: (email: string) => void
  onSignUp?: () => void
}

type LoginState = 'login' | 'forgot-password' | 'reset-sent'

export function LoginPage({ onLogin, onForgotPassword, onSignUp }: LoginPageProps) {
  const [state, setState] = useState<LoginState>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const cardRef = React.useRef<HTMLDivElement>(null)
  const backgroundRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial animations
    if (cardRef.current && backgroundRef.current) {
      gsap.fromTo(cardRef.current, 
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.95 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          ease: "power3.out" 
        }
      )

      gsap.fromTo(backgroundRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" }
      )
    }
  }, [])

  useEffect(() => {
    // Animate state transitions
    if (cardRef.current) {
      gsap.fromTo(cardRef.current.querySelector('.card-content'),
        { opacity: 0, x: state === 'login' ? -20 : 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [state])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (state === 'login') {
      const newErrors: typeof errors = {}
      
      if (!email) {
        newErrors.email = 'Email is required'
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email'
      }
      
      if (!password) {
        newErrors.password = 'Password is required'
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        onLogin?.(email, password)
      }, 1500)
      
    } else if (state === 'forgot-password') {
      if (!email) {
        setErrors({ email: 'Email is required' })
        return
      }
      
      if (!validateEmail(email)) {
        setErrors({ email: 'Please enter a valid email' })
        return
      }

      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        onForgotPassword?.(email)
        setState('reset-sent')
      }, 1500)
    }
  }

  const renderLoginForm = () => (
    <div className="card-content space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn("pl-10", errors.email && "border-destructive")}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn("pl-10 pr-10", errors.password && "border-destructive")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 rounded border border-input"
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm">
              Remember me
            </Label>
          </div>
          <button
            type="button"
            onClick={() => setState('forgot-password')}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" disabled={isLoading}>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </Button>
        <Button variant="outline" disabled={isLoading}>
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <button
          onClick={onSignUp}
          className="text-primary hover:underline font-medium"
          disabled={isLoading}
        >
          Sign up
        </button>
      </p>
    </div>
  )

  const renderForgotPasswordForm = () => (
    <div className="card-content space-y-6">
      <button
        onClick={() => setState('login')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        disabled={isLoading}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </button>

      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
        <p className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn("pl-10", errors.email && "border-destructive")}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Sending reset link...
            </div>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>
    </div>
  )

  const renderResetSentForm = () => (
    <div className="card-content space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder or try again.
        </p>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setState('forgot-password')}
            variant="outline"
          >
            Try again
          </Button>
          <Button
            onClick={() => setState('login')}
            variant="ghost"
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div 
      ref={backgroundRef}
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 opacity-20">
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
      </div>
      <div className="absolute top-40 right-32 opacity-20">
        <User className="w-8 h-8 text-accent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-32 left-40 opacity-20">
        <Lock className="w-5 h-5 text-primary animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <Card 
        ref={cardRef}
        className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm"
      >
        <CardHeader className="space-y-0 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {state === 'login' && renderLoginForm()}
          {state === 'forgot-password' && renderForgotPasswordForm()}
          {state === 'reset-sent' && renderResetSentForm()}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
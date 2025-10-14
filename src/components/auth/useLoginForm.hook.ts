import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

type LoginState = 'login' | 'forgot-password' | 'reset-sent';

export function useLoginForm() {
  const [state, setState] = useState<LoginState>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname + location.state?.from?.search || "/";

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      // In a real app, you'd show an error message to the user
      setErrors({ email: 'Invalid credentials', password: ' ' }); // Add a generic error
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setState('reset-sent');
    } catch (error) {
      console.error("Forgot password failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    // In a real app, navigate to sign up page
    console.log("Navigate to sign up page");
  };

  return {
    state,
    setState,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errors,
    showPassword,
    setShowPassword,
    handleLoginSubmit,
    handleForgotSubmit,
    handleSignUp,
  };
}
import { useState, ChangeEvent, FormEvent } from 'react';
import { Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AnimatedInput } from '../effects/AnimatedInput';
import { BoxReveal } from '../effects/BoxReveal';
import { Ripple } from '../effects/Ripple';
import { TechOrbitDisplay } from '../effects/OrbitingCircles';
import { BottomGradient } from '../effects/BottomGradient';

// ==================== AnimatedForm Components ====================

// ==================== Main LoginPage Component ====================
interface LoginPageProps {
	onLogin?: (email: string, password: string) => void;
	onForgotPassword?: (email: string) => void;
	onSignUp?: () => void;
}

type LoginState = 'login' | 'forgot-password' | 'reset-sent';

export function LoginPage({ onLogin, onForgotPassword }: LoginPageProps) {
	const [state, setState] = useState<LoginState>('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
	const [showPassword, setShowPassword] = useState(false);

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
		await onLogin?.(email, password);
		setIsLoading(false);
	};

	const handleForgotSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});
		if (!email) {
			setErrors({ email: 'Email is required' });
			return;
		}
		setIsLoading(true);
		await onForgotPassword?.(email);
		setIsLoading(false);
		setState('reset-sent');
	};

	const renderContent = () => {
		if (state === 'reset-sent') {
			return (
				<div className="w-full max-w-md mx-auto text-center flex flex-col gap-4">
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
							<Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
						</div>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<p className="text-muted-foreground">We've sent a password reset link to <strong>{email}</strong></p>
					</BoxReveal>
					<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.5}>
						<button onClick={() => setState('login')} className="text-sm text-blue-500 hover:underline">
							<div className="flex items-center justify-center gap-2">
								<ArrowLeft className="w-4 h-4" /> Back to login
							</div>
						</button>
					</BoxReveal>
				</div>
			);
		}

		const isLogin = state === 'login';
		const formFields = isLogin
			? [
				{ label: 'Email', required: true, type: 'email', placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
				{ label: 'Password', required: true, type: 'password', placeholder: 'Enter your password', onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
			]
			: [{ label: 'Email', required: true, type: 'email', placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) }];

		return (
			<div className="w-full max-w-md mx-auto flex flex-col gap-4">
				<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
					<h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">{isLogin ? 'Welcome back' : 'Reset Password'}</h2>
				</BoxReveal>
				<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} className="pb-2">
					<p className="text-neutral-600 text-sm max-w-sm dark:text-neutral-300">{isLogin ? 'Sign in to your account to continue' : 'Enter your email to receive a reset link'}</p>
				</BoxReveal>
				{isLogin && (
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} width="100%" className="overflow-visible">
						<button className="g-button group/btn bg-transparent w-full rounded-md border h-10 font-medium outline-hidden hover:cursor-pointer" type="button">
							<span className="flex items-center justify-center w-full h-full gap-3">
								<img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" width={26} height={26} alt="Google Icon" />
								Sign in with Google
							</span>
							<BottomGradient />
						</button>
					</BoxReveal>
				)}
				{isLogin && (
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} width="100%">
						<div className="flex items-center gap-4">
							<hr className="flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700" />
							<p className="text-neutral-700 text-sm dark:text-neutral-300">or</p>
							<hr className="flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700" />
						</div>
					</BoxReveal>
				)}
				<form onSubmit={isLogin ? handleLoginSubmit : handleForgotSubmit}>
					{formFields.map((field) => (
						<div key={field.label} className="flex flex-col gap-2 mb-4">
							<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
								<Label htmlFor={field.label}>{field.label} <span className="text-red-500">*</span></Label>
							</BoxReveal>
							<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.3} className="flex flex-col space-y-2 w-full">
								<div className="relative">
									<AnimatedInput type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type} id={field.label} placeholder={field.placeholder} onChange={field.onChange} />
									{field.type === 'password' && (
										<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
											{showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
										</button>
									)}
								</div>
								<div className="h-4">{errors[field.label as keyof typeof errors] && <p className="text-red-500 text-xs">{errors[field.label as keyof typeof errors]}</p>}</div>
							</BoxReveal>
						</div>
					))}

					<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.3} className="overflow-visible">
						<button
							className="bg-gradient-to-br relative group/btn from-zinc-200 dark:from-zinc-900 dark:to-zinc-900 to-zinc-200 block dark:bg-zinc-800 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] outline-hidden hover:cursor-pointer disabled:opacity-50"
							type="submit" disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
									<span>Processing...</span>
								</div>
							) : (
								<>{isLogin ? 'Sign in' : 'Send reset link'} &rarr;</>
							)}
							<BottomGradient />
						</button>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
						<div className="mt-4 text-center">
							<button type="button" className="text-sm text-blue-500 hover:underline" onClick={() => setState(isLogin ? 'forgot-password' : 'login')}>
								{isLogin ? 'Forgot password?' : 'Back to login'}
							</button>
						</div>
					</BoxReveal>
				</form>
			</div>
		);
	};

	return (
		<section className="flex max-lg:justify-center min-h-screen w-full login-page-theme bg-background text-foreground">
			{/* Left Side */}
			<div className="flex flex-col justify-center w-1/2 max-lg:hidden relative">
				<Ripple />
				<TechOrbitDisplay />
			</div>

			{/* Right Side */}
			<div className="w-1/2 h-screen flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]">
				{renderContent()}
			</div>
		</section>
	);
}
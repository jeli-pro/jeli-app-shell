import React, {
	useState,
	ChangeEvent,
	FormEvent,
	ReactNode,
	useEffect,
	useRef,
	forwardRef,
	memo,
} from 'react';
import { Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

// ==================== Input Component ====================
const Input = memo(
	forwardRef(function Input(
		{ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
		ref: React.ForwardedRef<HTMLInputElement>,
	) {
		const radius = 100;
		const wrapperRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const wrapper = wrapperRef.current;
			if (!wrapper) return;

			const handleMouseMove = (e: MouseEvent) => {
				if (!wrapper) return;
				const { left, top } = wrapper.getBoundingClientRect();
				const x = e.clientX - left;
				const y = e.clientY - top;
				wrapper.style.setProperty('--mouse-x', `${x}px`);
				wrapper.style.setProperty('--mouse-y', `${y}px`);
			};

			const handleMouseEnter = () => {
				if (!wrapper) return;
				wrapper.style.setProperty('--radius', `${radius}px`);
			};

			const handleMouseLeave = () => {
				if (!wrapper) return;
				wrapper.style.setProperty('--radius', '0px');
			};

			wrapper.addEventListener('mousemove', handleMouseMove);
			wrapper.addEventListener('mouseenter', handleMouseEnter);
			wrapper.addEventListener('mouseleave', handleMouseLeave);

			return () => {
				wrapper.removeEventListener('mousemove', handleMouseMove);
				wrapper.removeEventListener('mouseenter', handleMouseEnter);
				wrapper.removeEventListener('mouseleave', handleMouseLeave);
			};
		}, [radius]);

		return (
			<div
				ref={wrapperRef}
				style={
					{
						'--radius': '0px',
						'--mouse-x': '0px',
						'--mouse-y': '0px',
						background: `radial-gradient(var(--radius) circle at var(--mouse-x) var(--mouse-y), #3b82f6, transparent 80%)`,
					} as React.CSSProperties
				}
				className="group/input rounded-lg p-[2px] transition duration-300"
			>
				<input
					type={type}
					className={cn(
						`shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600`,
						className,
					)}
					ref={ref}
					{...props}
				/>
			</div>
		);
	}),
);

// ==================== BoxReveal Component ====================
type BoxRevealProps = {
	children: ReactNode;
	width?: string;
	boxColor?: string;
	duration?: number;
	className?: string;
};

const BoxReveal = memo(function BoxReveal({
	children,
	width = 'fit-content',
	boxColor,
	duration,
	className,
}: BoxRevealProps) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const childRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						gsap.timeline()
							.set(childRef.current, { opacity: 0 })
							.to(boxRef.current, {
								left: '100%',
								duration: duration ?? 0.5,
								ease: 'power3.inOut',
							})
							.fromTo(
								childRef.current,
								{ y: 50, opacity: 0 },
								{ y: 0, opacity: 1, duration: duration ?? 0.5, ease: 'power3.out' },
								'-=0.3',
							);
						observer.unobserve(section);
					}
				});
			},
			{ threshold: 0.1 },
		);

		observer.observe(section);

		return () => {
			if (section) {
				observer.unobserve(section);
			}
		};
	}, [duration]);

	return (
		<div ref={sectionRef} style={{ width }} className={cn('relative overflow-hidden', className)}>
			<div ref={childRef}>{children}</div>
			<div
				ref={boxRef}
				style={{
					background: boxColor ?? 'hsl(var(--skeleton))',
				}}
				className="absolute top-1 bottom-1 left-0 right-0 z-20 rounded-sm"
			/>
		</div>
	);
});

// ==================== Ripple Component ====================
interface RippleProps {
	mainCircleSize?: number;
	mainCircleOpacity?: number;
	numCircles?: number;
}
const Ripple = memo(function Ripple({
	mainCircleSize = 210,
	mainCircleOpacity = 0.24,
	numCircles = 11,
}: RippleProps) {
	return (
		<div className="absolute inset-0 flex items-center justify-center [mask-image:linear-gradient(to_bottom,white,transparent)]">
			{Array.from({ length: numCircles }, (_, i) => {
				const size = mainCircleSize + i * 70;
				const opacity = mainCircleOpacity - i * 0.03;
				const animationDelay = `${i * 0.06}s`;
				const borderStyle = i === numCircles - 1 ? 'dashed' : 'solid';
				const borderOpacity = 5 + i * 5;

				return (
					<div
						key={i}
						className="absolute animate-ripple rounded-full border"
						style={
							{
								width: `${size}px`,
								height: `${size}px`,
								opacity: opacity,
								animationDelay: animationDelay,
								borderStyle: borderStyle,
								borderWidth: '1px',
								borderColor: `hsl(var(--foreground) / ${borderOpacity / 100})`,
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
							} as React.CSSProperties
						}
					/>
				);
			})}
		</div>
	);
});

// ==================== OrbitingCircles Component ====================
const OrbitingCircles = memo(function OrbitingCircles({
	className,
	children,
	reverse = false,
	duration = 20,
	delay = 10,
	radius = 50,
	path = true,
}: {
	className?: string;
	children?: React.ReactNode;
	reverse?: boolean;
	duration?: number;
	delay?: number;
	radius?: number;
	path?: boolean;
}) {
	return (
		<>
			{path && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					className="pointer-events-none absolute inset-0 size-full"
				>
					<circle
						className="stroke-black/10 stroke-1 dark:stroke-white/10"
						cx="50%"
						cy="50%"
						r={radius}
						fill="none"
					/>
				</svg>
			)}
			<div
				style={
					{
						'--duration': duration,
						'--radius': radius,
						'--delay': -delay,
					} as React.CSSProperties
				}
				className={cn(
					'absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/10 [animation-delay:calc(var(--delay)*1s)] dark:bg-white/10',
					{ '[animation-direction:reverse]': reverse },
					className,
				)}
			>
				{children}
			</div>
		</>
	);
});

// ==================== TechOrbitDisplay Component ====================
interface OrbitIcon {
	component: () => ReactNode;
	className: string;
	duration?: number;
	delay?: number;
	radius?: number;
	path?: boolean;
	reverse?: boolean;
}

const iconsArray: OrbitIcon[] = [
	{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' alt='HTML5' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 20, radius: 100, path: false, reverse: false },
	{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' alt='CSS3' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 10, radius: 100, path: false, reverse: false },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' alt='TypeScript' />, className: 'size-[50px] border-none bg-transparent', radius: 210, duration: 20, path: false, reverse: false },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' alt='JavaScript' />, className: 'size-[50px] border-none bg-transparent', radius: 210, duration: 20, delay: 20, path: false, reverse: false },
	{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' alt='TailwindCSS' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 20, radius: 150, path: false, reverse: true },
	{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' alt='Nextjs' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 10, radius: 150, path: false, reverse: true },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' alt='React' />, className: 'size-[50px] border-none bg-transparent', radius: 270, duration: 20, path: false, reverse: true },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' alt='Figma' />, className: 'size-[50px] border-none bg-transparent', radius: 270, duration: 20, delay: 60, path: false, reverse: true },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' alt='Git' />, className: 'size-[50px] border-none bg-transparent', radius: 320, duration: 20, delay: 20, path: false, reverse: false },
];

const TechOrbitDisplay = memo(function TechOrbitDisplay({ text = 'Amazing App Shell' }: { text?: string }) {
	return (
		<div className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-lg">
			<span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
				{text}
			</span>
			{iconsArray.map((icon, index) => (
				<OrbitingCircles key={index} {...icon}>
					{icon.component()}
				</OrbitingCircles>
			))}
		</div>
	);
});

// ==================== AnimatedForm Components ====================
const BottomGradient = () => (
	<>
		<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
		<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
	</>
);

const Label = memo(function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
	return <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)} {...props} />;
});

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
									<Input type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type} id={field.label} placeholder={field.placeholder} onChange={field.onChange} />
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

export default LoginPage;
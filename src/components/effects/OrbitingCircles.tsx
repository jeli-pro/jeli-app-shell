import React, { ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

export const OrbitingCircles = memo(function OrbitingCircles({
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

export const TechOrbitDisplay = memo(function TechOrbitDisplay({ text = 'Jeli App Shell' }: { text?: string }) {
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
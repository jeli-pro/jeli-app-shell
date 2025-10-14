import { ReactNode, useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

type BoxRevealProps = {
	children: ReactNode;
	width?: string;
	boxColor?: string;
	duration?: number;
	className?: string;
};

export const BoxReveal = memo(function BoxReveal({
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
							.set(childRef.current, { opacity: 0, y: 50 })
							.set(boxRef.current, { transformOrigin: 'right' })
							.to(boxRef.current, {
								scaleX: 0,
								duration: duration ?? 0.5,
								ease: 'power3.inOut',
							})
							.to(
								childRef.current,
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
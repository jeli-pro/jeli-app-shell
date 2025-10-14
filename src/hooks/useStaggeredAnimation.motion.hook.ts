import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';

interface StaggeredAnimationOptions {
	stagger?: number;
	duration?: number;
	y?: number;
	scale?: number;
	ease?: string;
	mode?: 'full' | 'incremental';
}

/**
 * Animates the direct children of a container element with a staggered fade-in effect.
 *
 * @param containerRef Ref to the container element.
 * @param deps Dependency array to trigger the animation.
 * @param options Animation options.
 * @param options.mode - 'full' (default): animates all children every time deps change.
 *                       'incremental': only animates new children added to the container.
 */
export function useStaggeredAnimation<T extends HTMLElement>(
	containerRef: React.RefObject<T>,
	deps: React.DependencyList,
	options: StaggeredAnimationOptions = {},
) {
	const reducedMotion = useAppShellStore(s => s.reducedMotion);
	const {
		stagger = 0.08,
		duration = 0.6,
		y = 30,
		scale = 1,
		ease = 'power3.out',
		mode = 'full',
	} = options;

	const animatedItemsCount = useRef(0);

	useLayoutEffect(() => {
		if (reducedMotion || !containerRef.current) return;

		const children = Array.from(containerRef.current.children) as HTMLElement[];

		if (mode === 'incremental') {
			// On dependency change, if the number of children is less than what we've animated,
			// it's a list reset (e.g., filtering), so reset the counter.
			if (children.length < animatedItemsCount.current) {
				animatedItemsCount.current = 0;
			}

			const newItems = children.slice(animatedItemsCount.current);

			if (newItems.length > 0) {
				gsap.fromTo(
					newItems,
					{ y, opacity: 0, scale },
					{
						duration,
						y: 0,
						opacity: 1,
						scale: 1,
						stagger,
						ease,
					},
				);
				animatedItemsCount.current = children.length;
			}
		} else {
			if (children.length) {
				gsap.fromTo(
					children,
					{ y, opacity: 0, scale },
					{
						duration,
						y: 0,
						opacity: 1,
						scale: 1,
						stagger,
						ease,
					},
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef, ...deps]);
}
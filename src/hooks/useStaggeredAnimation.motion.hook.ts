import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface StaggeredAnimationOptions {
	stagger?: number;
	duration?: number;
	y?: number;
	scale?: number;
	ease?: string;
}

/**
 * Animates the direct children of a container element with a staggered fade-in effect.
 * This version is for lists that might grow (e.g., infinite scroll). It only
 * animates new elements that are added to the container.
 *
 * @param containerRef Ref to the container element.
 * @param deps Dependency array. A change here that adds items will trigger the animation on the new items.
 * @param options Animation options.
 */
export function useIncrementalStaggeredAnimation<T extends HTMLElement>(
	containerRef: React.RefObject<T>,
	deps: React.DependencyList,
	options: StaggeredAnimationOptions = {},
) {
	const animatedItemsCount = useRef(0);

	const { stagger = 0.1, duration = 0.5, y = 30, scale = 0.95, ease = 'power2.out' } = options;

	useLayoutEffect(() => {
		if (!containerRef.current) return;

		const children = Array.from(containerRef.current.children);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef, ...deps]);
}

/**
 * Animates the direct children of a container element with a staggered fade-in effect.
 * This version animates all children every time the dependencies change.
 * Ideal for content that is replaced, not appended to.
 *
 * @param containerRef Ref to the container element.
 * @param deps Dependency array to trigger the animation.
 * @param options Animation options.
 */
export function useStaggeredAnimation<T extends HTMLElement>(
	containerRef: React.RefObject<T>,
	deps: React.DependencyList,
	options: StaggeredAnimationOptions = {},
) {
	const { stagger = 0.08, duration = 0.6, y = 30, scale = 1, ease = 'power3.out' } = options;

	useLayoutEffect(() => {
		if (containerRef.current?.children.length) {
			gsap.fromTo(
				containerRef.current.children,
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef, ...deps]);
}
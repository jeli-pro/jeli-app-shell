import React, { memo } from 'react';

interface RippleProps {
	mainCircleSize?: number;
	mainCircleOpacity?: number;
	numCircles?: number;
}

export const Ripple = memo(function Ripple({
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
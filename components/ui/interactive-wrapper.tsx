import type React from 'react';

type InteractiveWrapperProps = React.HTMLAttributes<HTMLElement> & {
	children: React.ReactNode;
};

export default function InteractiveWrapper({
	children,
	...rest
}: InteractiveWrapperProps) {
	return <section {...rest}>{children}</section>;
}

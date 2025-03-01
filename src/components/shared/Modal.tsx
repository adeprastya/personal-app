export function Modal({
	children,
	closeHandler
}: {
	children: React.ReactNode;
	closeHandler: (e: React.MouseEvent) => void;
}) {
	return (
		<div onClick={closeHandler} className="fixed inset-0 z-[999] p-20 flex items-center justify-center bg-black/50">
			<p className="pointer-events-none absolute top-4 right-8 text-sm tracking-wide text-neutral-100">
				Click anywhere to close
			</p>
			{children}
		</div>
	);
}

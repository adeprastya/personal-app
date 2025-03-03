"use client";

import HotToastProvider from "./HotToastContext";

export default function ContextProvider({ children }: { children: React.ReactNode }) {
	return <HotToastProvider>{children}</HotToastProvider>;
}

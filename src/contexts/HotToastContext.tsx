/**
 * Deps:
 *  react-hot-toast ^2.5.2
 *
 * Context & hook for using react-hot-toast
 */
"use client"; // Required if using Next.js
import React, { createContext, useContext, ReactNode } from "react";
import toast, { Toaster, ToastOptions } from "react-hot-toast";

// Global toast options
const toastOptions: ToastOptions = {
	duration: 4000,
	position: "bottom-right",

	// style: {background: "red", color: "#fff"},
	className: "!py-0.5 border border-neutral-300 !rounded-sm !bg-neutral-100 !text-neutral-800",

	// icon: "👏",

	iconTheme: {
		primary: "#262626",
		secondary: "#f5f5f5"
	},

	ariaProps: {
		role: "status",
		"aria-live": "polite"
	},

	removeDelay: 1500
};

interface HotToastContextType {
	toast: typeof toast;
}
const HotToastContext = createContext<HotToastContextType | undefined>(undefined);

export default function HotToastProvider({ children }: { children: ReactNode }) {
	return (
		<HotToastContext.Provider value={{ toast }}>
			{children}
			<Toaster toastOptions={toastOptions} />
		</HotToastContext.Provider>
	);
}

export function useHotToast(): HotToastContextType {
	const context = useContext(HotToastContext);
	if (!context) throw new Error("useHotToast must be used within a HotToastProvider");
	return context;
}

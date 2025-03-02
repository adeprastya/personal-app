import React, { useState, FC, useEffect } from "react";
import { useField } from "formik";
import clsx from "clsx";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export type FormikFieldProps = (React.InputHTMLAttributes<HTMLInputElement> &
	React.TextareaHTMLAttributes<HTMLTextAreaElement>) & { name: string; label: string };
export type VisualState = "DEFAULT" | "FOCUS" | "SUCCESS" | "ERROR";

const hasValue = (value: unknown): boolean => {
	if (value == null) return false;
	if (Array.isArray(value)) return value.length > 0;
	if (typeof value === "object") return Object.keys(value).length > 0;
	return Boolean(value);
};

/**
 * Custom Field Support Component
 */
interface CustomLabelProps {
	label: string | number;
	className?: string;
	required?: boolean;
}
export const CustomLabel: FC<CustomLabelProps> = ({ label, required, className = "" }) => (
	<span className={className}>
		{label}
		{required && " *"}
	</span>
);

interface CustomPlaceholderProps {
	placeholder: string;
	className?: string;
}
export const CustomPlaceholder: FC<CustomPlaceholderProps> = ({ placeholder, className = "" }) => (
	<span className={className}>{placeholder}</span>
);

interface CustomErrorTextProps {
	name: string;
	error?: string;
	visualState: VisualState;
}
export const CustomErrorText: FC<CustomErrorTextProps> = ({ name, error, visualState }) => {
	if (visualState !== "ERROR") return null;

	return (
		<p
			id={`${name}-error`}
			className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs flex gap-0.5 items-center"
		>
			<InfoCircledIcon className="w-3 h-3 inline" /> <span>{error}</span>
		</p>
	);
};

/**
 * Custom hook to manage Formik field state and associated UI classes.
 */
export function useFormikField(name: string) {
	const [field, meta, helpers] = useField(name);
	const [isFocused, setIsFocused] = useState(false);
	const [isHasValue, setIsHasValue] = useState(false);
	const [isAlreadyChanged, setIsAlreadyChanged] = useState(false);

	useEffect(() => {
		setIsHasValue(hasValue(field.value));
	}, [field.value]);

	useEffect(() => {
		if (isHasValue) setIsAlreadyChanged(true);
	}, [isHasValue]);

	const handleFocus = () => setIsFocused(true);
	const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setIsFocused(false);
		field.onBlur(e);
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		field.onChange(e);
	};

	const visualState: VisualState = (() => {
		if (isAlreadyChanged && meta.touched && meta.error) return "ERROR";
		if (isAlreadyChanged && meta.touched && !meta.error) return "SUCCESS";
		if (isFocused) return "FOCUS";
		return "DEFAULT";
	})();

	const inputBorderClass = clsx("transition-colors w-full h-8 px-3 py-1 rounded-sm outline-none", {
		"border border-neutral-400": visualState === "DEFAULT",
		"border-2 border-neutral-600": visualState === "FOCUS",
		"border-2 border-blue-300": visualState === "SUCCESS",
		"border-2 border-red-300": visualState === "ERROR"
	});

	const floatLabelClass = clsx(
		"pointer-events-none transition-all absolute top-0 px-1 left-2 leading-none",
		isHasValue || isFocused
			? clsx("-translate-y-3/5 font-semibold tracking-wider text-xs", {
					"text-neutral-700": visualState === "DEFAULT" || visualState === "FOCUS",
					"text-blue-500": visualState === "SUCCESS",
					"text-red-500": visualState === "ERROR"
			  })
			: "translate-y-2/5 font-normal tracking-normal text-base text-neutral-800"
	);

	const placeholderClass = clsx(
		"pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 font-normal leading-none text-base text-neutral-500",
		{
			hidden: isHasValue || !isFocused
		}
	);

	return {
		field,
		meta,
		helpers,
		focused: { get: isFocused, set: setIsFocused },
		hasValue: { get: isHasValue, set: setIsHasValue },
		alreadyChanged: { get: isAlreadyChanged, set: setIsAlreadyChanged },
		handle: {
			focus: handleFocus,
			blur: handleBlur,
			change: handleChange
		},
		visualState,
		className: {
			inputBorder: inputBorderClass,
			floatLabel: floatLabelClass,
			placeholder: placeholderClass
		}
	};
}

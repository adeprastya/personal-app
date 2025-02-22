"use client";

import clsx from "clsx";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useFormikField } from "@/hooks/useFormikField";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string | number;
};

export default function InputField({
	name,
	label,
	type = "text",
	required = false,
	placeholder = "Type Here",
	...props
}: InputFieldProps) {
	const {
		field: { value, onChange },
		meta: { error, touched },
		isFocused,
		visualState,
		handleFocus,
		handleBlur
	} = useFormikField(name);
	const hasValue = !!value;
	const shouldFloatLabel = hasValue || isFocused;

	const inputClasses = clsx("transition-colors outline-none w-full h-8 px-3 py-1 rounded-sm border border-solid", {
		"border-blue-500": (visualState === "DEFAULT" || visualState === "FOCUSED") && hasValue,
		"border-neutral-400": visualState === "DEFAULT" && !hasValue,
		"border-neutral-950": visualState === "FOCUSED" && !hasValue,
		"border-red-500": visualState === "ERROR"
	});

	const labelClasses = clsx(
		"absolute px-1 left-2 transition-all leading-none backdrop-blur-3xl",
		shouldFloatLabel
			? clsx("top-0 -translate-y-3/5 font-semibold tracking-wider text-xs", {
					"text-blue-500": (visualState === "DEFAULT" || visualState === "FOCUSED") && hasValue,
					"text-neutral-400": visualState === "DEFAULT" && !hasValue,
					"text-neutral-950": visualState === "FOCUSED" && !hasValue,
					"text-red-500": visualState === "ERROR"
			  })
			: "top-1/2 -translate-y-1/2 font-normal tracking-normal text-base text-neutral-700"
	);

	const placeholderClasses = clsx(
		"absolute left-3 top-1/2 -translate-y-1/2 font-normal leading-none text-base text-neutral-500 pointer-events-none",
		{
			hidden: hasValue || !isFocused,
			visible: !hasValue && isFocused
		}
	);

	return (
		<label htmlFor={name} className="relative">
			<input
				id={name}
				name={name}
				type={type}
				required={required}
				value={value}
				onChange={onChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				aria-invalid={touched && !!error}
				aria-describedby={touched && error ? `${name}-error` : undefined}
				className={inputClasses}
				{...props}
			/>

			<span className={labelClasses}>
				{label}
				{required && " *"}
			</span>

			<span className={placeholderClasses}>{placeholder}</span>

			{touched && error && (
				<p
					id={`${name}-error`}
					className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs flex gap-0.5 items-center"
				>
					<InfoCircledIcon className="w-3 h-3 inline" /> <span>{error}</span>
				</p>
			)}
		</label>
	);
}

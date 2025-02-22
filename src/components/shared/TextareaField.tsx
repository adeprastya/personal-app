"use client";

import clsx from "clsx";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useFormikField } from "@/hooks/useFormikField";

type FieldProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
	name: string;
	label: string | number;
};

export default function TextareaField({
	name,
	label,
	required = false,
	placeholder = "Type Here",
	...props
}: FieldProps) {
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

	const textareaClasses = clsx("transition-colors outline-none w-full px-3 py-1 rounded-sm border border-solid", {
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
			: "top-0 translate-y-2/5 font-normal tracking-normal text-base text-neutral-700"
	);

	const placeholderClasses = clsx(
		"transition-all absolute left-3 top-0 translate-y-2/5 font-normal leading-none text-base text-neutral-500 pointer-events-none",
		{
			hidden: hasValue || !isFocused,
			visible: !hasValue && isFocused
		}
	);

	return (
		<label htmlFor={name} className="relative">
			<textarea
				id={name}
				name={name}
				rows={4}
				required={required}
				value={value}
				onChange={onChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				aria-invalid={touched && !!error}
				aria-describedby={touched && error ? `${name}-error` : undefined}
				className={textareaClasses}
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
					className="absolute left-0 bottom-1 translate-y-full text-red-500 text-xs flex gap-0.5 items-center"
				>
					<InfoCircledIcon className="size-3 inline" /> {error}
				</p>
			)}
		</label>
	);
}

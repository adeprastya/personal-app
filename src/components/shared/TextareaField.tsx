"use client";

import clsx from "clsx";
import {
	FormikFieldProps,
	useFormikField,
	CustomLabel,
	CustomPlaceholder,
	CustomErrorText
} from "@/hooks/useFormikField";

export default function TextareaField({
	label,
	name,
	required = false,
	placeholder = "Type Here",
	rows = 5,
	...props
}: FormikFieldProps) {
	const {
		field: { value },
		meta: { error, touched },
		handle,
		visualState,
		className
	} = useFormikField(name);

	return (
		<label htmlFor={name} className="relative">
			<textarea
				id={name}
				name={name}
				rows={rows}
				required={required}
				value={value}
				onChange={handle.change}
				onFocus={handle.focus}
				onBlur={handle.blur}
				aria-invalid={touched && Boolean(error)}
				aria-describedby={touched && error ? `${name}-error` : undefined}
				className={clsx(className.inputBorder, "h-auto")}
				{...props}
			/>

			<CustomLabel label={label} required={required} className={clsx(className.floatLabel, "bg-neutral-100")} />
			<CustomPlaceholder placeholder={placeholder} className={clsx(className.placeholder, "top-4")} />
			<CustomErrorText name={name} error={error} visualState={visualState} />
		</label>
	);
}

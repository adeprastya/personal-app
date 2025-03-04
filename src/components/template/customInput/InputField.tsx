"use client";

import clsx from "clsx";
import {
	FormikFieldProps,
	useFormikField,
	CustomLabel,
	CustomPlaceholder,
	CustomErrorText
} from "@/hooks/useFormikField";

export default function InputField({
	label,
	name,
	type = "text",
	required = false,
	placeholder = "Type Here",
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
		<label htmlFor={name} className="relative block">
			<input
				id={name}
				name={name}
				type={type}
				required={required}
				value={value}
				onChange={handle.change}
				onFocus={handle.focus}
				onBlur={handle.blur}
				aria-invalid={touched && Boolean(error)}
				aria-describedby={touched && error ? `${name}-error` : undefined}
				className={className.inputBorder}
				{...props}
			/>

			<CustomLabel label={label} required={required} className={clsx(className.floatLabel, "bg-neutral-100")} />
			<CustomPlaceholder placeholder={placeholder} className={className.placeholder} />
			<CustomErrorText name={name} error={error} visualState={visualState} />
		</label>
	);
}

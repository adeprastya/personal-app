import { useRef, useState } from "react";
import { useField } from "formik";

const STATE = {
	DEFAULT: "DEFAULT",
	FOCUSED: "FOCUSED",
	WARNING: "WARNING",
	ERROR: "ERROR"
} as const;
type FieldState = (typeof STATE)[keyof typeof STATE];
type FieldProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
	label: string | number;
};

export default function TextareaField({
	name,
	label,
	required = false,
	placeholder = "Type Here",
	...props
}: FieldProps) {
	const [field, meta] = useField(name);
	const ref = useRef<HTMLTextAreaElement>(null);
	const [currentState, setCurrentState] = useState<FieldState>(STATE.DEFAULT);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => field.onChange(e);

	const handleFocus = () => setCurrentState(STATE.FOCUSED);

	const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
		setCurrentState(STATE.DEFAULT);
		field.onBlur(e);
	};

	const getBorderClass = () => {
		switch (currentState) {
			case STATE.DEFAULT:
				return field.value ? "border-blue-500" : "border-neutral-400";
			case STATE.FOCUSED:
				return field.value ? "border-blue-500" : "border-neutral-950";
			case STATE.WARNING:
				return "border-yellow-500";
			case STATE.ERROR:
				return "border-red-500";
			default:
				return "";
		}
	};

	return (
		<label htmlFor={name} className="relative">
			{/* Input */}
			<textarea
				ref={ref}
				rows={4}
				id={name}
				name={name}
				required={required}
				value={field.value}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={`transition-colors outline-none w-full px-3 py-1 rounded-sm border border-solid ${getBorderClass()}`}
				{...props}
			/>

			{/* Label */}
			<span
				className={`absolute px-1 left-2 transition-all leading-none bg-white
          ${
						field.value || currentState === STATE.FOCUSED
							? "top-0 -translate-y-3/5 font-semibold tracking-wider text-xs text-neutral-950"
							: "top-0 translate-y-2/5 font-normal tracking-normal text-base text-neutral-700"
					}`}
			>
				{label}
				{required && " *"}
			</span>

			{/* Placeholder */}
			<span
				className={`transition-all absolute left-3 top-0 translate-y-2/5 font-normal leading-none text-base text-neutral-500 pointer-events-none
          ${field.value || currentState !== STATE.FOCUSED ? "hidden" : "visible"}
        `}
			>
				{placeholder}
			</span>

			{/* Error */}
			{meta.touched && meta.error && (
				<p className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs">{meta.error}</p>
			)}
		</label>
	);
}

import { useRef, useState } from "react";
import { Field, ErrorMessage } from "formik";

const state = {
	DEFAULT: "DEFAULT",
	FOCUSED: "FOCUSED",
	WARNING: "WARNING",
	ERROR: "ERROR"
} as const;
type InputState = (typeof state)[keyof typeof state];

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string | number;
	name: string;
	type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
	placeholder?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputField({
	name,
	label,
	onChange,
	type = "text",
	required = false,
	placeholder = "",
	...props
}: InputFieldProps) {
	const ref = useRef<HTMLInputElement>(null);
	const [currentState, setCurrentState] = useState<InputState>(state.DEFAULT);
	const [isFilled, setIsFilled] = useState(false);

	const handleFocus = () => setCurrentState(state.FOCUSED);

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setCurrentState(state.DEFAULT);
		setIsFilled(e.target.value !== "");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e);
		setIsFilled(e.target.value !== "");
	};

	const getBorderClass = () => {
		switch (currentState) {
			case state.DEFAULT:
				return isFilled ? "border-blue-500" : "border-neutral-400";
			case state.FOCUSED:
				return isFilled ? "border-blue-500" : "border-neutral-950";
			case state.WARNING:
				return "border-yellow-500";
			case state.ERROR:
				return "border-red-500";
			default:
				return "";
		}
	};

	return (
		<label htmlFor={name} className="relative">
			{/* Input */}
			<Field
				ref={ref}
				id={name}
				name={name}
				type={type}
				required={required}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={`transition-colors outline-none w-full h-8 px-3 py-1 rounded-sm border border-solid ${getBorderClass()}`}
				{...props}
			/>

			{/* Label */}
			<span
				className={`absolute px-1 left-2 transition-all leading-none bg-white
          ${
						currentState === state.FOCUSED || isFilled
							? "top-0 -translate-y-3/5 font-semibold tracking-wider text-xs text-neutral-950"
							: "top-1/2 -translate-y-1/2 font-normal tracking-normal text-base text-neutral-700"
					}`}
			>
				{label}
				{required && " *"}
			</span>

			{/* Placeholder */}
			<span
				className={`absolute left-3 top-1/2 -translate-y-1/2 font-normal leading-none text-base text-neutral-500
          ${isFilled ? "hidden" : currentState === state.FOCUSED ? "visible" : "hidden"}
        `}
			>
				{placeholder}
			</span>

			{/* Error Text */}
			<ErrorMessage
				name={name}
				component="p"
				className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs"
			/>
		</label>
	);
}

import { useRef, useState } from "react";

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
	const [currentState, setCurrentState] = useState<InputState>(state.DEFAULT);
	const [isFilled, setIsFilled] = useState(false);
	const ref = useRef<HTMLInputElement>(null);

	const handleFocus = () => {
		setCurrentState(state.FOCUSED);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setIsFilled(value !== "");
		setCurrentState(state.DEFAULT);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e);
		setIsFilled(e.target.value !== "");
	};

	return (
		<label htmlFor={name} className="relative">
			<input
				ref={ref}
				id={name}
				name={name}
				type={type}
				required={required}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={`transition-colors outline-none w-full h-8 px-3 py-1 rounded-sm border border-solid
          ${currentState === state.DEFAULT ? (isFilled ? "border-blue-500" : "border-neutral-400") : ""}
          ${currentState === state.FOCUSED ? (isFilled ? "border-blue-500" : "border-neutral-950") : ""}
          ${currentState === state.WARNING ? "border-yellow-500" : ""}
          ${currentState === state.ERROR ? "border-red-500" : ""} 
        `}
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
				{required && <span className="ml-1 font-bold text-red-400">*</span>}
			</span>

			{/* Placeholder */}
			<span
				className={`transition-all absolute left-3 top-1/2 -translate-y-1/2 font-normal leading-none text-base text-neutral-500
          ${isFilled ? "opacity-0" : currentState === state.FOCUSED ? "opacity-100" : "opacity-0"}
        `}
			>
				{placeholder}
			</span>
		</label>
	);
}

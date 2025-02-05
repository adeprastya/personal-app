import { useEffect, useRef, useState } from "react";

const state = {
	DEFAULT: "DEFAULT",
	FOCUSED: "FOCUSED",
	WARNING: "WARNING",
	ERROR: "ERROR"
} as const;
type FieldState = (typeof state)[keyof typeof state];

type FieldProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
	label: string | number;
	name: string;
	placeholder?: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextareaField({
	name,
	label,
	onChange,
	required = false,
	placeholder = "",
	...props
}: FieldProps) {
	const [currentState, setCurrentState] = useState<FieldState>(state.DEFAULT);
	const [isFilled, setIsFilled] = useState(false);
	const ref = useRef<HTMLTextAreaElement>(null);

	const handleFocus = () => {
		setCurrentState(state.FOCUSED);
	};

	const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setIsFilled(value !== "");
		setCurrentState(state.DEFAULT);
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e);
		setIsFilled(e.target.value !== "");
	};

	useEffect(() => {
		console.log("Current state:", currentState, "isFilled:", isFilled);
	}, [currentState, isFilled]);

	return (
		<label htmlFor={name} className="relative">
			<textarea
				ref={ref}
				rows={3}
				id={name}
				name={name}
				required={required}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={`transition-colors outline-none w-full px-3 py-1 rounded-sm border border-solid
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
							: "top-0 translate-y-2/5 font-normal tracking-normal text-base text-neutral-700"
					}`}
			>
				{label}
				{required && <span className="ml-1 font-bold text-red-400">*</span>}
			</span>

			{/* Placeholder */}
			<span
				className={`transition-all absolute left-3 top-0 translate-y-2/5 font-normal leading-none text-base text-neutral-500
          ${isFilled ? "opacity-0" : currentState === state.FOCUSED ? "opacity-100" : "opacity-0"}
        `}
			>
				{placeholder}
			</span>
		</label>
	);
}

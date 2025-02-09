import React, { useState, useRef } from "react";
import { useField } from "formik";

const STATE = {
	DEFAULT: "DEFAULT",
	FOCUSED: "FOCUSED",
	WARNING: "WARNING",
	ERROR: "ERROR"
} as const;
type InputState = (typeof STATE)[keyof typeof STATE];
type ArrayTextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string | number;
};

export default function ArrayTextField({
	name,
	label,
	required = false,
	placeholder = "Click Enter to Add",
	...props
}: ArrayTextFieldProps) {
	const [field, meta, helpers] = useField(name);
	const [inputValue, setInputValue] = useState("");
	const ref = useRef<HTMLInputElement>(null);
	const [currentState, setCurrentState] = useState<InputState>(STATE.DEFAULT);

	const tags = Array.isArray(field.value)
		? field.value.filter((tag) => tag.trim() !== "")
		: typeof field.value === "string"
		? field.value
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag !== "")
		: [];

	const addTag = () => {
		const newTag = inputValue.trim();
		if (newTag && !tags.includes(newTag)) {
			const newTags = [...tags, newTag];
			if (Array.isArray(field.value)) {
				helpers.setValue(newTags);
			} else {
				helpers.setValue(newTags.join(", "));
			}
		}
		setInputValue("");
	};

	const removeTag = (index: number) => {
		const newTags = tags.filter((_, i) => i !== index);
		if (Array.isArray(field.value)) {
			helpers.setValue(newTags);
		} else {
			helpers.setValue(newTags.join(", "));
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag();
		}
	};

	const handleFocus = () => setCurrentState(STATE.FOCUSED);

	const handleBlur = () => setCurrentState(STATE.DEFAULT);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

	const getBorderClass = () => {
		switch (currentState) {
			case STATE.DEFAULT:
				return inputValue ? "border-blue-500" : "border-neutral-400";
			case STATE.FOCUSED:
				return inputValue ? "border-blue-500" : "border-neutral-950";
			case STATE.WARNING:
				return "border-yellow-500";
			case STATE.ERROR:
				return "border-red-500";
			default:
				return "";
		}
	};

	return (
		<>
			<label htmlFor={name} className="relative">
				{/* Input */}
				<input
					ref={ref}
					type="text"
					value={inputValue}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className={`transition-colors outline-none w-full h-8 px-3 py-1 rounded-sm border border-solid ${getBorderClass()}`}
					{...props}
				/>

				{/* Label */}
				<span
					className={`absolute px-1 left-2 transition-all leading-none bg-white
          ${
						inputValue || currentState === STATE.FOCUSED
							? "top-0 -translate-y-3/5 font-semibold tracking-wider text-xs text-neutral-950"
							: "top-1/2 -translate-y-1/2 font-normal tracking-normal text-base text-neutral-700"
					}`}
				>
					{label}
					{required && " *"}
				</span>

				{/* Placeholder */}
				<span
					className={`absolute left-3 top-1/2 -translate-y-1/2 font-normal leading-none text-base text-neutral-500 pointer-events-none
                ${inputValue || currentState !== STATE.FOCUSED ? "hidden" : "visible"}
              `}
				>
					{placeholder}
				</span>

				{/* Error Text */}
				{meta.touched && meta.error && (
					<p className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs">{meta.error}</p>
				)}
			</label>

			{/* Tags List */}
			<div className="flex flex-wrap gap-2">
				{tags.map((tag: string, index: number) => (
					<div
						key={index}
						className="border border-neutral-300 bg-neutral-200 px-3 py-0 rounded-full flex items-center gap-2"
					>
						<span className="font-medium tracking-wider text-xs">{tag}</span>

						<button type="button" onClick={() => removeTag(index)} className="size-fit text-red-500 cursor-pointer">
							x
						</button>
					</div>
				))}
			</div>
		</>
	);
}

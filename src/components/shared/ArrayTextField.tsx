"use client";

import { useState, useRef } from "react";
import clsx from "clsx";
import { useFormikField } from "@/hooks/useFormikField";
import { Cross2Icon, InfoCircledIcon } from "@radix-ui/react-icons";

type ArrayTextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string | number;
};

export default function ArrayTextField({
	name,
	label,
	required = false,
	placeholder = "Click Enter to Add",
	...props
}: ArrayTextFieldProps) {
	const {
		field: { value },
		meta: { error, touched },
		isFocused,
		visualState,
		handleFocus,
		handleBlur,
		helpers
	} = useFormikField(name);

	const [inputValue, setInputValue] = useState("");
	const ref = useRef<HTMLInputElement>(null);

	const tags = Array.isArray(value)
		? value.filter((tag: string) => tag.trim() !== "")
		: typeof value === "string"
		? value
				.split(",")
				.map((tag: string) => tag.trim())
				.filter((tag: string) => tag !== "")
		: [];

	const addTag = () => {
		const newTag = inputValue.trim();
		if (newTag && !tags.includes(newTag)) {
			const newTags = [...tags, newTag];
			if (Array.isArray(value)) {
				helpers.setValue(newTags);
			} else {
				helpers.setValue(newTags.join(", "));
			}
		}
		setInputValue("");
	};

	const removeTag = (index: number) => {
		const newTags = tags.filter((_, i) => i !== index);
		if (Array.isArray(value)) {
			helpers.setValue(newTags);
		} else {
			helpers.setValue(newTags.join(", "));
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const borderClass = (() => {
		switch (visualState) {
			case "DEFAULT":
				return inputValue ? "border-blue-500" : "border-neutral-400";
			case "FOCUSED":
				return "border-neutral-950";
			case "ERROR":
				return "border-red-500";
			default:
				return "";
		}
	})();

	return (
		<>
			<label htmlFor={name} className="relative">
				<input
					ref={ref}
					id={name}
					name={name}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					onBlur={handleBlur}
					aria-invalid={touched && !!error}
					aria-describedby={touched && error ? `${name}-error` : undefined}
					className={clsx(
						"transition-colors outline-none w-full h-8 px-3 py-1 rounded-sm border border-solid",
						borderClass
					)}
					{...props}
				/>

				<span
					className={clsx(
						"absolute px-1 left-2 transition-all leading-none backdrop-blur-3xl",
						inputValue || isFocused
							? "top-0 -translate-y-3/5 font-semibold tracking-wider text-xs text-neutral-950"
							: "top-1/2 -translate-y-1/2 font-normal tracking-normal text-base text-neutral-700"
					)}
				>
					{label}
					{required && " *"}
				</span>

				<span
					className={clsx(
						"absolute left-3 top-1/2 -translate-y-1/2 font-normal leading-none text-base text-neutral-500 pointer-events-none",
						{
							hidden: inputValue || !isFocused,
							visible: !inputValue && isFocused
						}
					)}
				>
					{placeholder}
				</span>

				{touched && error && (
					<p
						id={`${name}-error`}
						className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs flex gap-0.5 items-center"
					>
						<InfoCircledIcon className="size-3 inline" /> {error}
					</p>
				)}
			</label>

			<div className="flex flex-wrap gap-2">
				{tags.map((tag: string, index: number) => (
					<div key={index} className="px-2 py-1 rounded-lg border border-blue-500 flex gap-2 items-center">
						<span className="tracking-wider text-xs">{tag}</span>

						<button type="button" onClick={() => removeTag(index)} className="text-red-500 cursor-pointer">
							<Cross2Icon className="size-3" />
						</button>
					</div>
				))}
			</div>
		</>
	);
}

"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import {
	FormikFieldProps,
	useFormikField,
	CustomLabel,
	CustomPlaceholder,
	CustomErrorText
} from "@/hooks/useFormikField";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function ArrayTextField({
	name,
	label,
	required = false,
	placeholder = "Click Enter to Add",
	...props
}: FormikFieldProps) {
	const [inputValue, setInputValue] = useState("");
	const [tags, setTags] = useState<string[]>([]);

	const {
		field: { value },
		meta: { error, touched },
		helpers,
		handle,
		visualState,
		className,
		hasValue,
		alreadyChanged,
		focused
	} = useFormikField(name);

	useEffect(() => {
		if (inputValue) {
			hasValue.set(true);
			alreadyChanged.set(true);
		}

		if (!inputValue && tags.length <= 0) hasValue.set(false);
	}, [inputValue, hasValue, alreadyChanged, tags]);

	useEffect(() => {
		helpers.setValue(tags);
	}, [tags, helpers]);

	useEffect(() => {
		if (value.length !== tags.length) {
			setTags(value);
			setInputValue("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const trimmedValue = inputValue.trim();
			if (!trimmedValue) return;
			setTags((prevTags) => [...prevTags, trimmedValue]);
			setInputValue("");
		}
	};

	const removeTag = (index: number) => setTags((tags) => tags.filter((_, i) => i !== index));

	return (
		<>
			<label
				htmlFor={name}
				className={clsx(
					className.inputBorder,
					clsx("cursor-text relative min-h-8 h-auto ps-3 flex flex-row flex-wrap gap-y-1 items-center", {
						"pt-2": tags.length > 0
					})
				)}
			>
				<div className="w-full min-h-6 flex flex-wrap gap-2">
					{tags.length > 0 && tags.map((tag, i) => <Tag key={i} tag={tag} index={i} removeTag={removeTag} />)}

					<input
						id={name}
						name={name}
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={handle.focus}
						onBlur={handle.blur}
						aria-invalid={touched && !!error}
						aria-describedby={touched && error ? `${name}-error` : undefined}
						className="grow min-w-40 h-6 border-0 outline-none leading-0"
						{...props}
					/>
				</div>

				<CustomLabel label={label} required={required} className={clsx(className.floatLabel, "bg-neutral-100")} />
				<CustomPlaceholder
					placeholder={placeholder}
					className={clsx(className.placeholder, {
						hidden: inputValue.trim() !== "" || !focused.get
					})}
				/>
				<CustomErrorText name={name} error={error} visualState={visualState} />
			</label>
		</>
	);
}

function Tag({ tag, index, removeTag }: { tag: string; index: number; removeTag: (index: number) => void }) {
	return (
		<div className="h-5 px-2 rounded-sm border border-blue-300 flex gap-2 items-center">
			<span className="font-semibold tracking-wide leading-0 text-xs">{tag}</span>
			<button type="button" onClick={() => removeTag(index)} className="text-red-400 cursor-pointer">
				<Cross2Icon className="size-3" />
			</button>
		</div>
	);
}

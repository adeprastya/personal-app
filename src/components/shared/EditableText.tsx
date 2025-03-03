"use client";

import React, { useState, useRef } from "react";
import { Pencil2Icon } from "@radix-ui/react-icons";

export interface EditableTextProps {
	value: string;
	onUpdate: (newValue: string) => Promise<void>;
	className?: string;
	placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({ value, onUpdate, className = "", placeholder = "" }) => {
	const [oldValue, setOldValue] = useState(value);
	const editableRef = useRef<HTMLSpanElement>(null);

	const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
		setOldValue(e.currentTarget.textContent?.trim() || "");
	};

	const handleBlur = async (e: React.FocusEvent<HTMLElement>) => {
		const newValue = e.currentTarget.textContent?.trim() || "";

		if (newValue !== oldValue) {
			try {
				await onUpdate(newValue);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				if (editableRef.current) {
					editableRef.current.textContent = oldValue;
				}
			}
		}
	};

	return (
		<span className="relative block w-fit">
			<Pencil2Icon key={oldValue} className="absolute top-0 -left-5 size-3 text-neutral-400" />

			<span
				ref={editableRef}
				key={`${String(Symbol(value))}`}
				contentEditable
				suppressContentEditableWarning
				spellCheck={false}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={`block cursor-pointer outline-0
        hover:underline hover:underline-offset-4
        focus:underline focus:underline-offset-4 focus:bg-black/5 focus:text-neutral-800
        ${className}`}
			>
				{value || placeholder}
			</span>
		</span>
	);
};

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useFormikField } from "@/hooks/useFormikField";

const STATE = {
	DEFAULT: "DEFAULT",
	FOCUSED: "FOCUSED",
	ERROR: "ERROR"
} as const;
type InputState = (typeof STATE)[keyof typeof STATE];

type ImageInputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string | number;
};

export default function ImageInputField({ name, label, ...props }: ImageInputFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { field, meta, visualState, handleFocus, handleBlur } = useFormikField(name);
	const [dragState, setDragState] = useState<InputState>(STATE.DEFAULT);
	const [previewURL, setPreviewURL] = useState<string | null>(null);

	useEffect(() => {
		if (field.value instanceof File) {
			const url = URL.createObjectURL(field.value);
			setPreviewURL(url);
			return () => URL.revokeObjectURL(url);
		} else {
			setPreviewURL(null);
		}
	}, [field.value]);

	const currentState = dragState !== STATE.DEFAULT ? dragState : visualState;

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			field.onChange({ target: { name, value: file } });
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragState(STATE.FOCUSED);
	};
	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragState(STATE.FOCUSED);
	};
	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragState(STATE.DEFAULT);
	};
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			field.onChange({ target: { name, value: file } });
		}
		setDragState(STATE.DEFAULT);
	};

	const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
		if (previewURL) {
			e.preventDefault();
			if (inputRef.current) {
				inputRef.current.value = "";
			}
			setPreviewURL(null);
			field.onChange({ target: { name, value: "" } });
		}
	};

	const mergedHandleFocus = () => {
		handleFocus();
		setDragState(STATE.FOCUSED);
	};
	const mergedHandleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		handleBlur(e);
		setDragState(STATE.DEFAULT);
	};

	const borderClass = (() => {
		switch (currentState) {
			case STATE.DEFAULT:
				return field.value ? "border-blue-500" : "border-neutral-400";
			case STATE.FOCUSED:
				return field.value ? "border-blue-500" : "border-neutral-950";
			case STATE.ERROR:
				return "border-red-500";
			default:
				return "";
		}
	})();

	return (
		<div className="space-y-1">
			{/* Label */}
			<label htmlFor={name} className="block text-sm text-neutral-600">
				{label}
			</label>

			{/* Container Preview */}
			<div
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={clsx("overflow-hidden relative aspect-video rounded-sm border-2 border-dashed", borderClass)}
			>
				{/* Image Preview */}
				{previewURL && (
					<Image
						src={previewURL}
						alt="Preview"
						width={200}
						height={100}
						className="w-full h-full object-cover object-center"
						unoptimized
					/>
				)}

				{/* Input File */}
				<input
					ref={inputRef}
					id={name}
					name={name}
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					onClick={handleClick}
					onFocus={mergedHandleFocus}
					onBlur={mergedHandleBlur}
					aria-invalid={meta.touched && !!meta.error}
					aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					{...props}
				/>

				{/* Inner Text */}
				<span
					className={clsx(
						"pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 text-center text-neutral-400",
						{ "bg-neutral-900/75": previewURL }
					)}
				>
					{previewURL ? "Click to Remove" : "Select Image or Drag n Drop"}
				</span>

				{/* Error Message */}
				{meta.touched && meta.error && (
					<p className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs">{meta.error}</p>
				)}
			</div>
		</div>
	);
}

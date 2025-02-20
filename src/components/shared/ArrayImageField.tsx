"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useField } from "formik";

const STATE = {
	DEFAULT: "DEFAULT",
	FOCUSED: "FOCUSED",
	WARNING: "WARNING",
	ERROR: "ERROR"
} as const;
type InputState = (typeof STATE)[keyof typeof STATE];

type ArrayImageFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string | number;
};

export default function ArrayImageField({ name, label, ...props }: ArrayImageFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [currentState, setCurrentState] = useState<InputState>(STATE.DEFAULT);
	const [previews, setPreviews] = useState<string[]>([]);
	const [field, meta, helpers] = useField(name);

	const images: File[] = useMemo(() => (Array.isArray(field.value) ? field.value : []), [field.value]);

	useEffect(() => {
		const urls = images.map((file) => URL.createObjectURL(file));
		setPreviews(urls);
		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [images]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			helpers.setValue([...images, ...newFiles]);
			e.target.value = "";
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentState(STATE.FOCUSED);
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentState(STATE.FOCUSED);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentState(STATE.DEFAULT);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files) {
			const newFiles = Array.from(e.dataTransfer.files);
			helpers.setValue([...images, ...newFiles]);
		}
		setCurrentState(STATE.DEFAULT);
	};

	const removeImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		helpers.setValue(newImages);
	};

	const handleFocus = () => {
		setCurrentState(STATE.FOCUSED);
	};

	const handleBlur = () => {
		setCurrentState(STATE.DEFAULT);
	};

	const getBorderClass = () => {
		switch (currentState) {
			case STATE.FOCUSED:
				return images.length > 0 ? "border-blue-500" : "border-neutral-950";
			case STATE.WARNING:
				return "border-yellow-500";
			case STATE.ERROR:
				return "border-red-500";
			default:
				return images.length > 0 ? "border-blue-500" : "border-neutral-400";
		}
	};

	return (
		<div className="relative space-y-1">
			{/* Label */}
			<label htmlFor={name} className="block text-sm text-gray-600">
				{label}
			</label>

			{/* Container Input & Preview */}
			<div
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() => inputRef.current?.click()}
				className={`overflow-auto p-4 aspect-video rounded-sm border-2 border-dashed ${getBorderClass()}`}
			>
				<div className="w-full grid grid-cols-3 gap-2">
					{/* Images Preview */}
					{previews.map((url, i) => (
						<div key={i} className="overflow-hidden relative rounded-sm border border-blue-500">
							<Image
								src={url}
								alt={`Preview ${i}`}
								width={100}
								height={100}
								className="w-full aspect-video object-cover object-center"
								unoptimized
							/>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									removeImage(i);
								}}
								className="cursor-pointer absolute top-2 right-2 rounded-full bg-white px-2 text-lg text-red-500"
							>
								x
							</button>
						</div>
					))}
				</div>

				{/* Input File */}
				<input
					ref={inputRef}
					id={name}
					name={name}
					type="file"
					accept="image/*"
					multiple
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className="pointer-events-none absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					{...props}
				/>

				{/* Inner Text */}
				<span
					className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 text-center ${
						previews.length > 3 ? "bg-neutral-900/50 text-neutral-100" : "text-neutral-400"
					}`}
				>
					Select Multiple Images or Drag n Drop
				</span>

				{/* Error Message */}
				{meta.touched && meta.error && (
					<p className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs">{meta.error}</p>
				)}
			</div>
		</div>
	);
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { FormikFieldProps, useFormikField, CustomErrorText } from "@/hooks/useFormikField";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Modal } from "@/components/shared/Modal";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function ImageInputField({ name, label, ...props }: FormikFieldProps) {
	const {
		field: { value, onChange },
		meta: { error, touched },
		focused: { get: isFocused },
		handle,
		visualState
	} = useFormikField(name);
	const [previewURL, setPreviewURL] = useState<string | null>(null);
	const [showPreview, setShowPreview] = useState(false);

	useEffect(() => {
		if (value instanceof File) {
			const url = URL.createObjectURL(value);
			setPreviewURL(url);
			return () => URL.revokeObjectURL(url);
		}
		setPreviewURL(null);
	}, [value]);

	const { dragActive, dragHandler } = useDragAndDrop<HTMLLabelElement>({
		onDropFiles: (files) => {
			if (files[0]) {
				onChange({ target: { name, value: files[0] } });
			}
		}
	});

	const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		onChange({ target: { name, value: null } });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		e.target.files && e.target.files[0] && onChange({ target: { name, value: e.target.files[0] } });

	const handleClick = (e: React.MouseEvent<HTMLLabelElement>) => {
		if (value) {
			e.stopPropagation();
			e.preventDefault();
			setShowPreview(true);
		}
	};

	const borderClass =
		touched && error
			? "border-red-300"
			: dragActive || isFocused
			? value
				? "border-blue-300"
				: "border-neutral-600"
			: value
			? "border-blue-300"
			: "border-neutral-400";

	return (
		<div className="space-y-1">
			{/* Field Label */}
			<label htmlFor={name} className="text-sm text-neutral-800">
				{label}
			</label>

			{/* Dropzone */}
			<label
				{...dragHandler}
				onClick={handleClick}
				htmlFor={name}
				className={clsx(
					"overflow-hidden relative block size-full aspect-video rounded-sm border-2 border-dashed cursor-pointer",
					borderClass
				)}
			>
				{/* Placeholder */}
				{!previewURL && (
					<span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 text-center text-neutral-400">
						Select Image or Drag n Drop
					</span>
				)}

				{/* Hidden File Input */}
				<input
					key={value ? value.name : ""}
					id={name}
					name={name}
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					onFocus={handle.focus}
					onBlur={handle.blur}
					aria-invalid={touched && !!error}
					aria-describedby={touched && error ? `${name}-error` : undefined}
					className="absolute size-0 opacity-0"
					{...props}
				/>

				{previewURL && (
					<>
						{/* Image Preview */}
						<Image
							src={previewURL}
							alt="Preview"
							width={200}
							height={100}
							className="size-full object-cover object-center"
							unoptimized
						/>

						{/* Clear Button */}
						<button
							type="button"
							className="z-10 absolute top-0 right-0 p-2 bg-neutral-50/75 text-red-400 cursor-pointer"
							onClick={handleClear}
						>
							<Cross2Icon className="size-5" />
						</button>
					</>
				)}

				{/* Error Text */}
				<CustomErrorText name={name} error={error} visualState={visualState} />
			</label>

			{showPreview && (
				<Modal closeHandler={() => setShowPreview(false)}>
					<Image
						src={previewURL || ""}
						alt="Thumbnail Preview"
						width={1000}
						height={1000}
						unoptimized
						className="size-auto object-contain object-center"
					/>
				</Modal>
			)}
		</div>
	);
}

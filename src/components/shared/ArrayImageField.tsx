"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { FormikFieldProps, useFormikField, CustomErrorText } from "@/hooks/useFormikField";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Modal } from "@/components/shared/Modal";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function ArrayImageField({ name, label, ...props }: FormikFieldProps) {
	const {
		field: { value, onChange },
		meta: { error, touched },
		focused: { get: isFocused },
		handle,
		visualState
	} = useFormikField(name);

	const [previewURLs, setPreviewURLs] = useState<string[]>([]);
	const [selectedPreview, setSelectedPreview] = useState<string>("");

	useEffect(() => {
		const urls = value.map((file: File) => URL.createObjectURL(file));
		setPreviewURLs(urls);
		return () => urls.forEach((url: string) => URL.revokeObjectURL(url));
	}, [value]);

	const { dragActive, dragHandler } = useDragAndDrop<HTMLLabelElement>({
		onDropFiles: (files) => {
			if (files.length) {
				onChange({ target: { name, value: [...value, ...files] } });
			}
		}
	});

	const handleClear = (index: number) => {
		const newImages = value.filter((_: File, i: number) => i !== index);
		onChange({ target: { name, value: newImages } });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			onChange({ target: { name, value: [...value, ...newFiles] } });
			e.target.value = "";
		}
	};

	const handleClick = (e: React.MouseEvent, url: string) => {
		e.preventDefault();
		setSelectedPreview(url);
	};

	const borderClass =
		touched && error
			? "border-red-300"
			: dragActive || isFocused
			? value.length > 0
				? "border-blue-300"
				: "border-neutral-600"
			: value.length > 0
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
				onDragOver={dragHandler.dragOver}
				onDragEnter={dragHandler.dragEnter}
				onDragLeave={dragHandler.dragLeave}
				onDrop={dragHandler.drop}
				onClick={(e) => {
					if (e.target !== e.currentTarget) e.stopPropagation();
				}}
				htmlFor={name}
				className={clsx(
					"relative size-full aspect-video p-2 rounded-sm border-2 border-dashed cursor-pointer flex flex-col items-center",
					borderClass
				)}
			>
				{/* Placeholder */}
				<span className="pointer-events-none px-10 text-center text-neutral-400">
					Select Multiple Images or Drag n Drop
				</span>

				{/* Hidden File Input */}
				<input
					id={name}
					name={name}
					type="file"
					accept="image/*"
					multiple
					onChange={handleFileChange}
					onFocus={handle.focus}
					onBlur={handle.blur}
					className="absolute size-0 opacity-0"
					{...props}
				/>

				{/* Images Preview */}
				<div className="grid grid-cols-2 gap-2 h-fit overflow-auto">
					{previewURLs.map((url, i) => (
						<ImagePreview key={i} url={url} i={i} handleClear={handleClear} handleClick={handleClick} />
					))}
				</div>

				{/* Error Text */}
				<CustomErrorText name={name} error={error} visualState={visualState} />
			</label>

			{selectedPreview && (
				<Modal closeHandler={() => setSelectedPreview("")}>
					<Image
						src={selectedPreview}
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

function ImagePreview({
	url,
	i,
	handleClear,
	handleClick
}: {
	url: string;
	i: number;
	handleClear: (i: number) => void;
	handleClick: (e: React.MouseEvent, url: string) => void;
}) {
	return (
		<div className="relative" onClick={(e) => handleClick(e, url)}>
			<Image
				src={url}
				alt="Preview"
				width={200}
				height={100}
				className="size-full aspect-video object-cover object-center"
				unoptimized
			/>

			<button
				type="button"
				className="z-10 absolute top-0 right-0 p-1 bg-neutral-50/75 text-red-400 cursor-pointer"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleClear(i);
				}}
			>
				<Cross2Icon className="size-4" />
			</button>
		</div>
	);
}

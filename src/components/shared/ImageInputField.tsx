import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useField } from "formik";

const STATE = {
	DEFAULT: "DEFAULT",
	FOCUSED: "FOCUSED",
	WARNING: "WARNING",
	ERROR: "ERROR"
} as const;
type InputState = (typeof STATE)[keyof typeof STATE];

type ImageInputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string | number;
	name: string; // pastikan name selalu didefinisikan untuk Formik
};

export default function ImageInputField({ label, name, ...props }: ImageInputFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [currentState, setCurrentState] = useState<InputState>(STATE.DEFAULT);
	const [previewURL, setPreviewURL] = useState<string | null>(null);
	const [field, meta] = useField(name);

	useEffect(() => {
		// Jika field.value adalah File, buat blob URL untuk preview
		if (field.value instanceof File) {
			const url = URL.createObjectURL(field.value);
			setPreviewURL(url);
			return () => {
				URL.revokeObjectURL(url);
			};
		} else {
			setPreviewURL(null);
		}
	}, [field.value]);

	// Tangani perubahan file input dengan mengambil file object secara eksplisit
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			field.onChange({ target: { name, value: file } });
		}
	};

	const handleFocus = () => setCurrentState(STATE.FOCUSED);

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setCurrentState(STATE.DEFAULT);
		field.onBlur(e);
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

	// Tangani drop event dengan mengambil file object dari event
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			field.onChange({ target: { name, value: file } });
		}
		setCurrentState(STATE.DEFAULT);
	};

	// Jika sudah ada preview, klik pada input akan menghapus file
	const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
		if (previewURL) {
			e.preventDefault();
			if (inputRef.current) {
				inputRef.current.value = "";
			}
			setPreviewURL(null);
			// Kirimkan nilai kosong ke Formik untuk menghapus file
			field.onChange({ target: { name, value: "" } });
		}
	};

	const getBorderClass = () => {
		switch (currentState) {
			case STATE.DEFAULT:
				return field.value ? "border-blue-500" : "border-neutral-400";
			case STATE.FOCUSED:
				return field.value ? "border-blue-500" : "border-neutral-950";
			case STATE.WARNING:
				return "border-yellow-500";
			case STATE.ERROR:
				return "border-red-500";
			default:
				return "";
		}
	};

	return (
		<div className="space-y-1">
			{/* Label */}
			<label htmlFor={name} className="block text-sm text-gray-600">
				{label}
			</label>

			{/* Container Preview */}
			<div
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				style={{
					background: previewURL ? "none" : "linear-gradient(to top right, oklch(0.999 0 0), oklch(0.950 0 0))"
				}}
				className={`overflow-hidden relative aspect-video rounded-sm border ${getBorderClass()}`}
			>
				{/* Image Preview */}
				{previewURL && (
					<Image
						src={previewURL}
						alt="Preview"
						width={200}
						height={100}
						className="w-full h-full object-cover object-center"
						unoptimized // Menonaktifkan optimisasi Next.js untuk blob URL
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
					onFocus={handleFocus}
					onBlur={handleBlur}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					{...props}
				/>

				{/* Inner Text */}
				<span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">
					{previewURL ? "Click to remove" : "Select Image or Drag n Drop"}
				</span>

				{/* Error Message */}
				{meta.touched && meta.error && (
					<p className="absolute left-0 bottom-0 translate-y-full text-red-500 text-xs">{meta.error}</p>
				)}
			</div>
		</div>
	);
}

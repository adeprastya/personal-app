import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const state = {
	DEFAULT: "DEFAULT",
	FOCUSED: "FOCUSED",
	WARNING: "WARNING",
	ERROR: "ERROR"
} as const;
type InputState = (typeof state)[keyof typeof state];

type ImageInputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string | number;
	name: string;
	preview: File | string | null;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageInputField({ label, name, preview, onChange, ...props }: ImageInputFieldProps) {
	const ref = useRef<HTMLInputElement>(null);
	const [currentState, setCurrentState] = useState<InputState>(state.DEFAULT);
	const [isFilled, setIsFilled] = useState(false);
	const [previewURL, setPreviewURL] = useState<string | null>(null);

	useEffect(() => {
		if (preview instanceof File) {
			const url = URL.createObjectURL(preview);
			setPreviewURL(url);
			return () => {
				URL.revokeObjectURL(url);
			};
		} else if (typeof preview === "string") {
			setPreviewURL(preview);
		} else {
			setPreviewURL(null);
		}
	}, [preview]);

	const handleFocus = () => setCurrentState(state.FOCUSED);

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setCurrentState(state.DEFAULT);
		setIsFilled(e.target.value !== "");
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e);
		setIsFilled(e.target.value !== "");
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentState(state.FOCUSED);
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentState(state.FOCUSED);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentState(state.DEFAULT);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const fakeEvent = {
				target: {
					files: e.dataTransfer.files
				}
			} as React.ChangeEvent<HTMLInputElement>;
			onChange(fakeEvent);
			setIsFilled(true);
		}
		setCurrentState(state.DEFAULT);
	};

	const handleCLick = (e: React.MouseEvent<HTMLInputElement>) => {
		if (previewURL) {
			e.preventDefault();
			if (ref.current) {
				ref.current.value = "";
			}
			setPreviewURL(null);
			setIsFilled(false);

			const emptyFileList = new DataTransfer().files;
			const removalEvent = {
				target: { name, files: emptyFileList }
			} as React.ChangeEvent<HTMLInputElement>;
			onChange(removalEvent);
		}
	};

	const getBorderClass = () => {
		switch (currentState) {
			case state.DEFAULT:
				return isFilled ? "border-blue-500" : "border-neutral-400";
			case state.FOCUSED:
				return isFilled ? "border-blue-500" : "border-neutral-950";
			case state.WARNING:
				return "border-yellow-500";
			case state.ERROR:
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
					/>
				)}

				{/* Input File */}
				<input
					ref={ref}
					id={name}
					name={name}
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					onClick={handleCLick}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					{...props}
				/>

				{/* Text */}
				<span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">
					{previewURL ? "Click to remove" : "Select Image or Drag n Drop"}
				</span>
			</div>
		</div>
	);
}

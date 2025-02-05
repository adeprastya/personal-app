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
	preview: File | null;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageInputField({ label, name, preview, onChange, ...props }: ImageInputFieldProps) {
	const [currentState, setCurrentState] = useState<InputState>(state.DEFAULT);
	const [isFilled, setIsFilled] = useState(false);
	const [previewURL, setPreviewURL] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (preview) {
			const url = URL.createObjectURL(preview);
			setPreviewURL(url);
			return () => {
				URL.revokeObjectURL(url);
			};
		} else {
			setPreviewURL(null);
		}
	}, [preview]);

	const handleFocus = () => {
		setCurrentState(state.FOCUSED);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setIsFilled(value !== "");
		setCurrentState(state.DEFAULT);
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

	return (
		<div className="space-y-1">
			{/* Label */}
			<label htmlFor={name} className="block text-sm text-gray-600">
				{label}
			</label>

			{/* Container Preview */}
			<div
				className={`overflow-hidden relative aspect-video rounded-sm border 
          ${currentState === state.DEFAULT ? (isFilled ? "border-blue-500" : "border-neutral-400") : ""}
          ${currentState === state.FOCUSED ? (isFilled ? "border-blue-500" : "border-neutral-950") : ""}
          ${currentState === state.WARNING ? "border-yellow-500" : ""}
          ${currentState === state.ERROR ? "border-red-500" : ""}
        `}
				style={{
					background: previewURL ? "none" : "linear-gradient(to top right, oklch(0.999 0 0), oklch(0.950 0 0))"
				}}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
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
					ref={inputRef}
					id={name}
					name={name}
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					{...props}
				/>

				<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">
					Select Image or Drag n Drop
				</span>
			</div>
		</div>
	);
}

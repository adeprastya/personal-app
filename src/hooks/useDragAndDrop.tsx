import { useState } from "react";

interface UseDragAndDropOptions {
	onDropFiles?: (files: FileList) => void;
}

export function useDragAndDrop<T extends HTMLElement = HTMLElement>({ onDropFiles }: UseDragAndDropOptions) {
	const [dragActive, setDragActive] = useState(false);

	const stopEvent = (e: React.DragEvent<T>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	};

	const handleDragOver = (e: React.DragEvent<T>) => stopEvent(e);

	const handleDragEnter = (e: React.DragEvent<T>) => {
		stopEvent(e);
		setDragActive(true);
	};

	const handleDragLeave = (e: React.DragEvent<T>) => {
		stopEvent(e);
		setDragActive(false);
	};

	const handleDrop = (e: React.DragEvent<T>) => {
		stopEvent(e);
		if (onDropFiles && e.dataTransfer.files && e.dataTransfer.files.length > 0) onDropFiles(e.dataTransfer.files);
		setDragActive(false);
	};

	return {
		dragActive,
		dragHandler: {
			onDragEnter: handleDragEnter,
			onDragLeave: handleDragLeave,
			onDragOver: handleDragOver,
			onDrop: handleDrop
		}
	};
}

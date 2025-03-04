import EditableImage from "./EditableImage";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

interface EditableArrayImageProps {
	srcs: string[];
	onParentUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>;
	onParentDrop?: (files: FileList) => void | Promise<void>;
	onChildUpdate: (e: React.ChangeEvent<HTMLInputElement>, ...args: Array<unknown>) => void | Promise<void>;
	onChildDrop?: (files: FileList, ...args: Array<unknown>) => void | Promise<void>;
	onChildDelete?: (...args: Array<unknown>) => void | Promise<void>;
}

export default function EditableArrayImage({
	srcs,
	onParentUpdate,
	onParentDrop,
	onChildUpdate,
	onChildDrop,
	onChildDelete
}: EditableArrayImageProps) {
	const { dragHandler } = useDragAndDrop({ onDropFiles: onParentDrop });

	return (
		<label
			{...dragHandler}
			htmlFor={srcs.join("")}
			className="relative w-full p-2 rounded-sm border-2 border-dashed border-neutral-400 grid grid-cols-2 gap-2"
		>
			<p className="col-span-2 py-2 text-center text-neutral-400">Click or Drag n Drop here to add images</p>

			<input id={srcs.join("")} type="file" accept="image/*" multiple onChange={onParentUpdate} className="hidden" />

			{srcs.map((src, i) => (
				<EditableImage
					key={src + i}
					src={src}
					onUpdate={onChildUpdate}
					onDropFiles={(files: FileList) => onChildDrop && onChildDrop(files, src)}
					onDelete={onChildDelete}
				/>
			))}
		</label>
	);
}

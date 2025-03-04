import Image from "next/image";
import { Modal } from "@/components/shared/Modal";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

interface EditableImageProps {
	src: string;
	onUpdate: (e: React.ChangeEvent<HTMLInputElement>, ...args: Array<unknown>) => void | Promise<void>;
	onDropFiles?: (files: FileList, ...args: Array<unknown>) => void | Promise<void>;
	onDelete?: (...args: Array<unknown>) => void | Promise<void>;
}

export default function EditableImage({ src, onUpdate, onDropFiles, onDelete }: EditableImageProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { dragHandler } = useDragAndDrop({ onDropFiles });

	return (
		<div>
			<div className="overflow-clip relative w-full aspect-video rounded-sm border border-neutral-400 flex items-center justify-center group cursor-pointer">
				{/* Image */}
				<Image
					{...dragHandler}
					onClick={() => setIsModalOpen(true)}
					src={`${src}?t=${Date.now()}`}
					alt="Thumbnail Image"
					width={800}
					height={450}
					unoptimized
					className="size-full aspect-video object-cover rounded-xs"
				/>

				{/* Edit & Delete Buttons */}
				<div className="absolute top-0 right-0 divide-y divide-neutral-400 border-b border-s border-neutral-400 bg-white/75 text-neutral-800 flex flex-col">
					<label htmlFor={`update-${src}`} className="p-2 relative cursor-pointer">
						<Pencil2Icon className="size-4 cursor-pointer" />
						<input
							id={`update-${src}`}
							type="file"
							accept="image/*"
							onChange={(e) => onUpdate(e, src as string)}
							className="hidden"
						/>
					</label>

					{onDelete && (
						<button onClick={() => onDelete(src as string)} className="p-2 cursor-pointer">
							<TrashIcon className="size-4 cursor-pointer" />
						</button>
					)}
				</div>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<Modal closeHandler={() => setIsModalOpen(false)}>
					<Image
						src={`${src}?t=${Date.now()}`}
						alt="Thumbnail Image Full Size"
						width={1600}
						height={900}
						unoptimized
						className="size-auto object-contain"
					/>
				</Modal>
			)}
		</div>
	);
}

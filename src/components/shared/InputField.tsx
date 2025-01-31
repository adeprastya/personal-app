type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> &
	React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
		label: string | number;
		name: string;
		type?: React.InputHTMLAttributes<HTMLInputElement>["type"] | "textarea";
		onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	};

export default function InputField({
	name,
	label,
	onChange,
	type = "text",
	required = false,
	placeholder = "",
	className,
	...props
}: InputFieldProps) {
	return (
		<label htmlFor={name} className="relative">
			{type !== "textarea" ? (
				<input
					id={name}
					name={name}
					type={type}
					required={required}
					placeholder={placeholder}
					onChange={onChange}
					className={`peer px-3 ${className}`}
					{...props}
				></input>
			) : (
				<textarea
					id={name}
					name={name}
					required={required}
					placeholder={placeholder}
					onChange={onChange}
					className={`peer h-20 px-3 ${className}`}
					{...props}
				/>
			)}

			<span
				className="absolute px-1 left-2 leading-none transition-all bg-neutral-50 
			top-0 -translate-y-3/5 font-semibold tracking-wider text-xs text-neutral-950 
			peer-[&:focus]:top-0 peer-[&:focus]:-translate-y-3/5 peer-[&:focus]:font-semibold peer-[&:focus]:tracking-wider peer-[&:focus]:text-xs peer-[&:focus]:text-neutral-950 
			peer-placeholder-shown:top-0 peer-placeholder-shown:translate-y-1/2 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500"
			>
				{label}
				{required && <span className="ml-1 font-bold text-red-500">*</span>}
			</span>
		</label>
	);
}

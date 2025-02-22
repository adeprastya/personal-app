import { useState } from "react";
import { useField } from "formik";

export type FieldState = "DEFAULT" | "FOCUSED" | "ERROR";

export function useFormikField(name: string) {
	const [field, meta, helpers] = useField(name);
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => setIsFocused(true);

	const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setIsFocused(false);
		field.onBlur(e);
	};

	const visualState: FieldState = meta.error ? "ERROR" : isFocused ? "FOCUSED" : "DEFAULT";

	return { field, meta, helpers, isFocused, visualState, handleFocus, handleBlur };
}

import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
if (!BACKEND_URL) {
	throw new Error("Env variable BACKEND_URL is not defined");
}

export default function useFetch<T = unknown>(
	method: AxiosRequestConfig["method"],
	url: AxiosRequestConfig["url"],
	options: AxiosRequestConfig = {}
) {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<AxiosError | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log("__useFetch__ useEffect Running...");

		const fetch = async () => {
			setLoading(true);

			try {
				const res = await axios({
					method,
					url: BACKEND_URL + url,
					...options
				});
				setData(res.data);
			} catch (err) {
				setError(err as AxiosError);
			} finally {
				setLoading(false);
			}
		};

		fetch();
		// eslint-disable-next-line
	}, [method, url]);

	return { data, error, loading };
}

export const axiosFetch = async (
	method: AxiosRequestConfig["method"],
	url: AxiosRequestConfig["url"],
	options: AxiosRequestConfig = {}
) => {
	const result = {
		result: null as unknown,
		error: null as AxiosError | null
	};

	try {
		console.log("__useFetch__ axiosFetch Running...");

		const res = await axios({
			method,
			url: BACKEND_URL + url,
			...options
		});

		result.result = res.data;
	} catch (err) {
		result.error = err as AxiosError;
	}
	return result;
};

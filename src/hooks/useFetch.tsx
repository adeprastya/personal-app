"use client";

import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { useState, useEffect } from "react";

export default function useFetch<T>(config: AxiosRequestConfig) {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<AxiosError | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log("__useFetch__ useEffect Running...");

		const fetch = async () => {
			setLoading(true);

			try {
				const res = await axios(config);
				setData(res.data);
			} catch (err) {
				setError(err as AxiosError);
			} finally {
				setLoading(false);
			}
		};

		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { data, error, loading };
}

export async function axiosFetch<T>(config: AxiosRequestConfig) {
	const result = {
		result: null as T | null,
		error: null as AxiosError | null
	};

	try {
		console.log("__useFetch__ axiosFetch Running...");

		const res = await axios(config);

		result.result = res.data;
	} catch (err) {
		result.error = err as AxiosError;
	}
	return result;
}

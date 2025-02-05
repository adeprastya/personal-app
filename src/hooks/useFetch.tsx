"use client";

import { ErrorResponse, SuccessResponse } from "@/types/ApiResponse";
import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { useState, useEffect } from "react";

export default function useFetch<T>(config: AxiosRequestConfig) {
	const [data, setData] = useState<SuccessResponse<T> | null>(null);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [refetcher, setRefetcher] = useState(false);

	const refetch = () => setRefetcher(!refetcher);

	useEffect(() => {
		console.log("__useFetch__ useEffect Running...");

		const fetchData = async () => {
			setLoading(true);

			try {
				const res = await axios(config);
				setData(res.data);
			} catch (err) {
				setError((err as AxiosError).response?.data as ErrorResponse);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetcher]);

	return { data, error, loading, refetch };
}

export async function axiosFetch<T>(config: AxiosRequestConfig) {
	const result = {
		data: null as SuccessResponse<T> | null,
		error: null as ErrorResponse | null
	};

	try {
		console.log("__useFetch__ axiosFetch Running...");

		const res = await axios(config);

		result.data = res.data;
	} catch (err) {
		console.log(err);

		result.error = (err as AxiosError).response?.data as ErrorResponse;
	}
	return result;
}

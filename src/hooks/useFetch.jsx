import { useState, useEffect } from "react";

import { handleFetch } from "../utils/handleFetch";

const useFetch = url => {
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		(async () => {
			try {
				const result = await handleFetch(url, signal);
				result.success ? setData(result.data) : setError(true);
			} catch (err) {
				!signal.aborted && setError(true);
			} finally {
				setLoading(false);
			}
		})();
		return () => controller.abort();
	}, [url]);
	return { data, error, loading };
};

export default useFetch;

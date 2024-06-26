import { useState, useEffect } from "react";

import handleFetch from "../utils/handleFetch";

const useFetch = url => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		(async () => {
			try {
				const result = await handleFetch(url, { signal });

				result.success
					? setData(result.data)
					: setError(result.message);

				setLoading(false);
			} catch (err) {
				!signal.aborted && setError(err);
				!signal.aborted && setLoading(false);
			}
		})();
		return () => controller.abort();
	}, [url]);
	return { data, error, loading };
};

export default useFetch;

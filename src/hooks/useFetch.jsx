import { useState, useEffect } from "react";

import handleFetch from "../utils/handleFetch";

const useFetch = url => {
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		(async () => {
			try {
				setData(await handleFetch(url, { signal }));
				setLoading(false);
			} catch (err) {
				!signal.aborted && setError(err.cause);
				!signal.aborted && setLoading(false);
			}
		})();
		return () => controller.abort();
	}, [url]);
	return { data, error, loading };
};

export default useFetch;

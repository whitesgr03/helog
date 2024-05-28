const handleFetch = async (url, option) => {
	const response = await fetch(url, { ...option });

	const result = await response.json();

	!result.success &&
		(() => {
			throw new Error("Fetch Error", {
				cause: result.errors ?? result.message,
			});
		})();

	return result.data;
};

export { handleFetch };

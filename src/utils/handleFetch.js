export const handleFetch = async (url, options) => {
	const response = await fetch(url, options).catch(error => {
		throw new Error('fetch error', { cause: error });
	});

	if (!response.ok)
		throw new Error('response status error', { cause: response });

	return response.json();
};

export const handleFetch = async (url, options) => {
	const response = await fetch(url, options).catch(error => {
		throw new Error(error);
	});

	if (!response.ok) throw new Error(response.status);

	return response.json();
};

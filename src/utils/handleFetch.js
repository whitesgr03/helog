const handleFetch = async (url, option) => {
	const response = await fetch(url, { ...option });

	return await response.json();
};

export default handleFetch;

export const handleFetch = async (url, option) => {
	try {
		const response = await fetch(url, { ...option });
		return await response.json();
	} catch (err) {
		return (
			!option.signal.aborted && {
				success: false,
				message: err,
			}
		);
	}
};

import { handleFetch } from './handleFetch';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/user`;

export const getUser = async ({ signal }) => {
	const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return await handleFetch(url, options);
};
export const updateUser = async fields => {
	const options = {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(fields),
	};
	return await handleFetch(url, options);
};
export const deleteUser = async () => {
	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return await handleFetch(url, options);
};

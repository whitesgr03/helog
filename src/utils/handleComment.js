import { handleFetch } from './handleFetch';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/comments`;

export const createComment = async ({ data }) => {
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	return await handleFetch(url, options);
};
export const updateComment = async ({ data, commentId }) => {
	const options = {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/${commentId}`, options);
};
export const deleteComment = async ({ commentId }) => {
	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return await handleFetch(`${url}/${commentId}`, options);
};

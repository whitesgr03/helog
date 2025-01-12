import { handleFetch } from './handleFetch';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const getComments = async ({ skip, signal, postId }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};
	return await handleFetch(`${url}/${postId}/comments?skip=${skip}`, options);
};

export const createComment = async ({ postId, data }) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/${postId}/comments`, options);
};

export const updateComment = async ({ commentId, data }) => {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/${postId}/comments/${commentId}`, options);
};

export const deleteComment = async ({ commentId }) => {
	const options = {
		method: 'DELETE',
		credentials: 'include',
	};
	return await handleFetch(`${url}/${postId}/comments/${commentId}`, options);
};

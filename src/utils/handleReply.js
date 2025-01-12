import { handleFetch } from './handleFetch';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog`;

export const getReplies = async ({ skip, commentId }) => {
	const options = {
		method: 'GET',
		credentials: 'include',
	};
	return await handleFetch(
		`${url}/comments/${commentId}/replies?skip=${skip}`,
		options,
	);
};

export const replyComment = async ({ commentId, data }) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/comments/${commentId}/replies`, options);
};

export const createReply = async ({ replyId, data }) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/replies/${replyId}`, options);
};

export const updateReply = async ({ data, replyId }) => {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/replies/${replyId}`, options);
};

export const deleteReply = async ({ replyId }) => {
	const options = {
		method: 'DELETE',
		credentials: 'include',
	};
	return await handleFetch(`${url}/replies/${replyId}`, options);
};

import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog`;

export const getComments = async ({ skip, signal, postId }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};
	return await handleFetch(
		`${url}/posts/${postId}/comments?skip=${skip}`,
		options,
	);
};

export const createComment = async ({ postId, data }) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': Cookies.get('token'),
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/posts/${postId}/comments`, options);
};

export const updateComment = async ({ commentId, data }) => {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': Cookies.get('token'),
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/comments/${commentId}`, options);
};

export const deleteComment = async ({ commentId }) => {
	const options = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN': Cookies.get('token'),
		},
		credentials: 'include',
	};
	return await handleFetch(`${url}/comments/${commentId}`, options);
};

import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const URL = `${import.meta.env.VITE_RESOURCE_URL}/blog`;

export const getComments =
	postId =>
	async ({ pageParam: skip, signal }) => {
		const options = {
			method: 'GET',
			signal,
			credentials: 'include',
		};

		return await handleFetch(
			`${URL}/posts/${postId}/comments?skip=${skip}`,
			options,
		);
	};

export const createComment = postId => async fields => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
		body: JSON.stringify(fields),
	};
	const validStatus = [400];

	return await handleFetch(
		`${URL}/posts/${postId}/comments`,
		options,
		validStatus,
	);
};

export const updateComment = commentId => async fields => {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
		body: JSON.stringify(fields),
	};

	const validStatus = [400];

	return await handleFetch(
		`${URL}/comments/${commentId}`,
		options,
		validStatus,
	);
};

export const deleteComment = async ({ commentId }) => {
	const options = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
	};
	return await handleFetch(`${URL}/comments/${commentId}`, options);
};

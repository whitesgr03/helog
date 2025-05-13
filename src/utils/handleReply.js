import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog`;

export const getReplies =
	commentId =>
	async ({ pageParam: skip, signal }) => {
		const options = {
			method: 'GET',
			credentials: 'include',
			signal,
		};

		return await handleFetch(
			`${url}/comments/${commentId}/replies?skip=${skip}`,
			options,
		);
	};

export const replyComment = commentId => async fields => {
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
		`${url}/comments/${commentId}/replies`,
		options,
		validStatus,
	);
};

export const createReply = replyId => async fields => {
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
	return await handleFetch(`${url}/replies/${replyId}`, options, validStatus);
};

export const updateReply = replyId => async fields => {
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

	return await handleFetch(`${url}/replies/${replyId}`, options, validStatus);
};

export const deleteReply = replyId => async () => {
	const options = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
	};

	return await handleFetch(`${url}/replies/${replyId}`, options);
};

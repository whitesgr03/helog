import { QueryFunctionContext } from '@tanstack/react-query';
import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const URL = `${import.meta.env.VITE_RESOURCE_URL}/blog`;

export const getComments = async ({
	queryKey,
	pageParam: skip,
	signal,
}: QueryFunctionContext) => {
	const [, postId] = queryKey;

	const options: RequestInit = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(
		`${URL}/posts/${postId}/comments?skip=${skip}`,
		options,
	);
};

export const createComment = async ({
	postId,
	formFields,
}: {
	postId: string;
	formFields: {
		content: string;
	};
}) => {
	const options: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
		body: JSON.stringify(formFields),
	};
	const validStatus = [400];

	return await handleFetch(
		`${URL}/posts/${postId}/comments`,
		options,
		validStatus,
	);
};

export const updateComment = async ({
	commentId,
	formFields,
}: {
	commentId: string;
	formFields: {
		content: string;
	};
}) => {
	const options: RequestInit = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
		body: JSON.stringify(formFields),
	};

	const validStatus = [400];

	return await handleFetch(
		`${URL}/comments/${commentId}`,
		options,
		validStatus,
	);
};

export const deleteComment = async (commentId: string) => {
	const options: RequestInit = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
	};
	return await handleFetch(`${URL}/comments/${commentId}`, options);
};

import { QueryFunctionContext } from '@tanstack/react-query';
import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog`;

export const getReplies = async ({
	queryKey,
	pageParam: skip,
	signal,
}: QueryFunctionContext) => {
	const [, commentId] = queryKey;

	const options: RequestInit = {
		method: 'GET',
		credentials: 'include',
		signal,
	};
	return await handleFetch(
		`${url}/comments/${commentId}/replies?skip=${skip}`,
		options,
	);
};

export const createReply = async ({
	formFields,
	commentId,
	replyId,
}: {
	formFields: {
		content: string;
	};
	commentId?: string;
	replyId?: string;
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
		replyId
			? `${url}/replies/${replyId}`
			: `${url}/comments/${commentId}/replies`,
		options,
		validStatus,
	);
};

export const updateReply = async ({
	replyId,
	formFields,
}: {
	replyId: string;
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

	return await handleFetch(`${url}/replies/${replyId}`, options, validStatus);
};

export const deleteReply = async (replyId: string) => {
	const options: RequestInit = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
	};

	return await handleFetch(`${url}/replies/${replyId}`, options);
};

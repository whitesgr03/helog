import { QueryFunctionContext } from '@tanstack/react-query';
import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const URL = `${import.meta.env.VITE_RESOURCE_URL}/user`;

export const getUserInfo = async ({ signal }: QueryFunctionContext) => {
	const options: RequestInit = {
		method: 'GET',
		signal,
		headers: {
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
	};

	return await handleFetch(URL, options);
};

export const updateUserInfo = async (formFields: { displayName: string }) => {
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

	const validStatus = [400, 409];

	return await handleFetch(URL, options, validStatus);
};

export const deleteUser = async () => {
	const options: RequestInit = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
	};

	return await handleFetch(URL, options);
};

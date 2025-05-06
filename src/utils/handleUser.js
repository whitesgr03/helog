import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const URL = `${import.meta.env.VITE_RESOURCE_URL}/user`;

export const getUserInfo = async ({ signal }) => {
	const options = {
		method: 'GET',
		signal,
		headers: {
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
	};

	return await handleFetch(URL, options);
};

export const updateUserInfo = async fields => {
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

	const validStatus = [400, 409];

	return await handleFetch(URL, options, validStatus);
};

export const deleteUser = async () => {
	const options = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
	};

	return await handleFetch(URL, options);
};

import { handleFetch } from './handleFetch';
import { QueryFunctionContext } from '@tanstack/react-query';

const URL = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const getPosts = async ({
	pageParam: skip,
	signal,
}: QueryFunctionContext) => {
	const options: RequestInit = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(`${URL}?skip=${skip}`, options);
};

export const getPostDetail = async ({
	queryKey,
	signal,
}: QueryFunctionContext) => {
	const [, postId] = queryKey;

	const options: RequestInit = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	// if (skip && skip === 100)
	// throw Error();
	return await handleFetch(`${URL}/${postId}`, options);
};

import { handleFetch } from './handleFetch';

const URL = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const getPosts = async ({ pageParam: skip, signal }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(`${URL}?skip=${skip}`, options);
};

export const getPostDetail = async ({ queryKey, signal }) => {
	const [, postId] = queryKey;

	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(`${URL}/${postId}`, options);
};

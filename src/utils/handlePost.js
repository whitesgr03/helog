import { handleFetch } from './handleFetch';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const getPosts = async ({ skip, signal }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};
	return await handleFetch(`${url}?skip=${skip}`, options);
};

export const getPostDetail = async ({ postId, signal }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};
	return await handleFetch(`${url}/${postId}`, options);
};

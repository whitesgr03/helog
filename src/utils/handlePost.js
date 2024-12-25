import { handleFetch } from './handleFetch';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const getPosts = async ({ limit, signal }) => {
	const options = {
		method: "GET",
		signal,
	};
	return await handleFetch(`${url}?limit=${limit}`, options);
};

export const getPostDetail = async ({ postId, signal }) => {
	const options = {
		method: "GET",
		signal,
	};
	return await handleFetch(`${url}/${postId}`, options);
};

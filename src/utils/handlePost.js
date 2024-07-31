import handleFetch from "./handleFetch";

const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/blog/posts`;

const getPosts = async ({ limit, signal }) => {
	const options = {
		method: "GET",
		signal,
	};
	return await handleFetch(`${url}?limit=${limit}`, options);
};

const getPostDetail = async ({ postId, signal }) => {
	const options = {
		method: "GET",
		signal,
	};
	return await handleFetch(`${url}/${postId}`, options);
};

export { getPosts, getPostDetail };

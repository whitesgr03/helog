import handleFetch from "./handleFetch";

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/replies`;

const createReply = async ({ token, data }) => {
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	return await handleFetch(url, options);
};
const updateReply = async ({ token, data, replyId }) => {
	const options = {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/${replyId}`, options);
};
const deleteReply = async ({ token, replyId }) => {
	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return await handleFetch(`${url}/${replyId}`, options);
};

export { createReply, updateReply, deleteReply };

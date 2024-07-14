import generateRandomString from "./generateRandomString";
import generateCodeChallenge from "./generateCodeChallenge";

const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/auth`;

const handleGetAuthCode = async () => {

	const authorizeOption = {
		state: generateRandomString(),
		code_verifier: generateRandomString(),
		code_challenge_method: "S256",
	};
	authorizeOption.code_challenge = await generateCodeChallenge(
		authorizeOption.code_verifier
	);

	const darkTheme = JSON.parse(localStorage.getItem("heLog.darkTheme"))
		? 1
		: 0;

	sessionStorage.setItem("state", authorizeOption.state);
	sessionStorage.setItem("code_verifier", authorizeOption.code_verifier);

	window.location.replace(
		`${url}/code` +
			`?state=${authorizeOption.state}` +
			`&code_challenge=${authorizeOption.code_challenge}` +
			`&code_challenge_method=${authorizeOption.code_challenge_method}` +
			`&redirect_url=${window.location.origin}/callback` +
			`&darkTheme=${darkTheme}`
	);
};

export default handleGetAuthCode;

// const handleGetPosts = async (authorId = false) => {
// 	const url = `http://localhost:3000/blog/posts/${
// 		authorId ? `?author=${authorId}` : ""
// 	}`;
// 	try {
// 		const response = await fetch(url);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleGetPosts", result)
// 			: console.error("handleGetPosts", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleGetPost = async postId => {
// 	const url = `http://localhost:3000/blog/posts/${postId}`;
// 	try {
// 		const response = await fetch(url);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleGetPosts", result)
// 			: console.error("handleGetPosts", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleCreatePosts = async token => {
// 	const url = "http://localhost:3000/blog/posts";
// 	try {
// 		const fetchOptions = {
// 			method: "POST",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				title: "This is title222",
// 				content: "Hello world222!",
// 				publish: true,
// 			}),
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleCreatePosts", result)
// 			: console.error("handleCreatePosts", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleUpdatePost = async ({ token, postId }) => {
// 	const url = `http://localhost:3000/blog/posts/${postId}`;
// 	try {
// 		const fetchOptions = {
// 			method: "PUT",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				title: "77777",
// 				content: "66666",
// 				publish: true,
// 			}),
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleUpdatePost", result)
// 			: console.error("handleUpdatePost", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleDeletePost = async ({ token, postId }) => {
// 	const url = `http://localhost:3000/blog/posts/${postId}`;
// 	try {
// 		const fetchOptions = {
// 			method: "DELETE",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleDeletePost", result)
// 			: console.error("handleDeletePost", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// const handleGetComments = async postId => {
// 	const url = `http://localhost:3000/blog/posts/${postId}/comments`;
// 	try {
// 		const response = await fetch(url);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleGetPosts", result)
// 			: console.error("handleGetPosts", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleCreateComments = async ({ token, postId }) => {
// 	const url = `http://localhost:3000/blog/posts/${postId}/comments`;
// 	try {
// 		const fetchOptions = {
// 			method: "POST",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				content: "This is second comment!!",
// 			}),
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleCreatePosts", result)
// 			: console.error("handleCreatePosts", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleCreateCommentReplies = async ({
// 	token,
// 	postId,
// 	commentId,
// }) => {
// 	const url = `http://localhost:3000/blog/posts/${postId}/comments/${commentId}`;
// 	try {
// 		const fetchOptions = {
// 			method: "POST",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				content: "This is first reply comment!!",
// 			}),
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleCreatePosts", result)
// 			: console.error("handleCreatePosts", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleUpdateComments = async ({ token, postId, commentId }) => {
// 	const url = `http://localhost:3000/blog/posts/${postId}/comments/${commentId}`;
// 	try {
// 		const fetchOptions = {
// 			method: "PUT",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				content: "This is first comment!!",
// 			}),
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleUpdateComments", result)
// 			: console.error("handleUpdateComments", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleDeleteComments = async ({ token, postId, commentId }) => {
// 	const url = `http://localhost:3000/blog/posts/${postId}/comments/${commentId}`;
// 	try {
// 		const fetchOptions = {
// 			method: "Delete",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleDeleteComments", result)
// 			: console.error("handleDeleteComments", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// const handleUpdateUser = async ({ token, name }) => {
// 	const url = "http://localhost:3000/blog/users";
// 	try {
// 		const fetchOptions = {
// 			method: "PUT",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				name,
// 			}),
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleUpdateUser", result)
// 			: console.error("handleUpdateUser", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
// const handleDeleteUser = async token => {
// 	const url = "http://localhost:3000/blog/users";
// 	try {
// 		const fetchOptions = {
// 			method: "DELETE",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		};

// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();
// 		result.success
// 			? console.log("handleDeleteUser", result)
// 			: console.error("handleDeleteUser", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// const handleAuthToken = async token => {
// 	try {
// 		const fetchOptions = {
// 			method: "GET",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		};
// 		const response = await fetch(tokenURL, fetchOptions);
// 		const result = await response.json();

// 		result.success
// 			? console.log("handleAuthToken", result)
// 			: console.error("handleAuthToken", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// const handleGetUser = async token => {
// 	const url = "http://localhost:3000/blog/users";
// 	try {
// 		const fetchOptions = {
// 			method: "GET",
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		};
// 		const response = await fetch(url, fetchOptions);
// 		const result = await response.json();

// 		// sessionStorage.setItem("heLog-login", 'true');

// 		// result.success
// 		// 	? console.log("handleGetUserInfo", result)
// 		// 	: console.error("handleGetUserInfo", result.message);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

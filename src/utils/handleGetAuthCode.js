import generateRandomString from "./generateRandomString";
import generateCodeChallenge from "./generateCodeChallenge";

const url = `${import.meta.env.VITE_RESOURCE_URL}/auth/code`;

const handleGetAuthCode = async () => {
	const authorizeOption = {
		state: generateRandomString(),
		code_verifier: generateRandomString(),
		code_challenge_method: "S256",
	};
	authorizeOption.code_challenge = await generateCodeChallenge(
		authorizeOption.code_verifier
	);

	const darkTheme = JSON.parse(localStorage.getItem("heLog.darkTheme"));

	const queries =
		`state=${authorizeOption.state}` +
		`&code_challenge=${authorizeOption.code_challenge}` +
		`&code_challenge_method=${authorizeOption.code_challenge_method}` +
		`&redirect_url=${window.location.origin}/callback` +
		`&darkTheme=${darkTheme}`;

	sessionStorage.setItem("state", authorizeOption.state);
	sessionStorage.setItem("code_verifier", authorizeOption.code_verifier);

	window.location.replace(`${url}?${queries}`);
};

export default handleGetAuthCode;

import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";

import style from "../styles/App.module.css";

import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";


import handleFetch from "../utils/handleFetch";
import handleColorScheme from "../utils/handleColorScheme";

const GET_USER_URL = "http://localhost:3000/blog/users/user";

const App = () => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [darkTheme, setDarkTheme] = useState(
		JSON.parse(localStorage.getItem("darkTheme")) ?? handleColorScheme
	);

	const handleSwitchColorTheme = () => {
		localStorage.setItem("darkTheme", JSON.stringify(!darkTheme));
		setDarkTheme(!darkTheme);
	};

	const handleGetUser = useCallback(async () => {
		try {
			const data = await handleFetch(GET_USER_URL, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUser(data);
		} catch (err) {
			console.error(err.cause);
		}
	}, [token]);

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem("token"));
		const getToken = () =>
			Date.now() > data.exp
				? localStorage.removeItem("token")
				: setToken(data.token);

		data && getToken();
	}, []);

	useEffect(() => {
		token ? handleGetUser() : setUser(null);
	}, [token, handleGetUser]);

	return (
		<div className={` ${darkTheme ? "dark" : ""} ${style.app}`}>
				<Header
					darkTheme={darkTheme}
					handleSwitchColorTheme={handleSwitchColorTheme}
				/>
			<div className={style.container}>
				<main>
					<Outlet context={{ setToken }} />
				</main>
				<Contact />
				<Footer />
			</div>
		</div>
	);
};

export default App;

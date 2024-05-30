import { useState, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import style from "../styles/Layout.module.css";

import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";

import handleFetch from "../utils/handleFetch";
import handleColorScheme from "../utils/handleColorScheme";

const getUserUrl = "http://localhost:3000/blog/user/";

const Main = () => {
	const { posts } = useOutletContext();
	const [darkTheme, setDarkTheme] = useState(
		JSON.parse(localStorage.getItem("darkTheme")) ?? handleColorScheme
	);
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);

	const handleSwitchColorTheme = () => {
		localStorage.setItem("darkTheme", JSON.stringify(!darkTheme));
		setDarkTheme(!darkTheme);
	};

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem("token"));

		const getToken = () =>
			Date.now() > data.exp
				? localStorage.removeItem("token")
				: setToken(data.token);

		data && getToken();
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;
		token &&
			(async () => {
				try {
					const data = await handleFetch(getUserUrl, {
						signal,
						headers: { Authorization: `Bearer ${token}` },
					});

					setUser(data);
				} catch (err) {
					!signal.aborted && console.log(err.cause);
				}
			})();
		return () => controller.abort();
	}, [token]);

	return (
		<div className={` ${darkTheme ? "dark" : ""} ${style.layout}`}>
			<Header
				user={user}
				setToken={setToken}
				setUser={setUser}
				darkTheme={darkTheme}
				handleSwitchColorTheme={handleSwitchColorTheme}
			/>
			<div className={style.container}>
				<main>
					<Outlet context={{ posts, user, setToken }} />
				</main>
				<Contact />
				<Footer />
			</div>
		</div>
	);
};

export default Main;

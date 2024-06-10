import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";

import style from "../styles/App.module.css";

import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";
import Loading from "./Loading";

import { AppProvider } from "../contexts/AppContext";

import handleFetch from "../utils/handleFetch";
import handleColorScheme from "../utils/handleColorScheme";

const GET_USER_URL = "http://localhost:3000/blog/users/user";

const App = () => {
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);
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
			const result = await handleFetch(GET_USER_URL, {
				headers: { Authorization: `Bearer ${token}` },
			});

			result.success
				? setUser(result.data)
				: console.error(result.message);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem("token"));

		const handleDeleteToken = () => {
			localStorage.removeItem("token");
			setLoading(false);
		};

		const handleCheckToken = () => {
			const isExpired = Date.now() > data.exp;
			isExpired ? handleDeleteToken() : setToken(data.token);
		};

		data ? handleCheckToken() : setLoading(false);
	}, []);

	useEffect(() => {
		token ? handleGetUser() : setUser(null);
	}, [token, handleGetUser]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div
					className={` ${darkTheme ? "dark" : ""} ${style.app}`}
					data-testid="app"
				>
					<AppProvider
						setToken={setToken}
						setUser={setUser}
						token={token}
						handleGetUser={handleGetUser}
					>
						<Header
							user={user}
							darkTheme={darkTheme}
							handleSwitchColorTheme={handleSwitchColorTheme}
						/>
					</AppProvider>
					<div className={style.container}>
						<main>
							<Outlet context={{ setToken, user }} />
						</main>
						<Contact />
						<Footer />
					</div>
				</div>
			)}
		</>
	);
};

export default App;

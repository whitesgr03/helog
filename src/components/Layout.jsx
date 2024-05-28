import { useState, useContext } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import style from "../styles/App.module.css";

import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";

import { DarkThemeContext } from "../contexts/DarkThemeContext";

const user = {
	name: "Name",
	isAdmin: true,
	email: "Admin@gmail.com",
};

const Main = () => {
	const [darkTheme] = useContext(DarkThemeContext);
	const { posts } = useOutletContext();
	const [token, setToken] = useState(
		JSON.parse(localStorage.getItem("heLog")) ?? null
	);

	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.app}`}>
			<Header user={user} token={token} />
			<div className={style.container}>
				<main>
					<Outlet context={{ posts, user }} />
				</main>
				<Contact />
				<Footer />
			</div>
		</div>
	);
};

export default Main;

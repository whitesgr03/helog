import { useContext } from "react";
import { Outlet } from "react-router-dom";

import style from "../styles/App.module.css";

import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";

import { DarkThemeContext } from "../contexts/DarkThemeContext";
import useFetch from "../hooks/useFetch";

const user = {
	name: "Name",
	isAdmin: true,
	email: "Admin@gmail.com",
};
const getPostsUrl = "http://localhost:3000/blog/posts";

const App = () => {
	const [darkTheme] = useContext(DarkThemeContext);
	const posts = useFetch(getPostsUrl);
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.app}`}>
			<Header user={user} />
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

export default App;

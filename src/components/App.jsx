import style from "../styles/App.module.css";

import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Contact from "../components/Contact";

const posts = [
	{
		id: "1",
		url: "#",
		title: "This is title A",
		content: "This is content A",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "2",
		url: "#",
		title: "This is title B",
		content: "This is content B",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "3",
		url: "#",
		title: "This is title C",
		content: "This is content C",
		createdAt: new Date("2024/5/1"),
	},
];
const user = {
	name: "Name",
	isAdmin: true,
	email: "Admin@gmail.com",
};

const App = () => {
	return (
		<div className={style.app}>
			<Header user={user} />
			<div className={style.container}>
				<main>
					<Outlet context={{ posts }} />
				</main>
				<Contact />
				<Footer />
			</div>
		</div>
	);
};

export default App;

import style from "../styles/App.module.css";

import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Contact from "../components/Contact";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const posts = [
	{
		id: "1",
		url,
		title: "Overview of the DevOps Interview Process: From Application to Selection-Part Terraform",
		content: "This is content A",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "2",
		url,
		title: "This is title B",
		content: "This is content B",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "3",
		url,
		title: "This is title C",
		content: "This is content C",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "4",
		url,
		title: "This is title C",
		content: "This is content C",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "5",
		url,
		title: "This is title C",
		content: "This is content C",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "6",
		url,
		title: "This is title C",
		content: "This is content C",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "7",
		url,
		title: "This is title C",
		content: "This is content C",
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "8",
		url,
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

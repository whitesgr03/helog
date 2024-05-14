import { Outlet } from "react-router-dom";

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

const App = () => {
	return (
		<>
			<Outlet context={{ posts }} />
		</>
	);
};

export default App;

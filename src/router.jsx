import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/index.css";

import App from "./components/App";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import Login from "./components/Login";
import Register from "./components/Register";

import { DarkThemeProvider } from "./contexts/DarkThemeContext";

const router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: "/",
				element: <App />,
				children: [
					{
						path: "/",
						element: (
							<DarkThemeProvider>
								<Layout />
							</DarkThemeProvider>
						),
						children: [
							{
								path: "*",
								element: <NotFound />,
							},
							{
								index: true,
								element: <Home />,
							},
							{
								path: "posts",
								element: <PostList />,
							},
							{
								path: "posts/:postId",
								element: <PostDetail />,
							},
							{
								path: "users/login",
								element: <Login />,
							},
							{
								path: "users/register",
								element: <Register />,
							},
						],
					},
				],
			},
		])}
	/>
);

export default router;

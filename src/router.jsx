import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/index.css";

import App from "./components/App";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthGuard from "./components/AuthGuard";

const router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: "/",
				element: <App />,
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
						element: (
							<AuthGuard>
								<Login />
							</AuthGuard>
						),
					},
					{
						path: "users/register",
						element: (
							<AuthGuard>
								<Register />
							</AuthGuard>
						),
					},
				],
			},
		])}
	/>
);

export default router;

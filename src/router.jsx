import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/index.css";

import App from "./components/App";
import NotFound from "./components/layout/NotFound";
import Home from "./components/Home";
import PostList from "./components/post/PostList";
import PostDetail from "./components/post/PostDetail";

import Error from "./components/layout/Error";
import Callback from "./components/Callback";

import UserProvider from "./components/UserProvider";
const router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: '/',
				element: <App />,
				children: [
					{
						index: true,
						element: <Home />,
					},
					{
						path: '*',
						element: <NotFound />,
					},
					{
						path: 'error',
						element: <Error />,
					},
				],
			},
		])}
	/>
);

export default router;

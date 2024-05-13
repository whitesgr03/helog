import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./components/App";
import Error from "./components/Error";
import Home from "./components/Home";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";

const router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: "/",
				element: <App />,
				errorElement: <Error />,
				children: [
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
				],
			},
		])}
	/>
);

export default router;

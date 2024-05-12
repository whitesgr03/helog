import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./components/App";
import Home from "./components/Home";

const router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: "/",
				element: <App />,
				children: [
					{
						index: true,
						element: <Home />,
					},
				],
			},
		])}
	/>
);

export default router;

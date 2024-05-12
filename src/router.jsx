import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./component/App";

const router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: "/",
				element: <App />,
			},
		])}
	/>
);

export default router;

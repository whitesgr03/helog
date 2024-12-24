import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/index.css";

import { Login } from './components/pages/account/login';

export const router = () => (
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
						path: 'login',
						element: <Login />,
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

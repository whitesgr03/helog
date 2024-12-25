import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { App } from './components/App';
import { NotFound } from './components/layout/NotFound';
import { Home } from './components/Home';
import { Login } from './components/pages/account/Login';

import { Error } from './components/layout/Error';

export const Router = () => (
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

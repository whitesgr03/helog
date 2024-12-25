import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { App } from './components/App';
import { NotFound } from './components/layout/NotFound';
import { Home } from './components/Home';
import { PostList } from './components/post/PostList';
import { Login } from './components/pages/account/Login';
import { CheckUsername } from './components/pages/utils/CheckUsername';

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
						path: 'posts',
						element: (
							<CheckUsername>
								<PostList />
							</CheckUsername>
						),
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

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from './components/pages/App/App';
import { Home } from './components/pages/Home/Home';
import { Posts } from './components/pages/Post/Posts';

import { Login } from './components/pages/Account/Login';
import { PostDetail } from './components/pages/Post/PostDetail';

import { Error } from './components/utils/Error/Error';
import { NotFound } from './components/utils/Error/NotFound';

export const Router = () => (
	<RouterProvider
		future={{
			v7_startTransition: true,
		}}
		router={createBrowserRouter(
			[
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
							element: <Posts />,
						},
						{
							path: 'posts/:postId',
							element: <PostDetail />,
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
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		)}
	/>
);

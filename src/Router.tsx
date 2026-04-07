import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from './components/pages/App/App';
import { Home } from './components/pages/Home/Home';

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
							lazy: async () => {
								const { Posts } = await import('./components/pages/Post/Posts');
								return { Component: Posts };
							},
						},
						{
							path: 'posts/:postId',
							lazy: async () => {
								const { PostDetail } = await import(
									'./components/pages/Post/PostDetail'
								);
								return { Component: PostDetail };
							},
						},
						{
							path: 'policies',
							lazy: async () => {
								const { Policies } = await import(
									'./components/layout/Footer/Policies'
								);
								return {
									Component: Policies,
								};
							},
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

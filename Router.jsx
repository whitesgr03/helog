import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { App } from './components/pages/App/App';
import { Home } from './components/pages/Home/Home';
import { PostList } from './components/pages/Post/PostList';

import { Login } from './components/pages/Account/Login';
import { CheckUsername } from './components/utils/CheckUsername';
import { PostDetail } from './components/pages/Post/PostDetail';

import { Error } from './components/utils/Error/Error';
import { NotFound } from './components/utils/Error/NotFound';

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
						path: ':postId',
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
		])}
	/>
);

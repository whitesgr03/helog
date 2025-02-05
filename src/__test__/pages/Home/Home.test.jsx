import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Home } from '../../../components/pages/Home/Home';
import { Posts } from '../../../components/pages/Post/Posts';

vi.mock('../../../components/pages/Post/Posts');

describe('Home component', () => {
	it('should render Posts component', async () => {
		const mockContext = {
			posts: [],
		};

		Posts.mockImplementationOnce(() => <div>Posts component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Home />,
						},
					],
				},
			],
			{
				initialEntries: ['/'],
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const postsComponent = screen.getByText('Posts component');

		expect(postsComponent).toBeInTheDocument();
	});
	it('should navigate to the "../posts" path, if the all posts link is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			posts: [],
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Home />,
						},
						{
							path: 'posts',
							element: <div>Posts list component</div>,
						},
					],
				},
			],
			{
				initialEntries: ['/'],
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const link = screen.getByRole('link', { name: 'Latest All Posts' });

		await user.click(link);

		const postListComponent = screen.getByText('Posts list component');

		expect(postListComponent).toBeInTheDocument();
	});
});

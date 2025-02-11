import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { PostList } from '../../../components/pages/Post/PostList';
import { Posts } from '../../../components/pages/Post/Posts';

import { getPosts } from '../../../utils/handlePost';

vi.mock('../../../components/pages/Post/Posts');
vi.mock('../../../utils/handlePost');

describe('PostList component', () => {
	it('should render the Posts component', async () => {
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
							element: <PostList />,
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
	it('should navigate to the "/error" path if the user scroll to bottom of the Posts component and fetch fails', async () => {
		const mockContext = {
			posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			headerRef: {
				current: {},
			},
			countPosts: 20,
			onUpdatePosts: vi.fn(),
		};
		const mockResolve = {
			success: false,
		};

		Posts.mockImplementationOnce(() => <div>Posts component</div>);
		getPosts.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <PostList />,
						},
					],
				},
				{
					path: '/error',
					element: <div>Error component</div>,
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

		fireEvent.scroll(window, { target: { scrollY: 100 } });

		await screen.findByText('Loading posts...');

		const errorComponent = screen.getByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it('should fetch the next ten posts, if the user scroll to bottom of the Posts component', async () => {
		const mockContext = {
			posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			headerRef: {
				current: {},
			},
			countPosts: 20,
			onUpdatePosts: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		Posts.mockImplementationOnce(() => <div>Posts component</div>);
		getPosts.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <PostList />,
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

		fireEvent.scroll(window, { target: { scrollY: 100 } });

		await screen.findByText('Loading posts...');

		expect(getPosts).toBeCalledTimes(1);
		expect(mockContext.onUpdatePosts).toBeCalledTimes(1);
	});
});

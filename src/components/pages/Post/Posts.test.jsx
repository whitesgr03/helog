import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Posts } from './Posts';
import { Item } from './Item';

vi.mock('./Item');

describe('Posts component', () => {
	it(`should render no posts if the provided posts are empty`, () => {
		const mockProps = {
			posts: [],
		};

		mockProps.limit = mockProps.posts.length;

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Posts {...mockProps} />,
				},
			],
			{
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

		const noPosts = screen.getByText('There are not posts.');

		expect(noPosts).toBeInTheDocument();
	});
	it(`should render posts if the posts are provided`, () => {
		const mockProps = {
			posts: [
				{ _id: '0', title: 'post1' },
				{ _id: '1', title: 'post2' },
			],
		};

		vi.mocked(Item).mockImplementation(({ post }) => <div>{post.title}</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Posts {...mockProps} />,
				},
			],
			{
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

		mockProps.posts.forEach(post => {
			expect(screen.getByText(post.title)).toBeInTheDocument();
		});
	});
});

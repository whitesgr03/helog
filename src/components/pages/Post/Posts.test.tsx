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
				{
					_id: '0',
					title: 'title1',
					mainImage: 'image1',
					content: 'content1',
					author: {
						username: 'example',
					},
					updatedAt: new Date(),
					createdAt: new Date(),
				},
				{
					_id: '1',
					title: 'title2',
					mainImage: 'image2',
					content: 'content2',
					author: {
						username: 'example',
					},
					updatedAt: new Date(),
					createdAt: new Date(),
				},
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

import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';

import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { PostList } from './PostList';
import { PostMainImage } from './PostMainImage';

vi.mock('date-fns');
vi.mock('./PostMainImage');

describe('PostList component', () => {
	it(`should render no posts if the provided posts are empty`, () => {
		const mockProps = {
			posts: [],
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PostList {...mockProps} />,
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

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PostList {...mockProps} />,
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
	it(`should navigate to a specified post if the title link is clicked `, async () => {
		const user = userEvent.setup();
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
			],
		};

		vi.mocked(format).mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PostList {...mockProps} />,
				},
				{
					path: 'posts/:postId',
					element: <div>A specified post page</div>,
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

		const link = screen.getByRole('heading', {
			name: mockProps.posts[0].title,
		});

		await user.click(link);

		const postPage = screen.getByText('A specified post page');

		expect(postPage).toBeInTheDocument();
	});
	it(`should navigate to a specified post if the image link is clicked`, async () => {
		const user = userEvent.setup();
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
			],
		};

		vi.mocked(format).mockReturnValue('');
		vi.mocked(PostMainImage).mockImplementationOnce(() => (
			<div>PostMainImage component</div>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <PostList {...mockProps} />,
				},
				{
					path: 'posts/:postId',
					element: <div>A specified post page</div>,
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

		const element = screen.getByText('PostMainImage component');

		await user.click(element);

		const postPage = screen.getByText('A specified post page');

		expect(postPage).toBeInTheDocument();
	});
});

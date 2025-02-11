import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Posts } from '../../../components/pages/Post/Posts';

vi.mock('date-fns');

describe('Posts component', () => {
	it(`should replace the invalid main image with the error image, if the main image is not a valid image resource.`, async () => {
		const mockProps = {
			posts: [
				{
					_id: '0',
					title: 'title',
					mainImage: 'error',
					content: 'content',
					author: {
						username: 'example',
					},
					updatedAt: new Date(),
				},
			],
		};

		mockProps.limit = mockProps.posts.length;

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet />,
					children: [
						{
							index: true,
							element: <Posts {...mockProps} />,
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

		const image = screen.getByAltText(`Main image of post 1`);

		fireEvent.load(image);

		expect(image.src).toBe(
			'https://fakeimg.pl/0x0/?text=404%20Error&font=noto',
		);
	});
	it(`should render no posts if the provided posts are empty`, async () => {
		const mockProps = {
			posts: [],
		};

		mockProps.limit = mockProps.posts.length;

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet />,
					children: [
						{
							index: true,
							element: <Posts {...mockProps} />,
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

		const noPosts = screen.getByText('There are not posts.');

		expect(noPosts).toBeInTheDocument();
	});
	it(`should render posts if the posts are provided`, async () => {
		const mockProps = {
			posts: [
				{
					_id: '0',
					title: 'title',
					mainImage: faker.image.url({
						width: 10,
						height: 10,
					}),
					content: 'content',
					author: {
						username: 'example',
					},
					updatedAt: new Date(),
				},
			],
		};

		mockProps.limit = mockProps.posts.length;

		format.mockReturnValue('new date');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet />,
					children: [
						{
							index: true,
							element: <Posts {...mockProps} />,
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

		const username = screen.getByText(mockProps.posts[0].author.username);
		const dataTime = screen.getByText('new date');
		const image = screen.getByAltText('Main image of post 1');
		const title = screen.getByText(mockProps.posts[0].title);

		expect(username).toBeInTheDocument();
		expect(dataTime).toBeInTheDocument();
		expect(title).toBeInTheDocument();
		expect(image.src).toBe(mockProps.posts[0].mainImage);
	});
	it(`should render the limit the number of posts if the limit is provided`, async () => {
		const mockProps = {
			posts: [
				{
					_id: '0',
					title: 'title',
					mainImage: 'error',
					content: 'content',
					author: {
						username: 'example',
					},
					updatedAt: new Date(),
				},
				{
					_id: '1',
					title: 'title',
					mainImage: 'error',
					content: 'content',
					author: {
						username: 'example',
					},
					updatedAt: new Date(),
				},
				{
					_id: '2',
					title: 'title',
					mainImage: 'error',
					content: 'content',
					author: {
						username: 'example',
					},
					updatedAt: new Date(),
				},
			],
		};

		mockProps.limit = 2;

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet />,
					children: [
						{
							index: true,
							element: <Posts {...mockProps} />,
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

		const items = screen.getAllByRole('listitem');

		expect(items.length).toBe(2).not.toBe(mockProps.posts.length);
	});
	it(`should navigate to the specified post if the main image element or the title element is clicked`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			posts: [
				{
					_id: '0',
					title: 'title',
					mainImage: 'error',
					content: 'content',
					author: {
						username: 'example',
					},
					updatedAt: new Date(),
				},
			],
		};

		mockProps.limit = mockProps.posts.length;

		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet />,
					children: [
						{
							index: true,
							element: <Posts {...mockProps} />,
						},
						{
							path: 'posts/:postId',
							element: <div>A specified post page</div>,
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

		const link = screen.getByRole('link', { name: mockProps.posts[0].title });

		await user.click(link);

		const postPage = screen.getByText('A specified post page');

		expect(postPage).toBeInTheDocument();
	});
});

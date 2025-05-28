import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Item } from './Item';

vi.mock('date-fns');

describe('Posts component', () => {
	it(`should render the post data`, async () => {
		const mockProps = {
			post: {
				_id: '0',
				title: 'title',
				mainImage: 'image',
				content: 'content',
				author: {
					username: 'example',
				},
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			index: 0,
		};

		vi.mocked(format).mockReturnValue('new date');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Item {...mockProps} />,
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

		const username = screen.getByText(mockProps.post.author.username);
		const dataTime = screen.getByText('new date');
		const title = screen.getByText(mockProps.post.title);

		const image = screen.getByAltText(
			'Main image of post 1',
		) as HTMLImageElement;

		image.width = 1024;
		image.height = 768;

		fireEvent.load(image);

		expect(username).toBeInTheDocument();
		expect(dataTime).toBeInTheDocument();
		expect(title).toBeInTheDocument();
		expect(image).toHaveAttribute('src', mockProps.post.mainImage);
	});
	it(`should replace the invalid main image with the error image, if the main image is not a valid image resource.`, async () => {
		const mockProps = {
			post: {
				_id: '0',
				title: 'title',
				mainImage: 'error',
				author: {
					username: 'example',
				},
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			index: 0,
		};

		vi.mocked(format).mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Item {...mockProps} />,
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

		const image = screen.getByAltText(
			`Main image of post 1`,
		) as HTMLImageElement;

		fireEvent.load(image);

		expect(image).toHaveAttribute(
			'src',
			'https://fakeimg.pl/0x0/?text=404%20Image%20Error&font=noto',
		);
	});
	it(`should navigate to a specified post if the title element is clicked `, async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				title: 'title',
				mainImage: 'error',
				content: 'content',
				author: {
					username: 'example',
				},
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			index: 0,
		};

		vi.mocked(format).mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Item {...mockProps} />,
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

		const link = screen.getByRole('link', { name: mockProps.post.title });

		await user.click(link);

		const postPage = screen.getByText('A specified post page');

		expect(postPage).toBeInTheDocument();
	});
	it(`should navigate to a specified post if the main image element is clicked`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				title: 'title',
				mainImage: 'image',
				content: 'content',
				author: {
					username: 'example',
				},
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			index: 0,
		};

		vi.mocked(format).mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Item {...mockProps} />,
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

		const image = screen.getByAltText(`Main image of post 1`);

		await user.click(image);

		const postPage = screen.getByText('A specified post page');

		expect(postPage).toBeInTheDocument();
	});
});

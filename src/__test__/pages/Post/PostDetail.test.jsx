import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
	fireEvent,
} from '@testing-library/react';
import { Editor } from '@tinymce/tinymce-react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { PostDetail } from '../../../components/pages/Post/PostDetail';

import { Loading } from '../../../components/utils/Loading';
import { Comments } from '../../../components/pages/Comment/Comments';

import { getPostDetail } from '../../../utils/handlePost';

vi.mock('../../../components/pages/Comment/Comments');
vi.mock('../../../utils/handlePost');
vi.mock('../../../components/utils/Loading');
vi.mock('date-fns');
vi.mock('@tinymce/tinymce-react', async importOriginal => {
	return {
		...(await importOriginal),
		Editor: vi.fn(),
	};
});

describe('PostDetail component', () => {
	it(`should navigate to '/error/404' path if fetch a specified post is not exist`, async () => {
		const mockContext = {
			posts: [],
			onUpdatePost: vi.fn(),
		};
		const mockResolve = {
			success: false,
			status: 404,
		};

		Loading.mockImplementation(() => <div>Loading component</div>);

		Editor.mockImplementation(({ initialValue, onInit }) => {
			useEffect(() => {
				const editor = {
					getContent() {
						return `<p><img src=${faker.image.url({
							width: 10,
							height: 10,
						})}/></p>`;
					},
				};
				onInit(null, editor);
			}, [onInit]);

			return <div>{initialValue}</div>;
		});

		getPostDetail.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/:postId',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <PostDetail />,
						},
						{
							path: '*',
							element: <div>Not found component</div>,
						},
					],
				},
			],
			{
				initialEntries: ['/123'],
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

		const loadingComponent = screen.getByText('Loading component');
		const container = screen.getByTestId('container');

		expect(loadingComponent).toBeInTheDocument();
		expect(container).toHaveClass(/hide/);

		const NotFoundComponent = await screen.findByText('Not found component');

		expect(NotFoundComponent).toBeInTheDocument();
		expect(loadingComponent).not.toBeInTheDocument();
		expect(container).not.toBeInTheDocument();
	});
	it(`should navigate to '/error' path if fetch a specified post fails`, async () => {
		const mockContext = {
			posts: [],
			onUpdatePost: vi.fn(),
		};
		const mockResolve = {
			success: false,
			status: 500,
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Editor.mockImplementation(({ initialValue, onInit }) => {
			useEffect(() => {
				const editor = {
					getContent() {
						return `<p><img src=${faker.image.url({
							width: 10,
							height: 10,
						})}/></p>`;
					},
				};
				onInit(null, editor);
			}, [onInit]);

			return <div>{initialValue}</div>;
		});

		getPostDetail.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/:postId',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <PostDetail />,
						},
					],
				},
				{
					path: '/error',
					element: <div>Error component</div>,
				},
			],
			{
				initialEntries: ['/123'],
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

		const loadingComponent = screen.getByText('Loading component');
		const container = screen.getByTestId('container');

		expect(loadingComponent).toBeInTheDocument();
		expect(container).toHaveClass(/hide/);

		const errorComponent = await screen.findByText('Error component');

		expect(errorComponent).toBeInTheDocument();
		expect(loadingComponent).not.toBeInTheDocument();
		expect(container).not.toBeInTheDocument();
	});
	it(`should update the post if fetch a specified post is successfully`, async () => {
		const mockContext = {
			posts: [],
			onUpdatePost: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Editor.mockImplementation(({ initialValue, onInit }) => {
			useEffect(() => {
				const editor = {
					getContent() {
						return `<p><img src=${faker.image.url({
							width: 10,
							height: 10,
						})}/></p>`;
					},
				};
				onInit(null, editor);
			}, [onInit]);

			return <div>{initialValue}</div>;
		});

		getPostDetail.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/:postId',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <PostDetail />,
						},
					],
				},
			],
			{
				initialEntries: ['/123'],
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		expect(mockContext.onUpdatePost).toBeCalledTimes(1);
	});
	it(`should replace the invalid main image with the error image, if the main image is not a valid image resource.`, async () => {
		const mockContext = {
			posts: [
				{
					_id: '0',
					updatedAt: new Date(),
					createdAt: new Date(),
					author: { username: 'example' },
					title: 'title',
					content: 'content',
					mainImage: 'error',
				},
			],
			onUpdatePost: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Comments.mockImplementation(() => <div>Comments component</div>);
		Editor.mockImplementation(({ initialValue, onInit }) => {
			useEffect(() => {
				const editor = {
					getContent() {
						return `<p><img src=${faker.image.url({
							width: 10,
							height: 10,
						})}/></p>`;
					},
				};
				onInit(null, editor);
			}, [onInit]);

			return <div>{initialValue}</div>;
		});

		getPostDetail.mockResolvedValueOnce(mockResolve);
		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/:postId',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <PostDetail />,
						},
					],
				},
			],
			{
				initialEntries: ['/0'],
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const username = screen.getByText(mockContext.posts[0].author.username);

		const publishedDate = screen.getByText(/Published in/);

		const image = screen.getByAltText('Main image');
		const content = screen.getByText(mockContext.posts[0].content);

		fireEvent.load(image);

		const commentsComponent = screen.getByText('Comments component');

		expect(username).toBeInTheDocument();
		expect(publishedDate).toBeInTheDocument();
		expect(image.src).toBe(
			'https://fakeimg.pl/0x0/?text=404%20Error&font=noto',
		);
		expect(content).toBeInTheDocument();
		expect(commentsComponent).toBeInTheDocument();
	});
	it(`should render the post data if the post context is provided`, async () => {
		const mockContext = {
			posts: [
				{
					_id: '0',
					updatedAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
					createdAt: new Date(),
					author: { username: 'example' },
					title: 'title',
					content: 'content',
					mainImage: faker.image.url({
						width: 10,
						height: 10,
					}),
				},
			],
			onUpdatePost: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Comments.mockImplementation(() => <div>Comments component</div>);
		Editor.mockImplementation(({ initialValue, onInit }) => {
			useEffect(() => {
				const editor = {
					getContent() {
						return `<p><img src=${faker.image.url({
							width: 10,
							height: 10,
						})}/></p>`;
					},
				};
				onInit(null, editor);
			}, [onInit]);

			return <div>{initialValue}</div>;
		});

		getPostDetail.mockResolvedValueOnce(mockResolve);
		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/:postId',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <PostDetail />,
						},
					],
				},
			],
			{
				initialEntries: ['/0'],
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const username = screen.getByText(mockContext.posts[0].author.username);

		const publishedDate = screen.getByText(/Published in/);
		const editedDate = screen.getByText(/Edited in/);

		const image = screen.getByAltText('Main image');
		const content = screen.getByText(mockContext.posts[0].content);

		const commentsComponent = screen.getByText('Comments component');

		expect(username).toBeInTheDocument();
		expect(publishedDate).toBeInTheDocument();
		expect(editedDate).toBeInTheDocument();
		expect(image.src).toBe(mockContext.posts[0].mainImage);
		expect(content).toBeInTheDocument();
		expect(commentsComponent).toBeInTheDocument();
	});
	it(`should navigate to previous page if checks the "Back to previous page" Link is clicked`, async () => {
		const user = userEvent.setup();
		const mockContext = {
			posts: [
				{
					_id: '0',
					updatedAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
					createdAt: new Date(),
					author: { username: 'example' },
					title: 'title',
					content: 'content',
					mainImage: faker.image.url({
						width: 10,
						height: 10,
					}),
				},
			],
			onUpdatePost: vi.fn(),
		};
		const mockResolve = {
			success: true,
			data: {},
		};

		Loading.mockImplementation(() => <div>Loading component</div>);
		Comments.mockImplementation(() => <div>Comments component</div>);
		Editor.mockImplementation(({ initialValue, onInit }) => {
			useEffect(() => {
				const editor = {
					getContent() {
						return `<p><img src=${faker.image.url({
							width: 10,
							height: 10,
						})}/></p>`;
					},
				};
				onInit(null, editor);
			}, [onInit]);

			return <div>{initialValue}</div>;
		});

		getPostDetail.mockResolvedValueOnce(mockResolve);
		format.mockReturnValue('');

		const router = createMemoryRouter(
			[
				{
					path: '/:postId',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <PostDetail />,
						},
					],
				},
				{
					path: '/previous',
					element: <div>Previous component</div>,
				},
			],
			{
				initialEntries: ['/previous', '/0'],
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

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const link = screen.getByRole('link', { name: 'Back to previous page' });
		await user.click(link);

		const previousComponent = screen.getByText('Previous component');

		expect(previousComponent).toBeInTheDocument();
	});
});

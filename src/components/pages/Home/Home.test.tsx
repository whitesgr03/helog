import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
	QueryClient,
	QueryClientProvider,
	QueryCache,
} from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Home } from './Home';
import { Posts } from '../Post/Posts';
import { Loading } from '../../utils/Loading';
import { getPosts } from '../../../utils/handlePost';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../Post/Posts');
vi.mock('../../utils/Loading');
vi.mock('../../../utils/handlePost');
vi.mock('../App/AppContext');

describe('Home component', () => {
	it('should render Posts component', async () => {
		const mockData = {
			data: {
				posts: [
					{ title: 'post1' },
					{ title: 'post2' },
					{ title: 'post3' },
					{ title: 'post4' },
					{ title: 'post5' },
				],
				postsCount: 0,
			},
		};
		mockData.data.postsCount = mockData.data.posts.length;
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(Posts).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(getPosts).mockResolvedValue(mockData);

		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Home />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const items = screen.getAllByRole('listitem');

		expect(getPosts).toBeCalledTimes(1);
		expect(items).toHaveLength(4);
		items.forEach((item, index) => {
			expect(item).toHaveTextContent(mockData.data.posts[index].title);
		});
	});
	it('should render refetch button if fetching posts data fails', async () => {
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(getPosts).mockRejectedValue(Error());

		const queryClient = new QueryClient({
			queryCache: new QueryCache({
				onError: (_error, query) =>
					typeof query.meta?.errorAlert === 'function' &&
					query.meta.errorAlert(),
			}),
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Home />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const button = screen.getByRole('button', {
			name: 'Click here to load posts',
		});

		expect(getPosts).toBeCalledTimes(1);
		expect(button).toBeInTheDocument();
	});
	it('should render an error alert if fetching post data fails after the refetch button is clicked.', async () => {
		const user = userEvent.setup();

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(getPosts).mockRejectedValue(Error());

		const queryClient = new QueryClient({
			queryCache: new QueryCache({
				onError: (_error, query) =>
					typeof query.meta?.errorAlert === 'function' &&
					query.meta.errorAlert(),
			}),
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Home />,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const button = screen.getByRole('button', {
			name: 'Click here to load posts',
		});

		await user.click(button);

		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
	it('should navigate to the "../posts" path, if the all posts link is clicked', async () => {
		const user = userEvent.setup();
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Home />,
				},
				{
					path: '/posts',
					element: <div>Posts list component</div>,
				},
			],
			{
				future: {
					v7_relativeSplatPath: true,
				},
			},
		);

		render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		const link = screen.getByRole('link', { name: 'All Posts' });

		await user.click(link);

		const postListComponent = screen.getByText('Posts list component');

		expect(postListComponent).toBeInTheDocument();
	});
});

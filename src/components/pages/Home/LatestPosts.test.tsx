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

import { LatestPosts } from './LatestPosts';
import { PostList } from '../Post/PostList';
import { Loading } from '../../utils/Loading';
import { getPosts } from '../../../utils/handlePost';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../Post/PostList');
vi.mock('../../utils/Loading');
vi.mock('../../../utils/handlePost');
vi.mock('../App/AppContext');

describe('LatestPosts component', () => {
	it('should render PostList component', async () => {
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
		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(getPosts).mockResolvedValue(mockData);

		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <LatestPosts />,
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
					element: <LatestPosts />,
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
	it('should render an error alert if refetch button is clicked.', async () => {
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
					element: <LatestPosts />,
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
});

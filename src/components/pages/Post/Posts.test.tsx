import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	fireEvent,
	waitForElementToBeRemoved,
} from '@testing-library/react';

import {
	QueryClient,
	QueryClientProvider,
	QueryCache,
	infiniteQueryOptions,
} from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Posts } from './Posts';

import { PostList } from './PostList';
import { Loading } from '../../utils/Loading';
import { getPosts } from '../../../utils/handlePost';
import { useAppDataAPI } from '../App/AppContext';
import { infiniteQueryPostsOption } from '../../../utils/queryOptions';
import userEvent from '@testing-library/user-event';

vi.mock('./PostList');
vi.mock('../../../utils/handlePost');
vi.mock('../../utils/Loading');
vi.mock('../App/AppContext');
vi.mock('../../../utils/queryOptions');

describe('PostList component', () => {
	it('should render the posts data if the first of infinite fetching posts successful', async () => {
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
		vi.mocked(infiniteQueryPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['posts'],
				queryFn: getPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.postsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(getPosts).mockResolvedValue(mockData);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Posts />,
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
		expect(items).toHaveLength(mockData.data.postsCount);
		items.forEach((item, index) => {
			expect(item).toHaveTextContent(mockData.data.posts[index].title);
		});
	});
	it('should navigate to the "/error" path if the first of infinite fetching posts fails', async () => {
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['posts'],
				queryFn: getPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.postsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(getPosts).mockRejectedValue(Error());

		const queryClient = new QueryClient({
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
					element: <Posts />,
				},
				{ path: '/error', element: <div>Error component</div> },
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

		const errorComponent = screen.getByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it('should fetch the next posts, if the user scroll to bottom of the Posts component and infinite fetching posts successful', async () => {
		const mockFirstFetchData = {
			data: {
				posts: [
					{ title: 'post1' },
					{ title: 'post2' },
					{ title: 'post3' },
					{ title: 'post4' },
					{ title: 'post5' },
					{ title: 'post6' },
					{ title: 'post7' },
					{ title: 'post8' },
					{ title: 'post9' },
					{ title: 'post10' },
				],
				postsCount: 15,
			},
		};
		const mockNextFetchData = {
			data: {
				posts: [
					{ title: 'post11' },
					{ title: 'post12' },
					{ title: 'post13' },
					{ title: 'post14' },
					{ title: 'post15' },
				],
				postsCount: 15,
			},
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['posts'],
				queryFn: getPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.postsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(getPosts)
			.mockResolvedValueOnce(mockFirstFetchData)
			.mockResolvedValueOnce(mockNextFetchData);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Posts />,
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

		expect(screen.getAllByRole('listitem')).toHaveLength(
			mockFirstFetchData.data.posts.length,
		);

		fireEvent.scroll(window);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		expect(getPosts).toBeCalledTimes(2);
		expect(screen.getAllByRole('listitem')).toHaveLength(
			mockFirstFetchData.data.posts.length +
				mockNextFetchData.data.posts.length,
		);
	});
	it('should render the show more posts button, if the user scroll to bottom of the Posts component and infinite fetching posts fails', async () => {
		const mockFirstFetchData = {
			data: {
				posts: [
					{ title: 'post1' },
					{ title: 'post2' },
					{ title: 'post3' },
					{ title: 'post4' },
					{ title: 'post5' },
					{ title: 'post6' },
					{ title: 'post7' },
					{ title: 'post8' },
					{ title: 'post9' },
					{ title: 'post10' },
				],
				postsCount: 15,
			},
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['posts'],
				queryFn: getPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.postsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(getPosts)
			.mockResolvedValueOnce(mockFirstFetchData)
			.mockRejectedValue(Error());

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
					element: <Posts />,
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

		fireEvent.scroll(window);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(
			screen.getByRole('button', { name: 'Click here to show more posts' }),
		);
	});
	it('should refetch next posts, if the show more posts button is clicked and infinite fetching posts successful', async () => {
		const mockFirstFetchData = {
			data: {
				posts: [
					{ title: 'post1' },
					{ title: 'post2' },
					{ title: 'post3' },
					{ title: 'post4' },
					{ title: 'post5' },
					{ title: 'post6' },
					{ title: 'post7' },
					{ title: 'post8' },
					{ title: 'post9' },
					{ title: 'post10' },
				],
				postsCount: 15,
			},
		};
		const mockNextFetchData = {
			data: {
				posts: [
					{ title: 'post11' },
					{ title: 'post12' },
					{ title: 'post13' },
					{ title: 'post14' },
					{ title: 'post15' },
				],
				postsCount: 15,
			},
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['posts'],
				queryFn: getPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.postsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(getPosts)
			.mockResolvedValueOnce(mockFirstFetchData)
			.mockRejectedValueOnce(Error())
			.mockResolvedValueOnce(mockNextFetchData);

		const queryClient = new QueryClient({
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
					element: <Posts />,
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

		fireEvent.scroll(window);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const button = screen.getByRole('button', {
			name: 'Click here to show more posts',
		});

		await userEvent.setup().click(button);

		expect(screen.getAllByRole('listitem')).toHaveLength(
			mockFirstFetchData.data.posts.length +
				mockNextFetchData.data.posts.length,
		);
	});
	it('should render the show more posts button, if the show more posts button is clicked and infinite fetching posts fails', async () => {
		const mockFirstFetchData = {
			data: {
				posts: [
					{ title: 'post1' },
					{ title: 'post2' },
					{ title: 'post3' },
					{ title: 'post4' },
					{ title: 'post5' },
					{ title: 'post6' },
					{ title: 'post7' },
					{ title: 'post8' },
					{ title: 'post9' },
					{ title: 'post10' },
				],
				postsCount: 15,
			},
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryPostsOption).mockReturnValue(
			infiniteQueryOptions({
				queryKey: ['posts'],
				queryFn: getPosts,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.postsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(getPosts)
			.mockResolvedValueOnce(mockFirstFetchData)
			.mockRejectedValue(Error());

		const queryClient = new QueryClient({
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
					element: <Posts />,
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

		fireEvent.scroll(window);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		const button = screen.getByRole('button', {
			name: 'Click here to show more posts',
		});

		await userEvent.setup().click(button);

		expect(
			screen.getByRole('button', { name: 'Click here to show more posts' }),
		);
	});
});

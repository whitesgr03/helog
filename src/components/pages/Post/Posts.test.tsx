import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';

import {
	QueryClient,
	QueryClientProvider,
	infiniteQueryOptions,
} from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Posts } from './Posts';

import { PostList } from './PostList';
import { Loading } from '../../utils/Loading';
import { PostListTemplate } from './PostListTemplate';
import { getPosts } from '../../../utils/handlePost';
import { useAppDataAPI } from '../App/AppContext';
import { infiniteQueryPostsOption } from '../../../utils/queryOptions';
import userEvent from '@testing-library/user-event';

vi.mock('./PostList');
vi.mock('../../../utils/handlePost');
vi.mock('../../utils/Loading');
vi.mock('../App/AppContext');
vi.mock('../../../utils/queryOptions');
vi.mock('./PostListTemplate');

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
		vi.mocked(PostListTemplate).mockImplementation(() => (
			<div>PostListTemplate component</div>
		));
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
			screen.queryByText('PostListTemplate component'),
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
		vi.mocked(PostListTemplate).mockImplementation(() => (
			<div>PostListTemplate component</div>
		));
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
			screen.queryByText('PostListTemplate component'),
		);

		const errorComponent = screen.getByText('Error component');

		expect(errorComponent).toBeInTheDocument();
	});
	it('should displays the next 10 posts, if the user click the show more posts button', async () => {
		const user = userEvent.setup();
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
					{ title: 'post11' },
					{ title: 'post12' },
					{ title: 'post13' },
					{ title: 'post14' },
					{ title: 'post15' },
					{ title: 'post16' },
					{ title: 'post17' },
					{ title: 'post18' },
					{ title: 'post19' },
					{ title: 'post20' },
				],
				postsCount: 20,
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
		vi.mocked(PostListTemplate).mockImplementation(() => (
			<div>PostListTemplate component</div>
		));
		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(getPosts).mockResolvedValueOnce(mockFirstFetchData);

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
			screen.queryByText('PostListTemplate component'),
		);

		expect(screen.getAllByRole('listitem')).toHaveLength(10);

		const button = screen.getByRole('button', { name: /show more posts/ });

		await user.click(button);

		expect(getPosts).toBeCalledTimes(1);
		expect(screen.getAllByRole('listitem')).toHaveLength(20);
	});
	it('should fetches the next page, if the user click the load more posts button and infinite fetching posts successful', async () => {
		const user = userEvent.setup();

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
		vi.mocked(PostListTemplate).mockImplementationOnce(() => (
			<div>PostListTemplate component</div>
		));

		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));

		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));
		vi.mocked(getPosts)
			.mockResolvedValueOnce(mockFirstFetchData)
			.mockImplementationOnce(
				async () =>
					await new Promise(resolve =>
						setTimeout(() => resolve(mockNextFetchData), 100),
					),
			);

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
			screen.queryByText('PostListTemplate component'),
		);

		expect(screen.getAllByRole('listitem')).toHaveLength(
			mockFirstFetchData.data.posts.length,
		);

		const button = screen.getByRole('button', { name: /load more posts/ });

		await user.click(button);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);
		expect(getPosts).toBeCalledTimes(2);
		expect(screen.getAllByRole('listitem')).toHaveLength(
			mockFirstFetchData.data.posts.length +
				mockNextFetchData.data.posts.length,
		);
	});
	it('should renders an error alert, if the user click the load more posts button and infinite fetching posts fails', async () => {
		const user = userEvent.setup();

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
		vi.mocked(getPosts)
			.mockResolvedValueOnce(mockFirstFetchData)
			.mockRejectedValueOnce(new Error('error'));

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
				retry: false,
			}),
		);
		vi.mocked(PostListTemplate).mockImplementationOnce(() => (
			<div>PostListTemplate component</div>
		));

		vi.mocked(PostList).mockImplementation(({ posts }) => (
			<ul>{posts?.map(post => <li key={post.title}>{post.title}</li>)}</ul>
		));

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
			screen.queryByText('PostListTemplate component'),
		);

		expect(screen.getAllByRole('listitem')).toHaveLength(
			mockFirstFetchData.data.posts.length,
		);

		const button = screen.getByRole('button', { name: /load more posts/ });

		await user.click(button);

		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
});

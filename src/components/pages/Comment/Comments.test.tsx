import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	fireEvent,
	waitForElementToBeRemoved,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import {
	QueryClientProvider,
	QueryClient,
	QueryCache,
	infiniteQueryOptions,
} from '@tanstack/react-query';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Comments } from './Comments';
import { CommentDetail } from './CommentDetail';
import { CommentCreate } from './CommentCreate';

import { getComments } from '../../../utils/handleComment';
import { Loading } from '../../utils/Loading';

import { useAppDataAPI } from '../App/AppContext';
import { infiniteQueryCommentsOption } from '../../../utils/queryOptions';

vi.mock('./CommentDetail');
vi.mock('./CommentCreate');
vi.mock('../../../utils/handleComment');
vi.mock('../../utils/Loading');
vi.mock('../App/AppContext');
vi.mock('../../../utils/queryOptions');

describe('Comments component', () => {
	it(`should render a load comments button if fetch first comments fails`, async () => {
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryCommentsOption).mockImplementation(postId =>
			infiniteQueryOptions({
				queryKey: ['posts', postId],
				queryFn: getComments,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.commentsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(getComments).mockRejectedValue(Error());

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
					element: <Comments postId={'1'} />,
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
			name: 'Click here to load comments',
		});

		expect(getComments).toBeCalledTimes(1);
		expect(button).toBeInTheDocument();
	});
	it('should refetch first comments, if the load comments button is clicked and fetching comments successful', async () => {
		let mockFetchData = {
			data: {
				comments: [
					{ _id: '0', content: 'comment1' },
					{ _id: '1', content: 'comment2' },
					{ _id: '2', content: 'comment3' },
					{ _id: '3', content: 'comment4' },
					{ _id: '4', content: 'comment5' },
				],
				commentsCount: 0,
				commentAndReplyCounts: 0,
			},
		};
		mockFetchData.data.commentsCount = mockFetchData.data.comments.length;
		mockFetchData.data.commentAndReplyCounts =
			mockFetchData.data.comments.length;
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryCommentsOption).mockImplementation(postId =>
			infiniteQueryOptions({
				queryKey: ['posts', postId],
				queryFn: getComments,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.commentsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(CommentCreate).mockImplementation(() => (
			<div>CommentCreate component</div>
		));
		vi.mocked(CommentDetail).mockImplementation(({ comment }) => (
			<div>{comment.content}</div>
		));
		vi.mocked(getComments)
			.mockRejectedValueOnce(Error())
			.mockResolvedValueOnce(mockFetchData);

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
					element: <Comments postId={'1'} />,
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
			name: 'Click here to load comments',
		});

		await userEvent.setup().click(button);

		screen.debug();

		const headingElement = screen.getByRole('heading', { level: 3 });

		expect(headingElement).toHaveTextContent(
			String(mockFetchData.data.commentAndReplyCounts),
		);
		expect(screen.getByText('CommentCreate component'));
		mockFetchData.data.comments.forEach(comment => {
			expect(screen.getByText(comment.content)).toBeInTheDocument();
		});
	});
	it('should render an error alert if the load comments button is clicked and fetching comments fails', async () => {
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryCommentsOption).mockImplementation(postId =>
			infiniteQueryOptions({
				queryKey: ['posts', postId],
				queryFn: getComments,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.commentsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(getComments).mockRejectedValue(Error());

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
					element: <Comments postId={'1'} />,
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
			name: 'Click here to load comments',
		});

		await userEvent.setup().click(button);

		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(getComments).toBeCalledTimes(2);
	});
	it('should render the show more comments button, if the user scroll to bottom of the Comments component and fetching next comments fails', async () => {
		let mockFetchData = {
			data: {
				comments: [
					{ _id: '0', content: 'comment1' },
					{ _id: '1', content: 'comment2' },
					{ _id: '2', content: 'comment3' },
					{ _id: '3', content: 'comment4' },
					{ _id: '4', content: 'comment5' },
					{ _id: '5', content: 'comment6' },
					{ _id: '6', content: 'comment7' },
					{ _id: '7', content: 'comment8' },
					{ _id: '8', content: 'comment9' },
					{ _id: '9', content: 'comment10' },
				],
				commentsCount: 15,
			},
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryCommentsOption).mockImplementation(postId =>
			infiniteQueryOptions({
				queryKey: ['posts', postId],
				queryFn: getComments,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.commentsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(CommentDetail).mockImplementation(({ comment }) => (
			<div>{comment.content}</div>
		));
		vi.mocked(getComments)
			.mockResolvedValueOnce(mockFetchData)
			.mockRejectedValueOnce(Error());

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
					element: <Comments postId={'1'} />,
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
			screen.getByRole('button', { name: 'Click here to show more comments' }),
		);
	});
	it('should refetch next comments, if the show more comments button is clicked and fetching next comments successful', async () => {
		const mockFirstFetchData = {
			data: {
				comments: [
					{ _id: '0', content: 'comment1' },
					{ _id: '1', content: 'comment2' },
					{ _id: '2', content: 'comment3' },
					{ _id: '3', content: 'comment4' },
					{ _id: '4', content: 'comment5' },
					{ _id: '5', content: 'comment6' },
					{ _id: '6', content: 'comment7' },
					{ _id: '7', content: 'comment8' },
					{ _id: '8', content: 'comment9' },
					{ _id: '9', content: 'comment10' },
				],
				commentsCount: 15,
			},
		};
		const mockNextFetchData = {
			data: {
				comments: [
					{ _id: '10', content: 'comment11' },
					{ _id: '11', content: 'comment12' },
					{ _id: '12', content: 'comment13' },
					{ _id: '13', content: 'comment14' },
					{ _id: '14', content: 'comment15' },
				],
				commentsCount: 15,
			},
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryCommentsOption).mockImplementation(postId =>
			infiniteQueryOptions({
				queryKey: ['posts', postId],
				queryFn: getComments,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.commentsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(CommentDetail).mockImplementation(({ comment }) => (
			<div>{comment.content}</div>
		));
		vi.mocked(getComments)
			.mockResolvedValueOnce(mockFirstFetchData)
			.mockRejectedValueOnce(Error())
			.mockResolvedValueOnce(mockNextFetchData);

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
					element: <Comments postId={'1'} />,
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
			name: 'Click here to show more comments',
		});

		await userEvent.setup().click(button);

		const mockFetchData = mockFirstFetchData.data.comments.concat(
			mockNextFetchData.data.comments,
		);

		mockFetchData.forEach(comment => {
			expect(screen.getByText(comment.content)).toBeInTheDocument();
		});
	});
	it(`should render no comments if the fetching comments are empty`, async () => {
		let mockFetchData = {
			data: {
				comments: [],
				commentsCount: 0,
			},
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryCommentsOption).mockImplementation(postId =>
			infiniteQueryOptions({
				queryKey: ['posts', postId],
				queryFn: getComments,
				initialPageParam: 0,
				getNextPageParam: (lastPage, _allPages, lastPageParam) =>
					lastPage.data.commentsCount > lastPageParam + 10
						? lastPageParam + 10
						: null,
			}),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(getComments).mockResolvedValueOnce(mockFetchData);

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
					element: <Comments postId={'1'} />,
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

		const element = screen.getByText('There are not comments.');

		expect(element).toBeInTheDocument();
	});
});

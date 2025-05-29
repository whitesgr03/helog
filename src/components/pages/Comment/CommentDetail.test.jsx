import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatDistanceToNow } from 'date-fns';

import {
	QueryClient,
	QueryClientProvider,
	QueryCache,
} from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { CommentDetail } from './CommentDetail';

import { Replies } from '../Reply/Replies';
import { CommentUpdate } from './CommentUpdate';
import { CommentDelete } from './CommentDelete';
import { ReplyCreate } from '../Reply/ReplyCreate';

import { getReplies } from '../../../utils/handleReply';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../App/AppContext');
vi.mock('../Reply/Replies');
vi.mock('./CommentUpdate');
vi.mock('./CommentDelete');
vi.mock('../Reply/ReplyCreate');
vi.mock('../../../utils/handleReply');
vi.mock('date-fns');

describe('CommentDetail component', () => {
	it('should render a string "deleted" as the comment username if the comment was deleted', async () => {
		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: true,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				child: [],
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post author' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const deletedComment = screen.getByText('[deleted]');

		expect(deletedComment).toBeInTheDocument();
	});
	it('should render the comment data if the comment was not deleted', async () => {
		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'self' },
				child: [],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post author' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const index = screen.getByText(`[${mockProps.index + 1}]`);
		const avatar = screen.getByText(
			mockProps.comment.author.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(mockProps.comment.author.username);
		const dateTime = screen.getByText(`ago`);

		const content = screen.getByText(mockProps.comment.content);

		const editButton = screen.getByTestId('edit-button');
		const deleteButton = screen.getByTestId('delete-button');

		expect(index).toBeInTheDocument();
		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
		expect(dateTime).toBeInTheDocument();
		expect(content).toBeInTheDocument();
		expect(editButton).toBeInTheDocument();
		expect(deleteButton).toBeInTheDocument();
	});
	it('should render the comment owner mark if the comment author is the currently logged in user', async () => {
		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				child: [],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: mockProps.comment.author.username,
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post author' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const containerElement = screen.getByTestId('container');

		expect(containerElement).toHaveClass(/user/);
	});
	it('should render the post author mark if the comment author is the post author', async () => {
		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				child: [],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: mockProps.comment.author.username },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const containerElement = screen.getByTestId('container');

		expect(containerElement).toHaveClass(/author/);
	});
	it('should render the edit and delete buttons if the currently logged in user is admin', async () => {
		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				child: [],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
				isAdmin: true,
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'admin' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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
		const editButton = screen.getByTestId('edit-button');
		const deleteButton = screen.getByTestId('delete-button');
		expect(editButton).toBeInTheDocument();
		expect(deleteButton).toBeInTheDocument();
	});
	it('should render the commentUpdate component, if the edit icon button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'self' },
				child: [],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');
		vi.mocked(CommentUpdate).mockImplementationOnce(() => (
			<div>CommentUpdate component</div>
		));

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post user' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const editButton = screen.getByTestId('edit-button');

		user.click(editButton);

		await waitForElementToBeRemoved(() =>
			screen.getByText(mockProps.comment.content),
		);

		const commentUpdateComponent = screen.getByText('CommentUpdate component');

		expect(commentUpdateComponent).toBeInTheDocument();
	});
	it('should active the commentDelete component, if the delete icon button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'self' },
				child: [],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');
		vi.mocked(CommentDelete).mockImplementationOnce(() => (
			<div>CommentDelete component</div>
		));

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post user' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const deleteButton = screen.getByTestId('delete-button');

		await user.click(deleteButton);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);
		expect(mockCustomHook.onModal.mock.calls[0][0].component).toHaveProperty(
			'type',
			CommentDelete,
		);
	});
	it('should render the edited comment, if the comment created date is not equal to updated date', async () => {
		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(Date.now() + 5),
				createdAt: new Date(),
				author: { username: 'self' },
				child: [],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');
		vi.mocked(CommentDelete).mockImplementationOnce(() => (
			<div>CommentDelete component</div>
		));

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post user' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const dateTime = screen.getByText(`ago (edited)`);

		expect(dateTime).toBeInTheDocument();
	});
	it('should render the ReplyCreate component, if the reply button is clicked and comment replies is provided', async () => {
		const user = userEvent.setup();

		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(Date.now() + 5),
				createdAt: new Date(),
				author: { username: 'self' },
				child: [],
				content: 'content',
				countReplies: 0,
				replies: [
					{
						_id: '0',
					},
				],
			},
			postId: '1',
		};

		mockProps.comment.countReplies = mockProps.comment.replies.length;

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');
		vi.mocked(ReplyCreate).mockImplementationOnce(() => (
			<div>ReplyCreate component</div>
		));

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post user' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const replyButton = screen.getByRole('button', { name: 'Reply' });

		await user.click(replyButton);

		const replyCreateComponent = screen.getByText('ReplyCreate component');

		expect(replyCreateComponent).toBeInTheDocument();
	});
	it('should fetch the comment replies successful, if the reply icon button is clicked', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			success: true,
			date: {},
		};

		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'self' },
				child: [{}],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(getReplies).mockImplementationOnce(
			() => new Promise(resolve => setTimeout(() => resolve(mockResolve), 300)),
		);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValue('');
		vi.mocked(Replies).mockImplementation(() => <div>Replies component</div>);

		const queryClient = new QueryClient();
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post user' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const replyButton = screen.getByTestId('reply-icon');

		await user.click(replyButton);

		await waitForElementToBeRemoved(() => screen.getByTestId('loading-icon'));

		expect(getReplies).toBeCalledTimes(1);
		expect(screen.getByText('Replies component')).toBeInTheDocument();
	});
	it('should add the state of renderRepliesCount value, if onAddRenderRepliesCount method is executed', async () => {
		const user = userEvent.setup();
		const mockResolve = {
			success: true,
			date: {},
		};

		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'self' },
				child: [{}],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(getReplies).mockImplementationOnce(
			() => new Promise(resolve => setTimeout(() => resolve(mockResolve), 300)),
		);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValue('');
		vi.mocked(Replies).mockImplementation(
			({ renderRepliesCount, onAddRenderRepliesCount }) => (
				<div>
					<div>Replies count: {renderRepliesCount}</div>
					<button onClick={onAddRenderRepliesCount}>Add count</button>
				</div>
			),
		);

		const queryClient = new QueryClient();
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post user' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const replyButton = screen.getByTestId('reply-icon');

		await user.click(replyButton);

		await waitForElementToBeRemoved(() => screen.getByTestId('loading-icon'));

		const replyComponentButton = screen.getByRole('button', {
			name: 'Add count',
		});

		expect(screen.getByText(`Replies count: 10`)).toBeInTheDocument();

		await user.click(replyComponentButton);

		expect(screen.getByText(`Replies count: 20`)).toBeInTheDocument();
	});
	it('should render an error alert if the reply icon button is clicked and fetching the comment replies fails', async () => {
		const user = userEvent.setup();

		const mockProps = {
			index: 0,
			comment: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'self' },
				child: [{}],
				content: 'content',
			},
			postId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(getReplies).mockImplementationOnce(
			() => new Promise((_r, reject) => setTimeout(() => reject(Error()), 300)),
		);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValue('');

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
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'self',
			},
		});
		queryClient.setQueryData(['post', mockProps.postId], {
			data: {
				author: { username: 'post user' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentDetail {...mockProps} />,
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

		const replyButton = screen.getByTestId('reply-icon');

		await user.click(replyButton);

		await waitForElementToBeRemoved(() => screen.getByTestId('loading-icon'));

		expect(getReplies).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
});

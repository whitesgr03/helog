import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatDistanceToNow } from 'date-fns';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { ReplyDetail } from './ReplyDetail';

import { ReplyCreate } from './ReplyCreate';
import { ReplyDelete } from './ReplyDelete';
import { ReplyUpdate } from './ReplyUpdate';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('./ReplyCreate');
vi.mock('./ReplyDelete');
vi.mock('./ReplyUpdate');
vi.mock('date-fns');
vi.mock('../App/AppContext');

describe('ReplyDetail component', () => {
	it('should render a string "deleted" as the reply username if the reply was deleted', async () => {
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: true,
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			onScroll: vi.fn(),
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
					element: <ReplyDetail {...mockProps} />,
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

		const deletedReply = screen.getByText('[deleted]');

		expect(deletedReply).toBeInTheDocument();
	});
	it('should render the reply data if the reply was not deleted', async () => {
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			onScroll: vi.fn(),
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
					element: <ReplyDetail {...mockProps} />,
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
			mockProps.reply.author.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(mockProps.reply.author.username);
		const dateTime = screen.getByText(`ago`);

		const content = screen.getByText(mockProps.reply.content);

		expect(index).toBeInTheDocument();
		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
		expect(dateTime).toBeInTheDocument();
		expect(content).toBeInTheDocument();
	});
	it('should render the reply owner mark if the reply author is the currently logged in user', async () => {
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			onScroll: vi.fn(),
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
					element: <ReplyDetail {...mockProps} />,
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
	it('should render the post author mark if the reply author is the post author', async () => {
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'post author',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			onScroll: vi.fn(),
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
					element: <ReplyDetail {...mockProps} />,
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
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'post author',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			onScroll: vi.fn(),
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
				author: { username: 'post author' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyDetail {...mockProps} />,
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
	it('should active the ReplyDelete component, if the delete icon button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			onScroll: vi.fn(),
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
					element: <ReplyDetail {...mockProps} />,
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
			ReplyDelete,
		);
	});
	it('should render the ReplyUpdate component, if the edit icon button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
			},
			onScroll: vi.fn(),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(formatDistanceToNow).mockReturnValueOnce('');
		vi.mocked(ReplyUpdate).mockImplementationOnce(() => (
			<div>ReplyUpdate component</div>
		));

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
					element: <ReplyDetail {...mockProps} />,
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
			screen.getByText(mockProps.reply.content),
		);

		const replyUpdateComponent = screen.getByText('ReplyUpdate component');

		expect(replyUpdateComponent).toBeInTheDocument();
	});
	it('should render the edited reply, if the reply created date is not equal to updated date', async () => {
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(Date.now() + 5),
				createdAt: new Date(),
			},
			onScroll: vi.fn(),
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
					element: <ReplyDetail {...mockProps} />,
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
	it("should render the replier's username, if the replier is provided", async () => {
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				reply: {
					author: { username: 'A replier' },
					deleted: false,
					_id: '0',
					post: '',
					parent: '',
					child: [],
					content: 'reply',
					updatedAt: new Date(),
					createdAt: new Date(),
				},
			},
			onScroll: vi.fn(),
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
					element: <ReplyDetail {...mockProps} />,
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

		const replier = screen.getByText(
			`@${mockProps.reply.reply.author.username}`,
		);
		expect(replier).toBeInTheDocument();
	});
	it(`should render a string "deleted" as the replier's username, if the replier's comment is deleted`, async () => {
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				reply: {
					author: { username: 'A replier' },
					deleted: true,
					_id: '0',
					post: '',
					parent: '',
					child: [],
					content: 'reply',
					updatedAt: new Date(),
					createdAt: new Date(),
				},
			},
			onScroll: vi.fn(),
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
					element: <ReplyDetail {...mockProps} />,
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

		const deletedReplier = screen.getByText('@deleted');

		expect(deletedReplier).toBeInTheDocument();
	});
	it('should render the ReplyCreate component, if the reply button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				reply: {
					author: { username: 'A replier' },
					deleted: false,
					_id: '0',
					post: '',
					parent: '',
					child: [],
					content: 'reply',
					updatedAt: new Date(),
					createdAt: new Date(),
				},
			},
			onScroll: vi.fn(),
		};

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
				author: { username: 'post author' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyDetail {...mockProps} />,
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

		const replyUpdateComponent = screen.getByText('ReplyCreate component');

		expect(replyUpdateComponent).toBeInTheDocument();
	});
	it('should scroll to the specified reply, if the replied username button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			postId: '1',
			commentId: '1',
			reply: {
				_id: '0',
				author: {
					username: 'self',
				},
				post: '',
				parent: '',
				child: [],
				content: 'reply',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				reply: {
					author: { username: 'A replier' },
					deleted: false,
					_id: '0',
					post: '',
					parent: '',
					child: [],
					content: 'reply',
					updatedAt: new Date(),
					createdAt: new Date(),
				},
			},
			onScroll: vi.fn(),
		};

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
				author: { username: 'post author' },
			},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyDetail {...mockProps} />,
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

		const repliedUserButton = screen.getByRole('button', {
			name: `@${mockProps.reply.reply.author.username}`,
		});

		await user.click(repliedUserButton);

		expect(mockProps.onScroll).toBeCalledTimes(1);
		expect(mockProps.onScroll).toBeCalledWith(mockProps.reply.reply._id);
	});
});

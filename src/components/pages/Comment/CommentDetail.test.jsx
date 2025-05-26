import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatDistanceToNow } from 'date-fns';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { CommentDetail } from './CommentDetail';

import { Replies } from '../Reply/Replies';
import { CommentUpdate } from './CommentUpdate';
import { CommentDelete } from './CommentDelete';
import { ReplyCreate } from '../Reply/ReplyCreate';

import { getReplies } from '../../../utils/handleReply';

vi.mock('../../../components/pages/Reply/Replies');
vi.mock('../../../components/pages/Comment/CommentUpdate');
vi.mock('../../../components/pages/Comment/CommentDelete');
vi.mock('../../../components/pages/Reply/ReplyCreate');
vi.mock('../../../utils/handleReply');
vi.mock('date-fns');

describe('CommentDetail component', () => {
	it('should render a string "deleted" as the comment username if the comment was deleted', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: true,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
					},
				],
			},
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				isAdmin: false,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		formatDistanceToNow.mockReturnValueOnce('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const deletedComment = screen.getByText('[deleted]');

		expect(deletedComment).toBeInTheDocument();
	});
	it('should render the comment data if the comment was not deleted', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'user' },
						content: 'content',
					},
				],
			},
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				isAdmin: false,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		formatDistanceToNow.mockReturnValueOnce('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const index = screen.getByText(`[${mockProps.index + 1}]`);
		const avatar = screen.getByText(
			mockProps.post.comments[0].author.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(
			mockProps.post.comments[0].author.username,
		);
		const dateTime = screen.getByText(`ago`);

		const content = screen.getByText(mockProps.post.comments[0].content);

		expect(index).toBeInTheDocument();
		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
		expect(dateTime).toBeInTheDocument();
		expect(content).toBeInTheDocument();
	});
	it('should render the comment owner mark if the comment author is the currently logged in user', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: '123' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: false,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		formatDistanceToNow.mockReturnValueOnce('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const containerElement = screen.getByTestId('container');

		expect(containerElement).toHaveClass(/user/);
	});
	it('should render the post author mark if the comment author is the post author', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: false,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		formatDistanceToNow.mockReturnValueOnce('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const containerElement = screen.getByTestId('container');

		expect(containerElement).toHaveClass(/author/);
	});
	it('should render the edit and delete buttons if the currently logged in user is admin', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		formatDistanceToNow.mockReturnValueOnce('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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
		const editButton = screen.getByTestId('edit-button');
		const deleteButton = screen.getByTestId('delete-button');
		expect(editButton).toBeInTheDocument();
		expect(deleteButton).toBeInTheDocument();
	});
	it('should render the commentUpdate component, if the edit icon button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		CommentUpdate.mockImplementationOnce(() => (
			<div>CommentUpdate component</div>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const editButton = screen.getByTestId('edit-button');

		user.click(editButton);

		await waitForElementToBeRemoved(() =>
			screen.getByText(mockProps.post.comments[0].content),
		);

		const commentUpdateComponent = screen.getByText('CommentUpdate component');

		expect(commentUpdateComponent).toBeInTheDocument();
	});
	it('should active the commentDelete component, if the delete icon button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		formatDistanceToNow.mockReturnValueOnce('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const deleteButton = screen.getByTestId('delete-button');

		await user.click(deleteButton);

		expect(mockContext.onActiveModal).toBeCalledTimes(1);
		expect(mockContext.onActiveModal.mock.calls[0][0].component).toHaveProperty(
			'type',
			CommentDelete,
		);
	});
	it('should render the comment has been edited, if the comment creation data is not equal to update data', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(Date.now() + 5),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		formatDistanceToNow.mockReturnValueOnce('');

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const dateTime = screen.getByText(`ago (edited)`);

		expect(dateTime).toBeInTheDocument();
	});
	it('should fetch the comment replies, if the reply button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
						countReplies: 1,
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const mockResolve = {
			success: true,
			date: {},
		};

		getReplies.mockResolvedValueOnce(mockResolve);

		Replies.mockImplementationOnce(() => <div>Replies component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const replyButton = screen.getByRole('button', { name: 'Reply' });

		user.click(replyButton);

		await screen.findByTestId('loading-icon');

		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
	});
	it('should render the ReplyCreate component, if the reply button is clicked and comment replies is provided', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
						replies: [
							{
								_id: '0',
							},
						],
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		mockProps.post.comments[0].countReplies =
			mockProps.post.comments[0].replies.length;

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		ReplyCreate.mockImplementationOnce(() => <div>ReplyCreate component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const replyButton = screen.getByRole('button', { name: 'Reply' });

		await user.click(replyButton);

		const replyCreateComponent = screen.getByText('ReplyCreate component');

		expect(replyCreateComponent).toBeInTheDocument();
	});
	it('should render an error alert if the reply button is clicked and getting the comment replies fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
						countReplies: 1,
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const mockResolve = {
			success: false,
		};

		getReplies.mockResolvedValueOnce(mockResolve);

		Replies.mockImplementationOnce(() => <div>Replies component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const replyButton = screen.getByRole('button', { name: 'Reply' });

		user.click(replyButton);

		await screen.findByTestId('loading-icon');

		expect(mockContext.onAlert).toBeCalledTimes(1);
	});
	it('should fetch the comment replies, if the reply icon button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
						countReplies: 1,
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const mockResolve = {
			success: true,
			date: {},
		};

		getReplies.mockResolvedValueOnce(mockResolve);

		Replies.mockImplementationOnce(() => <div>Replies component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const replyButton = screen.getByTestId('reply-icon');

		user.click(replyButton);

		await screen.findByTestId('loading-icon');

		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
	});
	it('should render the replies component, if the reply icon button is clicked and the comment replies is provided', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
						replies: [
							{
								_id: '0',
							},
						],
					},
				],
			},
		};

		mockProps.post.comments[0].countReplies =
			mockProps.post.comments[0].replies.length;

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		Replies.mockImplementationOnce(() => <div>Replies component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const replyButton = screen.getByTestId('reply-icon');

		await user.click(replyButton);

		const repliesComponent = screen.getByText('Replies component');

		expect(repliesComponent).toBeInTheDocument();
	});
	it('should render an error alert if the reply icon button is clicked and getting the comment replies fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
				comments: [
					{
						_id: '0',
						deleted: false,
						updatedAt: new Date(),
						createdAt: new Date(),
						author: { username: 'example' },
						content: 'content',
						countReplies: 1,
					},
				],
			},
		};

		const mockContext = {
			user: {
				isAdmin: true,
				username: '123',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockResolve = {
			success: false,
		};

		getReplies.mockResolvedValueOnce(mockResolve);

		Replies.mockImplementationOnce(() => <div>Replies component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentDetail
									{...mockProps}
									comment={mockProps.post.comments[0]}
								/>
							),
						},
					],
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

		const replyButton = screen.getByTestId('reply-icon');

		user.click(replyButton);

		await screen.findByTestId('loading-icon');

		expect(mockContext.onAlert).toBeCalledTimes(1);
	});
});

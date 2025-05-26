import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatDistanceToNow } from 'date-fns';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { ReplyDetail } from './ReplyDetail';

import { ReplyCreate } from './ReplyCreate';
import { ReplyDelete } from './ReplyDelete';
import { ReplyUpdate } from './ReplyUpdate';

vi.mock('../../../components/pages/Reply/ReplyCreate');
vi.mock('../../../components/pages/Reply/ReplyDelete');
vi.mock('../../../components/pages/Reply/ReplyUpdate');
vi.mock('date-fns');

describe('ReplyDetail component', () => {
	it('should render a string "deleted" as the reply username if the reply was deleted', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
			},
			reply: {
				_id: '0',
				deleted: true,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: false,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
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
							element: <ReplyDetail {...mockProps} />,
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

		const deletedReply = screen.getByText('[deleted]');

		expect(deletedReply).toBeInTheDocument();
	});
	it('should render the reply data if the reply was not deleted', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: false,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
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
							element: <ReplyDetail {...mockProps} />,
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
			post: {
				author: { username: 'test' },
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: false,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyDetail {...mockProps} />,
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
	it('should render the post author mark if the reply author is the post author', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'example' },
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: false,
				username: 'test',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyDetail {...mockProps} />,
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
				author: { username: 'test' },
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: true,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyDetail {...mockProps} />,
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
	it('should active the ReplyDelete component, if the delete icon button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'test' },
			},
			comment: {
				_id: '0',
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: true,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyDetail {...mockProps} />,
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
			ReplyDelete,
		);
	});
	it('should render the ReplyUpdate component, if the edit icon button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'test' },
			},
			comment: {
				_id: '0',
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: true,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		ReplyUpdate.mockImplementationOnce(() => <div>ReplyUpdate component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyDetail {...mockProps} />,
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
			screen.getByText(mockProps.reply.content),
		);

		const replyUpdateComponent = screen.getByText('ReplyUpdate component');

		expect(replyUpdateComponent).toBeInTheDocument();
	});
	it('should render the reply has been edited, if the reply creation data is not equal to update data', async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'test' },
			},
			comment: {
				_id: '0',
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(Date.now() + 5),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: true,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
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
							element: <ReplyDetail {...mockProps} />,
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
	it("should render the replier's username, if the replier is provided", async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'test' },
			},
			comment: {
				_id: '0',
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(Date.now() + 5),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
				reply: {
					author: { username: 'A replier' },
					deleted: false,
				},
			},
		};
		const mockContext = {
			user: {
				isAdmin: true,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyDetail {...mockProps} />,
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

		const replier = screen.getByText(
			`@${mockProps.reply.reply.author.username}`,
		);
		expect(replier).toBeInTheDocument();
	});
	it(`should render a string "deleted" as the replier's username, if the replier's comment is deleted`, async () => {
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'test' },
			},
			comment: {
				_id: '0',
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(Date.now() + 5),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
				reply: {
					author: { username: 'A replier' },
					deleted: true,
				},
			},
		};
		const mockContext = {
			user: {
				isAdmin: true,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyDetail {...mockProps} />,
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

		const deletedReplier = screen.getByText('@deleted');

		expect(deletedReplier).toBeInTheDocument();
	});
	it('should render the ReplyCreate component, if the reply button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'test' },
			},
			comment: {
				_id: '0',
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(Date.now() + 5),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
			},
		};
		const mockContext = {
			user: {
				isAdmin: true,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
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
							element: <ReplyDetail {...mockProps} />,
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

		const replyUpdateComponent = screen.getByText('ReplyCreate component');

		expect(replyUpdateComponent).toBeInTheDocument();
	});
	it('should scroll to the specified reply, if the replied username button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			index: 0,
			post: {
				author: { username: 'test' },
			},
			comment: {
				_id: '0',
			},
			reply: {
				_id: '0',
				deleted: false,
				updatedAt: new Date(Date.now() + 5),
				createdAt: new Date(),
				author: { username: 'example' },
				content: 'content',
				reply: {
					author: { username: 'A replier' },
					deleted: false,
				},
			},
			onScroll: vi.fn(),
		};
		const mockContext = {
			user: {
				isAdmin: true,
				username: 'example',
			},
			onAlert: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyDetail {...mockProps} />,
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

		const repliedUserButton = screen.getByRole('button', {
			name: `@${mockProps.reply.reply.author.username}`,
		});

		await user.click(repliedUserButton);

		expect(mockProps.onScroll).toBeCalledTimes(1);
		expect(mockProps.onScroll).toBeCalledWith(mockProps.reply.reply._id);
	});
});

import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Replies } from '../../../components/pages/Reply/Replies';
import { ReplyDetail } from '../../../components/pages/Reply/ReplyDetail';

import { getReplies } from '../../../utils/handleReply';

vi.mock('../../../utils/handleReply');
vi.mock('../../../components/pages/Reply/ReplyDetail');

describe('Replies component', () => {
	it('should render the ReplyDetail component of array if the replies are provided', async () => {
		const mockProps = {
			post: {
				comments: [
					{
						_id: '0',
						replies: [
							{
								_id: '0',
								reply: {
									_id: '1',
								},
							},
							{
								_id: '1',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '2',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '3',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '4',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '5',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '6',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '7',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '8',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '9',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '10',
								reply: {
									_id: '0',
								},
							},
						],
						countReplies: 20,
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};

		ReplyDetail.mockImplementation(() => <div>ReplyDetail component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<Replies
									post={mockProps.post}
									comment={mockProps.post.comments[0]}
									onUpdatePost={mockProps.onUpdatePost}
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

		const replyDetailComponents = screen.getAllByText('ReplyDetail component');

		const showMoreButton = screen.getByRole('button', {
			name: 'Show more replies',
		});

		expect(replyDetailComponents.length).toBe(
			mockProps.post.comments[0].replies.length,
		);
		expect(showMoreButton).toBeInTheDocument();
	});
	it('should render an error alert if getting more replies fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				comments: [
					{
						_id: '0',
						replies: [
							{
								_id: '0',
								reply: {
									_id: '1',
								},
							},
							{
								_id: '1',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '2',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '3',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '4',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '5',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '6',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '7',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '8',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '9',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '10',
								reply: {
									_id: '0',
								},
							},
						],
						countReplies: 20,
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};

		const mockResolve = {
			success: false,
		};

		ReplyDetail.mockImplementation(() => <div>ReplyDetail component</div>);
		getReplies.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<Replies
									post={mockProps.post}
									comment={mockProps.post.comments[0]}
									onUpdatePost={mockProps.onUpdatePost}
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

		const showMoreButton = screen.getByRole('button', {
			name: 'Show more replies',
		});

		user.click(showMoreButton);

		await screen.findByTestId('loading-icon');

		expect(getReplies).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
	});
	it('should scroll to a specified reply element and shake it, if the shake target id is set', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				comments: [
					{
						_id: '0',
						replies: [
							{
								_id: '0',
								reply: {
									_id: '1',
								},
							},
							{
								_id: '1',
								reply: {
									_id: '0',
								},
							},
						],
						countReplies: 20,
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};

		const mockScrollIntoView = vi.fn();

		ReplyDetail.mockImplementation(({ onScroll, reply }) => (
			<button onClick={() => onScroll(reply.reply._id)}>Scroll button</button>
		));
		Element.prototype.scrollIntoView = mockScrollIntoView;

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<Replies
									post={mockProps.post}
									comment={mockProps.post.comments[0]}
									onUpdatePost={mockProps.onUpdatePost}
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

		const replies = screen.getAllByTestId('reply');

		const scrollButtons = screen.getAllByRole('button', {
			name: 'Scroll button',
		});

		await user.click(scrollButtons[1]);

		fireEvent.scroll(window, { target: { scrollY: 100 } });

		await waitFor(() => {
			expect(replies[0]).toHaveClass(/shake/);
			fireEvent.animationEnd(replies[0]);
			expect(replies[0]).not.toHaveClass(/shake/);
		});
	});
	it('should render the ten more replies if the show more replies button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				comments: [
					{
						_id: '0',
						replies: [
							{
								_id: '0',
								reply: {
									_id: '1',
								},
							},
							{
								_id: '1',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '2',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '3',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '4',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '5',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '6',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '7',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '8',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '9',
								reply: {
									_id: '0',
								},
							},
							{
								_id: '10',
								reply: {
									_id: '0',
								},
							},
						],
						countReplies: 20,
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};

		const mockResolve = {
			success: true,
			data: {},
		};

		ReplyDetail.mockImplementation(() => <div>ReplyDetail component</div>);
		getReplies.mockResolvedValueOnce(mockResolve);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<Replies
									post={mockProps.post}
									comment={mockProps.post.comments[0]}
									onUpdatePost={mockProps.onUpdatePost}
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

		const showMoreButton = screen.getByRole('button', {
			name: 'Show more replies',
		});

		user.click(showMoreButton);

		const loadIcon = await screen.findByTestId('loading-icon');

		expect(getReplies).toBeCalledTimes(1);
		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
		expect(showMoreButton).not.toBeInTheDocument();
		expect(loadIcon).not.toBeInTheDocument();
	});
});

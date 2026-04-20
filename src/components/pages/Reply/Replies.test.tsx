import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
	fireEvent,
} from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';

import {
	QueryClientProvider,
	QueryClient,
	infiniteQueryOptions,
} from '@tanstack/react-query';

import { Replies } from './Replies';
import { ReplyDetail } from './ReplyDetail';

import { getReplies } from '../../../utils/handleReply';
import { Loading } from '../../utils/Loading';

import { infiniteQueryRepliesOption } from '../../../utils/queryOptions';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../App/AppContext');
vi.mock('../../../utils/queryOptions');
vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleReply');
vi.mock('./ReplyDetail');

describe('Replies component', () => {
	it('should render the replies data', async () => {
		const mockReplies = {
			data: [...Array(10).keys()].map(index => ({
				_id: index,
				content: `reply${index + 1}`,
			})),
		};

		let mockProps = {
			postId: '1',
			commentId: '1',
			repliesCount: 10,
			renderRepliesCount: 10,
			onAddingRepliesCount: vi.fn(),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		vi.mocked(ReplyDetail).mockImplementation(({ reply }) => (
			<li key={reply._id}>{reply.content}</li>
		));
		vi.mocked(infiniteQueryRepliesOption).mockImplementation(
			(commentId, repliesCount) =>
				infiniteQueryOptions({
					queryKey: ['replies', commentId],
					queryFn: getReplies,
					initialPageParam: 0,
					getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
						repliesCount > lastPageParam + 10 ? lastPageParam + 10 : null,
				}),
		);
		vi.mocked(getReplies).mockResolvedValueOnce(mockReplies);
		const queryClient = new QueryClient();

		render(
			<QueryClientProvider client={queryClient}>
				<Replies {...mockProps} />
			</QueryClientProvider>,
		);

		const items = await screen.findAllByRole('listitem');

		expect(items).toHaveLength(10);
	});
	it('should scroll to a target reply, if the handleScroll is executed', async () => {
		const user = userEvent.setup();
		const mockReplies = [
			{
				_id: '0',
				content: 'target',
			},
			{
				_id: '1',
				content: 'reply',
				reply: { _id: '0' },
			},
		];

		let mockProps = {
			postId: '1',
			commentId: '1',
			repliesCount: 0,
			renderRepliesCount: 10,
			onAddingRepliesCount: vi.fn(),
		};
		mockProps.repliesCount = mockReplies.length;

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		vi.mocked(ReplyDetail).mockImplementation(({ reply, onScroll }) => (
			<>
				<div>{reply.content}</div>
				{onScroll && (
					<button onClick={() => reply.reply && onScroll(reply.reply._id)}>
						Scroll to target
					</button>
				)}
			</>
		));
		vi.mocked(infiniteQueryRepliesOption).mockImplementation(
			(commentId, repliesCount) =>
				infiniteQueryOptions({
					queryKey: ['replies', commentId],
					queryFn: getReplies,
					initialPageParam: 0,
					getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
						repliesCount > lastPageParam + 10 ? lastPageParam + 10 : null,
				}),
		);
		vi.mocked(getReplies).mockResolvedValueOnce({
			data: mockReplies,
		});
		window.HTMLElement.prototype.scrollIntoView = vi.fn();
		const queryClient = new QueryClient();

		render(
			<QueryClientProvider client={queryClient}>
				<Replies {...mockProps} />
			</QueryClientProvider>,
		);

		const scrollButton = await screen.findByRole('button', {
			name: 'Scroll to target',
		});

		await user.click(scrollButton);

		vi.useFakeTimers();

		fireEvent.scroll(window);

		act(() => {
			vi.runAllTimers();
		});

		vi.useRealTimers();

		const replies = screen.getAllByTestId('reply');

		expect(replies[0]).toHaveClass(/shake/);
		fireEvent.animationEnd(replies[0]);
		expect(replies[0]).not.toHaveClass(/shake/);
	});
	it('should render the more replies if the show more replies button is clicked', async () => {
		const user = userEvent.setup();

		const mockReplies = {
			data: [...Array(20).keys()].map(index => ({
				_id: index,
				content: `reply${index + 1}`,
			})),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		let mockProps = {
			postId: '1',
			commentId: '1',
			repliesCount: 20,
			renderRepliesCount: 10,
			onAddingRepliesCount: vi.fn(),
		};
		vi.mocked(ReplyDetail).mockImplementation(({ reply }) => (
			<li key={reply._id}>{reply.content}</li>
		));
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(infiniteQueryRepliesOption).mockImplementation(
			(commentId, repliesCount) =>
				infiniteQueryOptions({
					queryKey: ['replies', commentId],
					queryFn: getReplies,
					initialPageParam: 0,
					getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
						repliesCount > lastPageParam + 10 ? lastPageParam + 10 : null,
				}),
		);
		vi.mocked(getReplies).mockResolvedValue(mockReplies);

		const queryClient = new QueryClient();

		render(
			<QueryClientProvider client={queryClient}>
				<Replies {...mockProps} />
			</QueryClientProvider>,
		);

		const button = await screen.findByRole('button', {
			name: /show more replies/,
		});

		await user.click(button);

		expect(mockProps.onAddingRepliesCount).toHaveBeenCalledTimes(1);
	});
	it('should load next replies if the load more replies button is clicked', async () => {
		const user = userEvent.setup();

		const mockReplies = {
			data: [...Array(10).keys()].map(index => ({
				_id: index,
				content: `reply${index + 1}`,
			})),
		};

		const mockNextFetchData = {
			data: [...Array(10).keys()].map(index => ({
				_id: index + 10,
				content: `reply${index + 11}`,
			})),
		};

		let mockProps = {
			postId: '1',
			commentId: '1',
			repliesCount: 20,
			renderRepliesCount: 10,
			onAddingRepliesCount: vi.fn(),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		vi.mocked(ReplyDetail).mockImplementation(({ reply }) => (
			<li key={reply._id}>{reply.content}</li>
		));
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(infiniteQueryRepliesOption).mockImplementation(
			(commentId, repliesCount) =>
				infiniteQueryOptions({
					queryKey: ['replies', commentId],
					queryFn: getReplies,
					initialPageParam: 0,
					getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
						repliesCount > lastPageParam + 10 ? lastPageParam + 10 : null,
				}),
		);
		vi.mocked(getReplies)
			.mockResolvedValueOnce(mockReplies)
			.mockImplementationOnce(
				async () =>
					await new Promise(resolve =>
						setTimeout(() => resolve(mockNextFetchData), 100),
					),
			);

		const queryClient = new QueryClient();

		render(
			<QueryClientProvider client={queryClient}>
				<Replies {...mockProps} />
			</QueryClientProvider>,
		);

		const button = await screen.findByRole('button', {
			name: /load more replies/,
		});

		await user.click(button);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		expect(mockProps.onAddingRepliesCount).toHaveBeenCalledTimes(1);
	});
	it('should render an error alert if load next replies fails', async () => {
		const user = userEvent.setup();

		const mockReplies = {
			data: [...Array(10).keys()].map(index => ({
				_id: index,
				content: `reply${index + 1}`,
			})),
		};

		let mockProps = {
			postId: '1',
			commentId: '1',
			repliesCount: 20,
			renderRepliesCount: 10,
			onAddingRepliesCount: vi.fn(),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		vi.mocked(getReplies)
			.mockResolvedValueOnce(mockReplies)
			.mockRejectedValueOnce(new Error('error'));

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		vi.mocked(ReplyDetail).mockImplementation(({ reply }) => (
			<li key={reply._id}>{reply.content}</li>
		));
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(infiniteQueryRepliesOption).mockImplementation(
			(commentId, repliesCount) =>
				infiniteQueryOptions({
					queryKey: ['replies', commentId],
					queryFn: getReplies,
					initialPageParam: 0,
					getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
						repliesCount > lastPageParam + 10 ? lastPageParam + 10 : null,
					retry: false,
				}),
		);

		const queryClient = new QueryClient();

		render(
			<QueryClientProvider client={queryClient}>
				<Replies {...mockProps} />
			</QueryClientProvider>,
		);

		const button = await screen.findByRole('button', {
			name: /load more replies/,
		});

		await user.click(button);

		expect(mockCustomHook.onAlert).toHaveBeenCalledTimes(1);
	});
});

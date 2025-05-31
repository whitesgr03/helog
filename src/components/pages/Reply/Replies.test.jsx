import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
	fireEvent,
	waitFor,
} from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';

import {
	QueryClientProvider,
	QueryClient,
	QueryCache,
	infiniteQueryOptions,
} from '@tanstack/react-query';

import { Replies } from './Replies';
import { ReplyDetail } from './ReplyDetail';

import { getReplies } from '../../../utils/handleReply';
import { Loading } from '../../utils/Loading';

import { infiniteQueryRepliesOption } from '../../../utils/queryOptions';

vi.mock('../../../utils/queryOptions');
vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleReply');
vi.mock('./ReplyDetail');

describe('Replies component', () => {
	it('should render the replies data', async () => {
		const mockReplies = [
			{
				_id: '0',
				content: 'reply1',
			},
			{
				_id: '1',
				content: 'reply2',
			},
			{
				_id: '2',
				content: 'reply3',
			},
			{
				_id: '3',
				content: 'reply4',
			},
			{
				_id: '4',
				content: 'reply5',
			},
			{
				_id: '5',
				content: 'reply6',
			},
			{
				_id: '6',
				content: 'reply7',
			},
			{
				_id: '7',
				content: 'reply8',
			},
			{
				_id: '8',
				content: 'reply9',
			},
			{
				_id: '9',
				content: 'reply10',
			},
		];
		let mockProps = {
			postId: '1',
			commentId: '1',
			repliesCount: 0,
			renderRepliesCount: 10,
			onAddRenderRepliesCount: vi.fn(),
		};
		mockProps.repliesCount = mockReplies.length;

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
		vi.mocked(getReplies).mockResolvedValueOnce({
			data: mockReplies,
		});
		const queryClient = new QueryClient();

		render(
			<QueryClientProvider client={queryClient}>
				<Replies {...mockProps} />,
			</QueryClientProvider>,
		);

		await waitFor(() => {
			mockReplies.forEach(reply => {
				expect(screen.getByText(reply.content)).toBeInTheDocument();
			});
		});
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
			onAddRenderRepliesCount: vi.fn(),
		};
		mockProps.repliesCount = mockReplies.length;

		vi.mocked(ReplyDetail).mockImplementation(({ reply, onScroll }) => (
			<>
				<div>{reply.content}</div>
				{onScroll && (
					<button onClick={() => onScroll(reply.reply._id)}>
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
	it('should fetch next replies if the show more replies button is clicked', async () => {
		const user = userEvent.setup();
		const mockFirstFetchReplies = [
			{
				_id: '0',
				content: 'reply1',
			},
			{
				_id: '1',
				content: 'reply2',
			},
			{
				_id: '2',
				content: 'reply3',
			},
			{
				_id: '3',
				content: 'reply4',
			},
			{
				_id: '4',
				content: 'reply5',
			},
			{
				_id: '5',
				content: 'reply6',
			},
			{
				_id: '6',
				content: 'reply7',
			},
			{
				_id: '7',
				content: 'reply8',
			},
			{
				_id: '8',
				content: 'reply9',
			},
			{
				_id: '9',
				content: 'reply10',
			},
		];
		const mockNextFetchReplies = [
			{
				_id: '10',
				content: 'reply11',
			},
			{
				_id: '11',
				content: 'reply12',
			},
			{
				_id: '12',
				content: 'reply13',
			},
			{
				_id: '13',
				content: 'reply14',
			},
			{
				_id: '14',
				content: 'reply15',
			},
		];
		let mockProps = {
			postId: '1',
			commentId: '1',
			repliesCount: 0,
			renderRepliesCount: 10,
			onAddRenderRepliesCount: vi.fn(),
		};
		mockProps.repliesCount =
			mockFirstFetchReplies.length + mockNextFetchReplies.length;

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
			.mockResolvedValueOnce({
				data: mockFirstFetchReplies,
			})
			.mockImplementationOnce(
				async () =>
					await new Promise(resolve =>
						setTimeout(
							() =>
								resolve({
									data: mockNextFetchReplies,
								}),
							300,
						),
					),
			);

		const queryClient = new QueryClient();

		const { rerender } = render(
			<QueryClientProvider client={queryClient}>
				<Replies {...mockProps} />,
			</QueryClientProvider>,
		);

		const showMoreButton = await screen.findByRole('button', {
			name: 'Show more replies',
		});

		mockFirstFetchReplies.forEach(reply => {
			expect(screen.getByText(reply.content)).toBeInTheDocument();
		});

		await user.click(showMoreButton);

		await waitForElementToBeRemoved(() =>
			screen.queryByText('Loading component'),
		);

		mockProps.renderRepliesCount = 20;

		rerender(
			<QueryClientProvider client={queryClient}>
				<Replies {...mockProps} />,
			</QueryClientProvider>,
		);

		const mockFetchData = mockFirstFetchReplies.concat(mockNextFetchReplies);

		mockFetchData.forEach(reply => {
			expect(screen.getByText(reply.content)).toBeInTheDocument();
		});
		expect(mockProps.onAddRenderRepliesCount).toBeCalledTimes(1);
	});
});

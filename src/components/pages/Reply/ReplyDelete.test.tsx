import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ReplyDelete } from './ReplyDelete';
import { Loading } from '../../utils/Loading';

import { deleteReply } from '../../../utils/handleReply';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleReply');
vi.mock('../App/AppContext');

describe('ReplyDelete component', () => {
	it('should render an error message alert if delete a reply fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(deleteReply).mockImplementationOnce(
			() => new Promise((_r, reject) => setTimeout(() => reject(Error()), 300)),
		);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));

		const queryClient = new QueryClient();

		render(
			<QueryClientProvider client={queryClient}>
				<ReplyDelete {...mockProps} />
			</QueryClientProvider>,
		);

		const button = screen.getByRole('button', { name: 'Delete' });

		await user.click(button);

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		expect(deleteReply).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockCustomHook.onModal).toBeCalledTimes(2);
	});
	it('should close modal if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();

		render(
			<QueryClientProvider client={queryClient}>
				<ReplyDelete {...mockProps} />
			</QueryClientProvider>,
		);

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);
	});
	it('should delete a reply if the delete button is clicked', async () => {
		const user = userEvent.setup();

		const mockFetchResult = {
			success: true,
			data: {},
		};

		const mockProps = {
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(deleteReply).mockImplementationOnce(
			() =>
				new Promise(resolve => setTimeout(() => resolve(mockFetchResult), 300)),
		);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));

		const queryClient = new QueryClient();

		queryClient.setQueryData(['replies', mockProps.commentId], {
			pages: [{ data: { replies: [{ _id: mockProps.replyId }] } }],
			pageParams: {},
		});

		render(
			<QueryClientProvider client={queryClient}>
				<ReplyDelete {...mockProps} />
			</QueryClientProvider>,
		);

		const button = screen.getByRole('button', { name: 'Delete' });

		await user.click(button);

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		expect(deleteReply).toBeCalledTimes(1);
		expect(deleteReply).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockCustomHook.onModal).toBeCalledTimes(2);
	});
});

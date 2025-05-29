import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { CommentDelete } from './CommentDelete';
import { Loading } from '../../utils/Loading';

import { deleteComment } from '../../../utils/handleComment';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleComment');
vi.mock('../App/AppContext');

describe('CommentDelete component', () => {
	it('should render an error alert if delete a comment fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			commentId: '0',
		};
		const postId = '1';

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		vi.mocked(deleteComment).mockImplementationOnce(
			() => new Promise((_r, reject) => setTimeout(() => reject(Error()), 300)),
		);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));

		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: `/:postId`,
					element: <CommentDelete {...mockProps} />,
				},
			],
			{
				initialEntries: [`/${postId}`],
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

		const button = screen.getByRole('button', { name: 'Delete' });

		await user.click(button);

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		expect(deleteComment).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockCustomHook.onModal).toBeCalledTimes(2);
	});
	it('should delete a comment if the delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			commentId: '0',
		};
		const mockFetchResult = {
			success: true,
			data: {},
		};
		const postId = '1';

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(deleteComment).mockResolvedValue(mockFetchResult);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();

		queryClient.setQueryData(['comments', postId], {
			pages: [{ data: { comments: [{ _id: mockProps.commentId }] } }],
			pageParams: {},
		});

		const router = createMemoryRouter(
			[
				{
					path: `/:postId`,
					element: <CommentDelete {...mockProps} />,
				},
			],
			{
				initialEntries: [`/${postId}`],
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

		const button = screen.getByRole('button', { name: 'Delete' });

		await user.click(button);

		expect(deleteComment).toBeCalledTimes(1);
		expect(deleteComment).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockCustomHook.onModal).toBeCalledTimes(2);
	});
	it('should close modal if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			commentId: '0',
		};
		const postId = '1';

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: `/:postId`,
					element: <CommentDelete {...mockProps} />,
				},
			],
			{
				initialEntries: [`/${postId}`],
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

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);
	});
});

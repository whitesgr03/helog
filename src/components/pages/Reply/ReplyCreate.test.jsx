import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { ReplyCreate } from './ReplyCreate';
import { Loading } from '../../utils/Loading';

import { createReply } from '../../../utils/handleReply';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../App/AppContext');
vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleReply');

describe('ReplyCreate component', () => {
	it('should render the username if the username state is provided', async () => {
		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockProps = {
			commentId: '1',
			replyId: '1',
			onShowReplyBox: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyCreate {...mockProps} />,
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
		const username = screen.getByText(userData.data.username);

		expect(username).toBeInTheDocument();
	});
	it('should change the reply field values if the reply field is entered', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';
		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockProps = {
			commentId: '1',
			replyId: '1',
			onShowReplyBox: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyCreate {...mockProps} />,
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

		const replyField = screen.getByPlaceholderText('write a comment...');

		await user.type(replyField, mockContent);

		expect(replyField).toHaveValue(mockContent);
	});
	it('should close this component if the cancel button is clicked', async () => {
		const user = userEvent.setup();

		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockProps = {
			commentId: '1',
			replyId: '1',
			onShowReplyBox: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyCreate {...mockProps} />,
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

		const cancelButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(cancelButton);

		expect(mockProps.onShowReplyBox).toBeCalledTimes(1);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();

		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockProps = {
			commentId: '1',
			replyId: '1',
			onShowReplyBox: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.click(submitButton);

		const labelElement = screen.getByTestId('label');
		const replyErrorMessage = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessage).toBeInTheDocument();
	});
	it('should validate each input after a failed submission', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';
		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockProps = {
			commentId: '1',
			replyId: '1',
			onShowReplyBox: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		const replyField = screen.getByPlaceholderText('write a comment...');
		const labelElement = screen.getByTestId('label');

		await user.click(submitButton);

		const replyErrorMessageElement = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessageElement).toBeInTheDocument();

		await user.type(replyField, mockContent);

		await waitForElementToBeRemoved(() => screen.getByTestId('error-message'));
		expect(labelElement).not.toHaveClass(/error/);
	});
	it(`should render an error field message if a new reply create fails`, async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';

		const mockFetchResult = {
			success: false,
			fields: {
				content: 'error',
			},
		};
		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockProps = {
			commentId: '1',
			replyId: '1',
			onShowReplyBox: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(createReply).mockResolvedValue(mockFetchResult);
		vi.mocked(createReply).mockImplementationOnce(
			() =>
				new Promise(resolve => setTimeout(() => resolve(mockFetchResult), 300)),
		);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		const replyField = screen.getByPlaceholderText('write a comment...');
		const labelElement = screen.getByTestId('label');

		await user.type(replyField, mockContent);

		await user.click(submitButton);

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const replyErrorMessageElement = screen.getByTestId('error-message');

		expect(createReply).toBeCalledTimes(1);
		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessageElement).toHaveTextContent(
			mockFetchResult.fields.content,
		);
	});
	it('should render an error alert if a new reply create fails', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';

		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockProps = {
			commentId: '1',
			replyId: '1',
			onShowReplyBox: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(createReply).mockRejectedValue(Error());
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		const replyField = screen.getByPlaceholderText('write a comment...');

		await user.type(replyField, mockContent);
		await user.click(submitButton);

		expect(createReply).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
	it('should create a new reply if the reply field successfully validates after user submission', async () => {
		const user = userEvent.setup();

		const mockFetchResult = {
			success: true,
			data: { _id: '1' },
		};

		const postId = '1';

		const mockContent = '_changed';
		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockProps = {
			commentId: '1',
			replyId: '1',
			onShowReplyBox: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(createReply).mockResolvedValue(mockFetchResult);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();
		queryClient.setQueryData(['comments', postId], {
			pages: [
				{ data: { comments: [{ _id: mockProps.commentId, child: [] }] } },
			],
			pageParams: {},
		});
		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/:postId',
					element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		const replyField = screen.getByPlaceholderText('write a comment...');

		await user.type(replyField, mockContent);
		await user.click(submitButton);

		expect(createReply).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockProps.onShowReplyBox).toBeCalledTimes(1);
	});
});

import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { ReplyUpdate } from './ReplyUpdate';
import { Loading } from '../../utils/Loading';

import { updateReply } from '../../../utils/handleReply';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleReply');
vi.mock('../App/AppContext');

describe('ReplyUpdate component', () => {
	it('should close this component if the cancel button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			content: 'reply',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyUpdate {...mockProps} />,
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

		expect(mockProps.onCloseCommentBox).toBeCalledTimes(1);
	});
	it('should change the reply field values if the reply field is entered', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';
		const mockProps = {
			content: 'reply',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyUpdate {...mockProps} />,
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

		const replyField = screen.getByDisplayValue(mockProps.content);

		await user.type(replyField, mockContent);

		expect(replyField).toHaveValue(`${mockProps.content}${mockContent}`);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			content: 'reply',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyUpdate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Save' });

		await user.click(submitButton);

		const labelElement = screen.getByTestId('label');
		const replyErrorMessage = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessage).toBeInTheDocument();
	});
	it('should validate each input after a failed submission', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';
		const mockProps = {
			content: 'reply',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyUpdate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Save' });
		const replyField = screen.getByDisplayValue(mockProps.content);
		const labelElement = screen.getByTestId('label');

		await user.click(submitButton);

		const replyErrorMessageElement = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessageElement).toBeInTheDocument();

		await user.type(replyField, mockContent);

		await waitForElementToBeRemoved(() => screen.getByTestId('error-message'));
		expect(labelElement).not.toHaveClass(/error/);
	});
	it('should render an error field message if the reply update fails', async () => {
		const user = userEvent.setup();

		const mockFetchResult = {
			success: false,
			fields: {
				content: 'reply',
			},
		};

		const mockContent = '_changed';

		const mockProps = {
			content: 'reply',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(updateReply).mockImplementationOnce(
			() =>
				new Promise(resolve => setTimeout(() => resolve(mockFetchResult), 300)),
		);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyUpdate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Save' });
		const replyField = screen.getByDisplayValue(mockProps.content);
		const labelElement = screen.getByTestId('label');

		await user.type(replyField, mockContent);
		await user.click(submitButton);

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		const replyErrorMessageElement = screen.getByTestId('error-message');

		expect(updateReply).toBeCalledTimes(1);
		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessageElement).toHaveTextContent(
			mockFetchResult.fields.content,
		);
	});
	it('should render an error message alert if the reply update fails', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';
		const mockProps = {
			content: 'reply',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(updateReply).mockRejectedValue(Error());
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyUpdate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Save' });
		const replyField = screen.getByDisplayValue(mockProps.content);

		await user.type(replyField, mockContent);
		user.click(submitButton);
		const loadingComponent = await screen.findByText('Loading component');
		expect(updateReply).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should update the reply if the reply field successfully validates after user submission', async () => {
		const user = userEvent.setup();

		const mockFetchResult = {
			success: true,
			data: {},
		};

		const mockContent = '_changed';
		const mockProps = {
			content: 'reply',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
			replyId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(updateReply).mockResolvedValue(mockFetchResult);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		queryClient.setQueryData(['replies', mockProps.commentId], {
			pages: [{ data: [{ _id: mockProps.replyId }] }],
			pageParams: {},
		});
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ReplyUpdate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Save' });
		const replyField = screen.getByDisplayValue(mockProps.content);

		await user.type(replyField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(updateReply).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockProps.onCloseCommentBox).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});

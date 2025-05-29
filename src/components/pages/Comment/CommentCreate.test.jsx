import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { CommentCreate } from './CommentCreate';
import { Loading } from '../../utils/Loading';

import { createComment } from '../../../utils/handleComment';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleComment');
vi.mock('../App/AppContext');

describe('CommentCreate component', () => {
	it('should render the username if the username state is provided', async () => {
		const userData = {
			data: {
				username: 'example',
			},
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
					element: <CommentCreate postId={'1'} />,
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
	it('should change the comment field values if the comment field is entered', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';

		const userData = {
			data: {
				username: 'example',
			},
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
					element: <CommentCreate postId={'1'} />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');

		await user.type(commentField, mockContent);

		expect(commentField).toHaveValue(mockContent);
	});
	it('should render the cancel and comment buttons if the user data is provided and comment field is focused', async () => {
		const userData = {
			data: {
				username: 'example',
			},
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
					element: <CommentCreate postId={'1'} />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');

		await waitFor(() => {
			commentField.focus();
		});

		const closeButton = screen.getByRole('button', { name: 'Cancel' });
		const commentButton = screen.getByRole('button', { name: 'Comment' });

		expect(closeButton).toBeInTheDocument();
		expect(commentButton).toBeInTheDocument();
	});
	it('should render an error alert and blur the comment field if the user data is not provided and comment field is focused', async () => {
		const userData = {
			data: {
				username: 'example',
			},
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
					element: <CommentCreate postId={'1'} />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');

		await waitFor(() => {
			commentField.focus();
		});

		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(commentField).not.toHaveFocus();
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const userData = {
			data: {
				username: 'example',
			},
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
					element: <CommentCreate postId={'1'} />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');
		await waitFor(() => {
			commentField.focus();
		});
		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.click(submitButton);

		const labelElement = screen.getByTestId('label');
		const commentErrorMessage = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(commentErrorMessage).toBeInTheDocument();
	});
	it('should validate each input after a failed submission', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';

		const userData = {
			data: {
				username: 'example',
			},
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
					element: <CommentCreate postId={'1'} />,
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
		const commentField = screen.getByPlaceholderText('write a comment...');

		await waitFor(() => {
			commentField.focus();
		});
		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.click(submitButton);

		const labelElement = screen.getByTestId('label');
		const commentErrorMessageElement = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(commentErrorMessageElement).toBeInTheDocument();

		await user.type(commentField, mockContent);

		await waitForElementToBeRemoved(() => screen.getByTestId('error-message'));
		expect(labelElement).not.toHaveClass(/error/);
	});
	it('should render an error field message if a new comment create fails', async () => {
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
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(createComment).mockResolvedValue(mockFetchResult);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentCreate postId={'1'} />,
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
		const commentField = screen.getByPlaceholderText('write a comment...');
		await waitFor(() => {
			commentField.focus();
		});
		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.type(commentField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		const labelElement = screen.getByTestId('label');
		const commentErrorMessageElement = screen.getByTestId('error-message');

		expect(createComment).toBeCalledTimes(1);
		expect(labelElement).toHaveClass(/error/);
		expect(commentErrorMessageElement).toHaveTextContent(
			mockFetchResult.fields.content,
		);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should render an error alert if a new comment create fails', async () => {
		const user = userEvent.setup();
		const mockContent = '_changed';
		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(createComment).mockRejectedValue(Error());
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentCreate postId={'1'} />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');
		await waitFor(() => {
			commentField.focus();
		});
		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.type(commentField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(createComment).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should create a new comment if the comment field successfully validates after user submission', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';

		const mockFetchResult = {
			success: true,
		};
		const userData = {
			data: {
				username: 'example',
			},
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(createComment).mockResolvedValue(mockFetchResult);
		vi.mocked(Loading).mockImplementation(() => <div>Loading component</div>);
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], userData);
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <CommentCreate postId={'1'} />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');
		await waitFor(() => {
			commentField.focus();
		});
		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.type(commentField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(createComment).toBeCalledTimes(1);
		expect(createComment).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);

		expect(submitButton).not.toBeInTheDocument();
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should revert the CommentCreate component to initial state if the cancel button is clicked', async () => {
		const user = userEvent.setup();

		const mockContent = '!@#';

		const userData = {
			data: {
				username: 'example',
			},
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
					element: <CommentCreate postId={'1'} />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');
		await waitFor(() => {
			commentField.focus();
		});
		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.type(commentField, mockContent);

		expect(commentField).toHaveValue(mockContent);

		user.click(closeButton);

		await waitFor(() => {
			expect(closeButton).not.toBeInTheDocument();
			expect(commentField).not.toHaveValue(mockContent);
		});
	});
});

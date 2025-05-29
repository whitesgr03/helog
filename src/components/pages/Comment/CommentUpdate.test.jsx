import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { CommentUpdate } from './CommentUpdate';
import { Loading } from '../../utils/Loading';

import { updateComment } from '../../../utils/handleComment';
import { useAppDataAPI } from '../App/AppContext';

vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleComment');
vi.mock('../App/AppContext');

describe('CommentUpdate component', () => {
	it('should close this component if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			content: 'comment',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
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
					element: <CommentUpdate {...mockProps} />,
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
	it('should change the comment field values if the comment field is entered', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';

		const mockProps = {
			content: 'comment',

			onCloseCommentBox: vi.fn(),
			commentId: '1',
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
					element: <CommentUpdate {...mockProps} />,
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

		const commentField = screen.getByDisplayValue(mockProps.content);

		await user.type(commentField, mockContent);

		expect(commentField).toHaveValue(`${mockProps.content}${mockContent}`);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			content: 'comment',

			onCloseCommentBox: vi.fn(),
			commentId: '1',
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
					element: <CommentUpdate {...mockProps} />,
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
		const commentErrorMessage = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(commentErrorMessage).toBeInTheDocument();
	});
	it('should validate each input after a failed submission', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';
		const mockProps = {
			content: 'comment',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
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
					element: <CommentUpdate {...mockProps} />,
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
		const commentField = screen.getByDisplayValue(mockProps.content);
		const labelElement = screen.getByTestId('label');

		await user.click(submitButton);

		const commentErrorMessageElement = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(commentErrorMessageElement).toBeInTheDocument();

		await user.type(commentField, mockContent);

		await waitForElementToBeRemoved(() => screen.getByTestId('error-message'));
		expect(labelElement).not.toHaveClass(/error/);
	});
	it('should render an error field message if the comment update fails', async () => {
		const user = userEvent.setup();

		const mockResolve = {
			success: false,
			fields: {
				content: 'error',
			},
		};

		const mockContent = '_changed';

		vi.mocked(updateComment).mockResolvedValueOnce(mockResolve);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		const mockProps = {
			content: 'comment',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
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
					element: <CommentUpdate {...mockProps} />,
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
		const commentField = screen.getByDisplayValue(mockProps.content);
		const labelElement = screen.getByTestId('label');

		await user.type(commentField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		const commentErrorMessageElement = screen.getByTestId('error-message');

		expect(updateComment).toBeCalledTimes(1);
		expect(labelElement).toHaveClass(/error/);
		expect(commentErrorMessageElement).toHaveTextContent(
			mockResolve.fields.content,
		);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should render an error message alert if the comment update fails', async () => {
		const user = userEvent.setup();

		const mockContent = '_changed';
		vi.mocked(updateComment).mockImplementationOnce(
			() => new Promise((_r, reject) => setTimeout(() => reject(Error()), 300)),
		);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		const mockProps = {
			content: 'comment',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
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
					element: <CommentUpdate {...mockProps} />,
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
		const commentField = screen.getByDisplayValue(mockProps.content);

		await user.type(commentField, mockContent);
		await user.click(submitButton);

		await waitForElementToBeRemoved(() =>
			screen.getByText('Loading component'),
		);

		expect(updateComment).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
	it('should update the comment if the comment field successfully validates after user submission', async () => {
		const user = userEvent.setup();

		const postId = '1';
		const mockResolve = {
			success: true,
			data: {},
		};
		const mockContent = '_changed';

		vi.mocked(updateComment).mockResolvedValueOnce(mockResolve);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		const mockProps = {
			content: 'comment',
			onCloseCommentBox: vi.fn(),
			commentId: '1',
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		queryClient.setQueryData(['comments', postId], {
			pages: [{ data: { comments: [{ _id: mockProps.commentId }] } }],
			pageParams: {},
		});
		const router = createMemoryRouter(
			[
				{
					path: `/post/:postId`,
					element: <CommentUpdate {...mockProps} />,
				},
			],
			{
				initialEntries: [`/post/${postId}`],
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
		const commentField = screen.getByDisplayValue(mockProps.content);

		await user.type(commentField, mockContent);
		await user.click(submitButton);

		expect(updateComment).toBeCalledTimes(1);
		expect(mockProps.onCloseCommentBox).toBeCalledTimes(1);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
	});
});

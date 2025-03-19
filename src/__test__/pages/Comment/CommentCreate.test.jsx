import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { CommentCreate } from '../../../components/pages/Comment/CommentCreate';
import { Loading } from '../../../components/utils/Loading';

import { createComment } from '../../../utils/handleComment';

vi.mock('../../../components/utils/Loading');
vi.mock('../../../utils/handleComment');

describe('CommentCreate component', () => {
	it('should render the username if the username state is provided', async () => {
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
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
							element: <CommentCreate />,
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

		const username = screen.getByText(mockContext.user.username);

		expect(username).toBeInTheDocument();
	});
	it('should change the comment field values if the comment field is entered', async () => {
		const user = userEvent.setup();
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockContent = '_changed';

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <CommentCreate />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');

		await user.type(commentField, mockContent);

		expect(commentField).toHaveValue(mockContent);
	});
	it('should render the cancel and comment buttons if the user is logged in and comment field is focused', async () => {
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
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
							element: <CommentCreate />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');

		await waitFor(() => {
			commentField.focus();
		});

		const closeButton = screen.getByRole('button', { name: 'Cancel' });
		const commentButton = screen.getByRole('button', { name: 'Comment' });

		expect(closeButton).toBeInTheDocument();
		expect(commentButton).toBeInTheDocument();
	});
	it('should render an error alert and blur the comment field if the user is not logged in and comment field is focused', async () => {
		const mockContext = {
			user: null,
			onAlert: vi.fn(),
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
							element: <CommentCreate />,
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

		const commentField = screen.getByPlaceholderText('write a comment...');

		await waitFor(() => {
			commentField.focus();
		});

		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(commentField).not.toHaveFocus();
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
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
							element: <CommentCreate />,
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
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockContent = '_changed';

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <CommentCreate />,
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
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
					},
				],
			},
		};

		mockProps.post.countComments = mockProps.post.comments.length;

		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};
		const mockContent = '_changed';

		const mockFetchResult = {
			success: false,
			fields: {
				content: 'error',
			},
		};

		createComment.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <CommentCreate {...mockProps} />,
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
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
					},
				],
			},
		};

		mockProps.post.countComments = mockProps.post.comments.length;

		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};
		const mockContent = '_changed';

		const mockFetchResult = {
			success: false,
		};

		createComment.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <CommentCreate {...mockProps} />,
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
		const commentField = screen.getByPlaceholderText('write a comment...');
		await waitFor(() => {
			commentField.focus();
		});
		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.type(commentField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(createComment).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should create a new comment if the comment field successfully validates after user submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
					},
				],
			},
			onUpdatePost: vi.fn(),
		};

		mockProps.post.countComments = mockProps.post.comments.length;

		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
		};
		const mockContent = '_changed';

		const mockFetchResult = {
			success: true,
		};

		createComment.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <CommentCreate {...mockProps} />,
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
		const commentField = screen.getByPlaceholderText('write a comment...');
		await waitFor(() => {
			commentField.focus();
		});
		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.type(commentField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(createComment).toBeCalledTimes(1);
		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);

		expect(submitButton).not.toBeInTheDocument();
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should revert the CommentCreate component to initial state if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
					},
				],
			},
		};

		mockProps.post.countComments = mockProps.post.comments.length;

		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};
		const mockContent = '!@#';

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <CommentCreate {...mockProps} />,
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

import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { CommentUpdate } from './CommentUpdate';
import { Loading } from '../../utils/Loading';

import { updateComment } from '../../../utils/handleComment';

vi.mock('../../../components/utils/Loading');
vi.mock('../../../utils/handlecomment');

describe('CommentUpdate component', () => {
	it('should close this component if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			comment: {
				content: 'comment',
			},
			onCloseCommentBox: vi.fn(),
		};

		const mockContext = {
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
							element: <CommentUpdate {...mockProps} />,
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

		const cancelButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(cancelButton);

		expect(mockProps.onCloseCommentBox).toBeCalledTimes(1);
	});
	it('should change the comment field values if the comment field is entered', async () => {
		const user = userEvent.setup();
		const mockProps = {
			comment: {
				content: 'comment',
			},
		};

		const mockContext = {
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
							element: <CommentUpdate {...mockProps} />,
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

		const commentField = screen.getByDisplayValue(mockProps.comment.content);

		await user.type(commentField, mockContent);

		expect(commentField).toHaveValue(
			`${mockProps.comment.content}${mockContent}`,
		);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			comment: {
				content: 'comment',
			},
		};

		const mockContext = {
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
							element: <CommentUpdate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Update' });

		await user.click(submitButton);

		const labelElement = screen.getByTestId('label');
		const commentErrorMessage = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(commentErrorMessage).toBeInTheDocument();
	});
	it('should validate each input after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			comment: {
				content: 'comment',
			},
		};

		const mockContext = {
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
							element: <CommentUpdate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Update' });
		const commentField = screen.getByDisplayValue(mockProps.comment.content);
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
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
						content: 'comment',
					},
				],
			},
		};

		const mockContext = {
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockResolve = {
			success: false,
			fields: {
				content: 'error',
			},
		};

		const mockContent = '_changed';

		updateComment.mockResolvedValueOnce(mockResolve);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentUpdate
									{...mockProps}
									comment={mockProps.post.comments[0]}
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

		const submitButton = screen.getByRole('button', { name: 'Update' });
		const commentField = screen.getByDisplayValue(
			mockProps.post.comments[0].content,
		);
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
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
						content: 'comment',
					},
				],
			},
		};

		const mockContext = {
			onAlert: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockResolve = {
			success: false,
		};

		const mockContent = '_changed';

		updateComment.mockResolvedValueOnce(mockResolve);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentUpdate
									{...mockProps}
									comment={mockProps.post.comments[0]}
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

		const submitButton = screen.getByRole('button', { name: 'Update' });
		const commentField = screen.getByDisplayValue(
			mockProps.post.comments[0].content,
		);

		await user.type(commentField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(updateComment).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should update the comment if the comment field successfully validates after user submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
						content: 'comment',
					},
				],
			},
			onCloseCommentBox: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};

		const mockResolve = {
			success: true,
			data: {},
		};

		const mockContent = '_changed';

		updateComment.mockResolvedValueOnce(mockResolve);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<CommentUpdate
									{...mockProps}
									comment={mockProps.post.comments[0]}
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

		const submitButton = screen.getByRole('button', { name: 'Update' });
		const commentField = screen.getByDisplayValue(
			mockProps.post.comments[0].content,
		);

		await user.type(commentField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(updateComment).toBeCalledTimes(1);
		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(mockProps.onCloseCommentBox).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});

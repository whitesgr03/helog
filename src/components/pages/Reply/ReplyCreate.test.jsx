import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { ReplyCreate } from './ReplyCreate';
import { Loading } from '../../utils/Loading';

import { createReply, replyComment } from '../../../utils/handleReply';

vi.mock('../../../components/utils/Loading');
vi.mock('../../../utils/handleReply');

describe('ReplyCreate component', () => {
	it('should render the username if the username state is provided', async () => {
		const mockProps = {
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyCreate {...mockProps} />,
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
	it('should change the reply field values if the reply field is entered', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onUpdatePost: vi.fn(),
		};
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
							element: <ReplyCreate {...mockProps} />,
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

		const replyField = screen.getByPlaceholderText('write a comment...');

		await user.type(replyField, mockContent);

		expect(replyField).toHaveValue(mockContent);
	});
	it('should close this component if the cancel button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onCloseReplyBox: vi.fn(),
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyCreate {...mockProps} />,
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

		expect(mockProps.onCloseReplyBox).toBeCalledTimes(1);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		await user.click(submitButton);

		const labelElement = screen.getByTestId('label');
		const replyErrorMessage = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessage).toBeInTheDocument();
	});
	it('should validate each input after a failed submission', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
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
							element: <ReplyCreate {...mockProps} />,
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
	it('should render an error field message if the comment reply fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			comment: {
				_id: '0',
			},
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
		};
		const mockContent = '_changed';

		const mockFetchResult = {
			success: false,
			fields: {
				content: 'error',
			},
		};

		replyComment.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		const replyField = screen.getByPlaceholderText('write a comment...');
		const labelElement = screen.getByTestId('label');

		await user.type(replyField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		const replyErrorMessageElement = screen.getByTestId('error-message');

		expect(replyComment).toBeCalledTimes(1);
		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessageElement).toHaveTextContent(
			mockFetchResult.fields.content,
		);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should render an error field message if a new reply create fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			reply: {
				_id: '0',
			},
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
		};
		const mockContent = '_changed';

		const mockFetchResult = {
			success: false,
			fields: {
				content: 'error',
			},
		};

		createReply.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		const replyField = screen.getByPlaceholderText('write a comment...');
		const labelElement = screen.getByTestId('label');

		await user.type(replyField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		const replyErrorMessageElement = screen.getByTestId('error-message');

		expect(createReply).toBeCalledTimes(1);
		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessageElement).toHaveTextContent(
			mockFetchResult.fields.content,
		);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should render an error message alert if a new reply create fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			reply: {
				_id: '0',
			},
			onUpdatePost: vi.fn(),
		};
		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
		};
		const mockContent = '_changed';

		const mockFetchResult = {
			success: false,
		};

		createReply.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		const replyField = screen.getByPlaceholderText('write a comment...');

		await user.type(replyField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(createReply).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should create a new reply if the reply field successfully validates after user submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				comments: [
					{
						_id: '0',
					},
				],
			},
			comment: { _id: '0' },
			reply: {
				_id: '0',
				content: '',
			},
			onCloseReplyBox: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			user: {
				username: 'example',
			},
			onAlert: vi.fn(),
		};

		const mockFetchResult = {
			success: true,
			data: {},
		};

		const mockContent = '_changed';

		createReply.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyCreate {...mockProps} />,
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

		const submitButton = screen.getByRole('button', { name: 'Comment' });

		const replyField = screen.getByPlaceholderText('write a comment...');

		await user.type(replyField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(createReply).toBeCalledTimes(1);
		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(mockProps.onCloseReplyBox).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});

import { vi, describe, it, expect } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { ReplyUpdate } from '../../../components/pages/Reply/ReplyUpdate';
import { Loading } from '../../../components/utils/Loading';

import { updateReply } from '../../../utils/handleReply';

vi.mock('../../../components/utils/Loading');
vi.mock('../../../utils/handleReply');

describe('ReplyUpdate component', () => {
	it('should close this component if the cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			reply: {
				content: 'reply',
			},
			onCloseCommentBox: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
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
							element: <ReplyUpdate {...mockProps} />,
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
	it('should change the reply field values if the reply field is entered', async () => {
		const user = userEvent.setup();
		const mockProps = {
			reply: {
				content: 'reply',
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
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
							element: <ReplyUpdate {...mockProps} />,
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

		const replyField = screen.getByDisplayValue(mockProps.reply.content);

		await user.type(replyField, mockContent);

		expect(replyField).toHaveValue(`${mockProps.reply.content}${mockContent}`);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			reply: {
				content: 'reply',
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
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
							element: <ReplyUpdate {...mockProps} />,
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
		const replyErrorMessage = screen.getByTestId('error-message');

		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessage).toBeInTheDocument();
	});
	it('should validate each input after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			reply: {
				content: 'reply',
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
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
							element: <ReplyUpdate {...mockProps} />,
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
		const replyField = screen.getByDisplayValue(mockProps.reply.content);
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
		const mockProps = {
			reply: {
				_id: '0',
				content: 'reply',
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};

		const mockFetchResult = {
			success: false,
			fields: {
				content: 'error',
			},
		};

		const mockContent = '_changed';

		updateReply.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyUpdate {...mockProps} />,
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
		const replyField = screen.getByDisplayValue(mockProps.reply.content);
		const labelElement = screen.getByTestId('label');

		await user.type(replyField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		const replyErrorMessageElement = screen.getByTestId('error-message');

		expect(updateReply).toBeCalledTimes(1);
		expect(labelElement).toHaveClass(/error/);
		expect(replyErrorMessageElement).toHaveTextContent(
			mockFetchResult.fields.content,
		);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should render an error message alert if the reply update fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			reply: {
				_id: '0',
				content: 'reply',
			},
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};

		const mockFetchResult = {
			success: false,
		};

		const mockContent = '_changed';

		updateReply.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyUpdate {...mockProps} />,
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
		const replyField = screen.getByDisplayValue(mockProps.reply.content);

		await user.type(replyField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(updateReply).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should update the reply if the reply field successfully validates after user submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			post: {
				_id: '0',
				comments: [
					{
						_id: '0',
						replies: [
							{
								_id: '0',
								content: 'reply',
							},
						],
					},
				],
			},
			commentId: '0',
			reply: {
				_id: '0',
				content: 'reply',
			},
			onCloseCommentBox: vi.fn(),
			onUpdatePost: vi.fn(),
		};

		const mockContext = {
			onAlert: vi.fn(),
		};

		const mockFetchResult = {
			success: true,
			data: {},
		};

		const mockContent = '_changed';

		updateReply.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <ReplyUpdate {...mockProps} />,
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
		const replyField = screen.getByDisplayValue(mockProps.reply.content);

		await user.type(replyField, mockContent);
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(updateReply).toBeCalledTimes(1);
		expect(mockProps.onUpdatePost).toBeCalledTimes(1);
		expect(mockContext.onAlert).toBeCalledTimes(1);
		expect(mockProps.onCloseCommentBox).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});

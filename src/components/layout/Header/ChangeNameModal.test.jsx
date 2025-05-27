import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { ChangeNameModal } from './ChangeNameModal';
import { Loading } from '../../utils/Loading';

import { updateUser } from '../../../utils/handleUser';
import { useAppDataAPI } from '../../pages/App/AppContext';

vi.mock('../../../utils/handleUser');
vi.mock('../../../components/utils/Loading');

describe('ChangeNameModal component', () => {
	it('should change a field values if the field is entered', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		const mockName = '_changed';
		const queryClient = new QueryClient();
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const usernameField = screen.getByLabelText('Change username', {
			selector: 'input',
		});

		expect(usernameField).toHaveValue(mockProps.username);

		await user.type(usernameField, mockName);

		expect(usernameField).toHaveValue(`${mockProps.username}${mockName}`);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		const queryClient = new QueryClient();
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByText('Change username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(usernameField).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent(
			'New username should be different from the old username',
		);
	});
	it('should be verified successfully, if the input is correct after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		const queryClient = new QueryClient();
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByText('Change username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(usernameField).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent(
			'New username should be different from the old username',
		);

		await user.type(usernameField, '_new');

		await waitFor(() => {
			expect(usernameField).not.toHaveClass(/error/);
			expect(usernameErrorMessage).toHaveTextContent('Message placeholder');
		});
	});
	it('should render the corresponding error field message, if the input is still incorrect after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		const queryClient = new QueryClient();
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByText('Change username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(usernameField).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent(
			'New username should be different from the old username',
		);

		await user.type(usernameField, '#&@*($#$');

		await waitFor(() => {
			expect(usernameField).toHaveClass(/error/);
			expect(usernameErrorMessage).toHaveTextContent(
				'Username must be alphanumeric.',
			);
		});
	});
	it('should render an error field message if the username update fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		const mockFetchResult = {
			success: false,
			fields: {
				username: 'error',
			},
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();

		updateUser.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameLabel = screen.getByText('Change username');
		const usernameField = screen.getByLabelText('Change username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.type(usernameField, '_new');
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(updateUser).toBeCalledTimes(1);
		expect(usernameLabel).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent(
			mockFetchResult.fields.username,
		);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should navigate to the "/error" path if the username update fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const mockFetchResult = {
			success: false,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		const queryClient = new QueryClient();
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		updateUser.mockResolvedValueOnce(mockFetchResult);
		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
				},
				{
					path: '/error',
					element: <div>Error page</div>,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByLabelText('Change username');

		await user.type(usernameField, '_new');
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		const errorMessage = await screen.findByText('Error page');

		expect(errorMessage).toBeInTheDocument();
		expect(updateUser).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should update the username if the username field successfully validates after user submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
			onUser: vi.fn(),
			onActiveModal: vi.fn(),
		};
		const mockFetchResult = {
			success: true,
			data: 'success',
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		const queryClient = new QueryClient();
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		updateUser.mockResolvedValueOnce(mockFetchResult);

		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByLabelText('Change username');

		await user.type(usernameField, '_new');
		user.click(submitButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(mockProps.onUser).toBeCalledWith(mockFetchResult.data);
		expect(mockProps.onUser).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(updateUser).toBeCalledTimes(1);

		expect(loadingComponent).not.toBeInTheDocument();
	});
});

import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Dropdown } from './Dropdown';
import { Settings } from './Settings';

import { useAppDataAPI } from '../../pages/App/AppContext';

import { handleFetch } from '../../../utils/handleFetch';

vi.mock('./Settings');

vi.mock('../../../utils/handleFetch');
vi.mock('../../pages/App/AppContext');

describe('Dropdown component', () => {
	it('should render the user profile, settings button and logout button if the username of user data is provided', () => {
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();

		const mockUserInfo = {
			data: {
				username: 'example',
			},
		};

		queryClient.setQueryData(['userInfo'], mockUserInfo);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const avatar = screen.getByText(
			mockUserInfo.data.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(mockUserInfo.data.username);
		const settingsBtn = screen.getByRole('button', { name: 'Settings' });
		const logoutBtn = screen.getByRole('button', { name: 'Logout' });

		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
		expect(settingsBtn).toBeInTheDocument();
		expect(logoutBtn).toBeInTheDocument();
	});
	it('should render the login button if the user data is not provided', () => {
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const loginBtn = screen.getByRole('link', { name: 'Login' });

		expect(loginBtn).toBeInTheDocument();
	});
	it("should render the dark mode icon and text, if the 'darkTheme' prop is provided", () => {
		const mockProps = {
			darkTheme: true,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const button = screen.getByRole('button', { name: 'Dark mode' });
		const icon = screen.getByTestId('theme-icon');

		expect(button).toBeInTheDocument();
		expect(icon).toHaveClass(/moon/);
	});
	it('should render the Settings component, if the settings button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};
		const queryClient = new QueryClient();
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'example',
			},
		});

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(Settings).mockImplementationOnce(() => (
			<div>Settings component</div>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const settingBtn = screen.getByRole('button', { name: 'Settings' });

		await user.click(settingBtn);

		const settingsComponent = screen.getByText('Settings component');

		expect(settingsComponent).toBeInTheDocument();
	});
	it('should switch color theme, if the color theme button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const button = screen.getByRole('button', { name: 'Light mode' });
		const icon = screen.getByTestId('theme-icon');

		expect(icon).toHaveClass(/sun/);

		await user.click(button);

		expect(mockProps.onColorTheme).toBeCalledTimes(1);
	});
	it('should navigate to the "../login" path, if the login link is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
				},
				{
					path: '/login',
					element: <div>Login component</div>,
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

		const button = screen.getByRole('link', { name: 'Login' });

		await user.click(button);

		const loginComponent = screen.getByText('Login component');

		expect(loginComponent).toBeInTheDocument();
	});
	it('should navigate to the "/error" path if logout fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		const queryClient = new QueryClient();
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'example',
			},
		});

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(handleFetch).mockRejectedValueOnce(Error());

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
				},
				{
					path: '/error',
					element: <div>Error component</div>,
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

		const button = screen.getByRole('button', { name: 'Logout' });
		const loadingIcon = screen.getByTestId('loading-icon');

		expect(loadingIcon).toHaveClass(/logout/);

		await user.click(button);

		const errorComponent = screen.getByText('Error component');
		expect(errorComponent).toBeInTheDocument();
	});
	it('should logout, if the logout button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
			onCloseDropdown: vi.fn(),
		};
		const queryClient = new QueryClient();
		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'example',
			},
		});
		const mockFetchResult = {
			success: true,
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: () => {},
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);

		vi.mocked(handleFetch).mockImplementationOnce(
			async () =>
				await new Promise(resolve =>
					setTimeout(() => resolve(mockFetchResult), 100),
				),
		);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Dropdown {...mockProps} />,
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

		const logoutButton = screen.getByRole('button', { name: 'Logout' });
		const loadingIcon = screen.getByTestId('loading-icon');

		expect(loadingIcon).toHaveClass(/logout/);

		await user.click(logoutButton);

		await waitFor(() => {
			expect(loadingIcon).toHaveClass(/load/);
		});

		const loginLink = await screen.findByRole('link', { name: 'Login' });

		expect(loginLink).toBeInTheDocument();
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(mockProps.onCloseDropdown).toBeCalledTimes(1);
	});
});

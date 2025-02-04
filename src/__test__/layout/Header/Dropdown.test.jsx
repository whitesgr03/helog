import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Dropdown } from '../../../components/layout/Header/Dropdown';
import { Settings } from '../../../components/layout/Header/Settings';

import { handleFetch } from '../../../utils/handleFetch';

vi.mock('../../../components/layout/Header/Settings');

vi.mock('../../../utils/handleFetch');

describe('Dropdown component', () => {
	it('should render the user profile, settings button and logout button if the username of user prop is provided', () => {
		const mockProps = {
			user: {
				username: 'example',
			},
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const avatar = screen.getByText(
			mockProps.user.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(mockProps.user.username);
		const settingsBtn = screen.getByRole('button', { name: 'Settings' });
		const logoutBtn = screen.getByRole('button', { name: 'Logout' });

		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
		expect(settingsBtn).toBeInTheDocument();
		expect(logoutBtn).toBeInTheDocument();
	});
	it('should render the login button if the user prop is not provided', () => {
		const mockProps = {};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const loginBtn = screen.getByRole('link', { name: 'Login' });

		expect(loginBtn).toBeInTheDocument();
	});
	it("should render the dark mode icon and text, if the 'darkTheme' prop is provided", () => {
		const mockProps = {
			darkTheme: true,
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Dark mode' });
		const icon = screen.getByTestId('theme-icon');

		expect(button).toBeInTheDocument();
		expect(icon).toHaveClass(/moon/);
	});
	it('should render the Settings component, if the settings button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: ' example',
			},
		};

		Settings.mockImplementationOnce(() => <div>Settings component</div>);

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const settingBtn = screen.getByRole('button', { name: 'Settings' });

		await user.click(settingBtn);

		const settingsComponent = screen.getByText('Settings component');

		expect(settingsComponent).toBeInTheDocument();
	});
	it('should switch color theme, if the color theme button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: ' example',
			},
			onColorTheme: vi.fn(),
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Light mode' });
		const icon = screen.getByTestId('theme-icon');

		expect(icon).toHaveClass(/sun/);

		await user.click(button);

		expect(mockProps.onColorTheme).toBeCalledTimes(1);
	});
	it('should navigate to the "../login" path, if the login link is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {};
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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const button = screen.getByRole('link', { name: 'Login' });

		await user.click(button);

		const loginComponent = screen.getByText('Login component');

		expect(loginComponent).toBeInTheDocument();
	});
	it('should navigate to the "/error" path if logout fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: 'example',
			},
			onCloseDropdown: vi.fn(),
		};

		const mockFetchResult = {
			success: false,
			message: 'error',
		};

		handleFetch.mockResolvedValueOnce(mockFetchResult);

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Logout' });
		const loadingIcon = screen.getByTestId('loading-icon');

		expect(loadingIcon).toHaveClass(/logout/);

		await user.click(button);

		expect(loadingIcon).toHaveClass(/load/);

		const errorComponent = screen.getByText('Error component');
		expect(errorComponent).toBeInTheDocument();
	});
	it('should logout, if the logout button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: 'example',
			},
			onUser: vi.fn(),
			onCloseDropdown: vi.fn(),
		};

		const mockFetchResult = {
			success: true,
		};

		handleFetch.mockResolvedValueOnce(mockFetchResult);

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Logout' });
		const loadingIcon = screen.getByTestId('loading-icon');

		expect(loadingIcon).toHaveClass(/logout/);

		user.click(button);

		await waitFor(() => {
			expect(loadingIcon).toHaveClass(/load/);
		});

		await waitFor(() => {
			expect(mockProps.onUser).toBeCalledTimes(1);
			expect(mockProps.onCloseDropdown).toBeCalledTimes(1);
		});
	});
});

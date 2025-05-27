import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Header } from './Header';
import { Dropdown } from './Dropdown';

vi.mock('./Dropdown');

describe('Header component', () => {
	it('should navigate to the "../" path, if the HeLog link is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = { darkTheme: false, onColorTheme: () => {} };
		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/header',
					element: <Header {...mockProps} />,
				},
				{
					path: '/',
					element: <div>Home component</div>,
				},
			],
			{
				initialEntries: ['/header'],
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
				/>{' '}
			</QueryClientProvider>,
		);

		const link = screen.getByRole('link', { name: 'HeLog' });

		await user.click(link);

		const homeComponent = screen.getByText('Home component');

		expect(homeComponent).toBeInTheDocument();
	});
	it('should render the post editor link, if the username of user data is provided', async () => {
		const mockProps = {
			darkTheme: false,
			onColorTheme: () => {},
		};

		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'example',
			},
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Header {...mockProps} />,
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

		const element = screen.getByRole('link', { name: 'Write' });
		expect(element).toBeInTheDocument();
	});
	it("should render the dark mode icon and text, if the 'darkTheme' prop is provided", () => {
		const mockProps = {
			darkTheme: true,
			onColorTheme: () => {},
		};

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Header {...mockProps} />,
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
	it('should switch color theme, if the color theme button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: vi.fn(),
		};

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Header {...mockProps} />,
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
				/>{' '}
			</QueryClientProvider>,
		);

		const button = screen.getByRole('button', { name: 'Light mode' });
		const icon = screen.getByTestId('theme-icon');

		expect(icon).toHaveClass(/sun/);

		await user.click(button);

		expect(mockProps.onColorTheme).toBeCalledTimes(1);
	});
	it('should render Dropdown component and transparent bgc, if the account button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: () => {},
		};

		const queryClient = new QueryClient();

		vi.mocked(Dropdown).mockImplementationOnce(() => (
			<div>Dropdown component</div>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Header {...mockProps} />,
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
				/>{' '}
			</QueryClientProvider>,
		);

		const accountButton = screen.getByRole('button', { name: 'Account' });

		await user.click(accountButton);

		const dropdownComponent = screen.getByText('Dropdown component');
		const element = screen.getByTestId('transparentBgc');

		expect(dropdownComponent).toBeInTheDocument();
		expect(element).toBeInTheDocument();
	});
	it('should close Dropdown component and transparent bgc, if the transparent bgc is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			darkTheme: false,
			onColorTheme: () => {},
		};
		const queryClient = new QueryClient();

		vi.mocked(Dropdown).mockImplementationOnce(() => (
			<div>Dropdown component</div>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Header {...mockProps} />,
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

		const accountButton = screen.getByRole('button', { name: 'Account' });

		await user.click(accountButton);

		const dropdownComponent = screen.getByText('Dropdown component');
		const element = screen.getByTestId('transparentBgc');

		await user.click(element);

		expect(dropdownComponent).not.toBeInTheDocument();
		expect(element).not.toBeInTheDocument();
	});
});

import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Header } from '../../../components/layout/Header/Header';
import { Dropdown } from '../../../components/layout/Header/Dropdown';

vi.mock('../../../components/layout/Header/Dropdown');

describe('Header component', () => {
	it('should navigate to the "../" path, if the HeLog link is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const link = screen.getByRole('link', { name: 'HeLog' });

		await user.click(link);

		const homeComponent = screen.getByText('Home component');

		expect(homeComponent).toBeInTheDocument();
	});
	it('should render the post editor link, if the username of user prop is provided', () => {
		const mockProps = {
			user: {
				username: 'example',
			},
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const element = screen.getByRole('link', { name: 'Write' });

		expect(element).toBeInTheDocument();
	});
	it("should render the dark mode icon and text, if the 'darkTheme' prop is provided", () => {
		const mockProps = {
			darkTheme: true,
		};

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
	it('should switch color theme, if the color theme button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onColorTheme: vi.fn(),
		};

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
	it('should render Dropdown component and transparent bgc, if the account button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {};

		Dropdown.mockImplementationOnce(() => <div>Dropdown component</div>);

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
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
		const mockProps = {};

		Dropdown.mockImplementationOnce(() => <div>Dropdown component</div>);

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
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

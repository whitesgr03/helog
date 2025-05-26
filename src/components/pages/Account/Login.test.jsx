import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Login } from './Login';
import { Loading } from '../../utils/Loading';

vi.mock('../../../components/utils/Loading');

describe('Login component', () => {
	it('should navigate to the "/" path if the user prop is provided', async () => {
		const mockContext = {
			user: true,
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <div>Home component</div>,
						},
						{
							path: 'login',
							element: <Login />,
						},
					],
				},
			],
			{
				initialEntries: ['/login'],
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

		const homeComponent = screen.getByText('Home component');

		expect(homeComponent).toBeInTheDocument();
	});
	it('should login with google account if the "Sign in with Google" button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			user: false,
		};

		const mockFn = vi.fn();

		Object.defineProperty(window, 'location', {
			value: {
				assign: mockFn,
			},
		});

		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Login />,
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

		const googleButton = screen.getByText('Sign in with Google');

		user.click(googleButton);

		await screen.findByText('Loading component');

		expect(mockFn).toBeCalledTimes(1);
		expect(mockFn.mock.calls[0][0]).toMatch(/google/);
	});
	it('should login with facebook account if "Sign in with Facebook" button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			user: false,
		};

		const mockFn = vi.fn();

		Object.defineProperty(window, 'location', {
			value: {
				assign: mockFn,
			},
		});

		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Login />,
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

		const googleButton = screen.getByText('Sign in with Facebook');

		user.click(googleButton);

		await screen.findByText('Loading component');

		expect(mockFn).toBeCalledTimes(1);
		expect(mockFn.mock.calls[0][0]).toMatch(/facebook/);
	});
});

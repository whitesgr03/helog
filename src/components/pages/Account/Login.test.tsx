import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Login } from './Login';
import { Loading } from '../../utils/Loading';
import { FederationButton } from './FederationButton';

vi.mock('../../utils/Loading');
vi.mock('./FederationButton');

describe('Login component', () => {
	it('should navigate to the "/" path if the user prop is provided', async () => {
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
					element: <div>Home component</div>,
				},
				{
					path: 'login',
					element: <Login />,
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
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={router}
					future={{
						v7_startTransition: true,
					}}
				/>
			</QueryClientProvider>,
		);

		const homeComponent = screen.getByText('Home component');

		expect(homeComponent).toBeInTheDocument();
	});
	it('should renders loading component if federation button is clicked', async () => {
		const user = userEvent.setup();

		const queryClient = new QueryClient();
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));
		vi.mocked(FederationButton).mockImplementationOnce(({ handleLoading }) => (
			<div>
				<p>FederationButton component</p>
				<button onClick={() => handleLoading(true)}>login</button>
			</div>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Login />,
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

		const loginButton = screen.getByRole('button', { name: 'login' });

		await user.click(loginButton);

		expect(screen.getByText('Loading component')).toBeInTheDocument();
	});
});

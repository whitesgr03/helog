import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { FederationButton } from './FederationButton';

describe('Login component', () => {
	it('should handle social login if social login button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			iconUrl: 'url',
			provider: 'provider',
			handleLoading: vi.fn(),
		};

		const mockFn = vi.fn();

		Object.defineProperty(window, 'location', {
			value: {
				assign: mockFn,
			},
		});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <FederationButton {...mockProps} />,
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

		const icon = screen.getByAltText(`${mockProps.provider} icon`);

		const loginButton = screen.getByText(`Sign in with ${mockProps.provider}`);
		await user.click(loginButton);

		expect(icon.src).toMatch(new RegExp(mockProps.url));
		expect(mockProps.handleLoading).toBeCalledTimes(1).toBeCalledWith(true);
		expect(mockFn).toBeCalledTimes(1);
		expect(mockFn.mock.calls[0][0]).toMatch(new RegExp(mockProps.provider));
	});
});

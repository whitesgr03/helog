import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Navigate } from 'react-router';
import { Error } from './Error';
import userEvent from '@testing-library/user-event';

describe('Error component', () => {
	it('should handling refetching user info if the "onReGetUser" prop is provided and "Back to Home Page" is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onReGetUser: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <div>Home page</div>,
				},
				{
					path: '/error',
					element: <Error {...mockProps} />,
				},
			],
			{
				initialEntries: ['/error'],
			},
		);

		render(<RouterProvider router={router} />);

		const link = screen.getByRole('link', { name: 'Back to Home Page' });

		await user.click(link);

		expect(screen.getByText('Home page')).toBeInTheDocument();
		expect(mockProps.onReGetUser).toHaveBeenCalledTimes(1);
	});
	it('should render the "Go Back Previous Page" link if the "previousPath" state is provided', () => {
		const mockState = {
			previousPath: '/',
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Navigate to={'/error'} state={{ ...mockState }} />,
				},
				{
					path: '/error',
					element: <Error />,
				},
			],
			{
				initialEntries: ['/'],
			},
		);

		render(<RouterProvider router={router} />);

		const element = screen.getByRole('link', { name: 'Go Back Previous Page' });

		expect(element).toBeInTheDocument();
	});
});

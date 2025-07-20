import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Home } from './Home';
import { LatestPosts } from './LatestPosts';

vi.mock('./LatestPosts');
vi.mock('../../utils/Loading');
vi.mock('../../../utils/handlePost');
vi.mock('../App/AppContext');

describe('Home component', () => {
	it('should render Posts component', async () => {
		vi.mocked(LatestPosts).mockImplementation(() => (
			<div>LatestPosts component</div>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Home />,
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

		expect(screen.getByText('LatestPosts component')).toBeInTheDocument();
	});
	it('should navigate to the "../posts" path, if the all posts link is clicked', async () => {
		const user = userEvent.setup();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Home />,
				},
				{
					path: '/posts',
					element: <div>Posts component</div>,
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

		const link = screen.getByRole('link', { name: 'All Posts' });

		await user.click(link);

		expect(screen.getByText('Posts component')).toBeInTheDocument();
	});
});

import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { DeleteModal } from './DeleteModal';
import { Loading } from '../../utils/Loading';

import { deleteUser } from '../../../utils/handleUser';

vi.mock('../../../utils/handleUser');
vi.mock('../../../components/utils/Loading');

describe('DeleteModal component', () => {
	it('should navigate to the "/error" path if the user delete fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		const mockFetchResult = {
			success: false,
		};
		const queryClient = new QueryClient();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <DeleteModal {...mockProps} />,
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

		const deleteButton = screen.getByRole('button', { name: 'Delete' });

		user.click(deleteButton);

		const loadingComponent = await screen.findByText('Loading component');

		const errorComponent = await screen.findByText('Error component');

		expect(deleteUser).toBeCalledTimes(1);
		expect(errorComponent).toBeInTheDocument();
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should close modal if cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		const queryClient = new QueryClient();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <DeleteModal {...mockProps} />,
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

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should delete the user if delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onUser: vi.fn(),
			onToggleSettingsMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onAlert: vi.fn(),
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

		deleteUser.mockResolvedValueOnce(mockFetchResult);

		Loading.mockImplementationOnce(() => <div>Loading component</div>);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <DeleteModal {...mockProps} />,
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

		const deleteButton = screen.getByRole('button', { name: 'Delete' });

		user.click(deleteButton);

		const loadingComponent = await screen.findByText('Loading component');

		expect(deleteUser).toBeCalledTimes(1);
		expect(mockProps.onUser).toBeCalledTimes(1);
		expect(mockProps.onToggleSettingsMenu).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(mockProps.onAlert).toBeCalledTimes(1);
		expect(loadingComponent).not.toBeInTheDocument();
	});
});

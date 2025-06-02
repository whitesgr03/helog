import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { DeleteModal } from './DeleteModal';
import { Loading } from '../../utils/Loading';
import { deleteUser } from '../../../utils/handleUser';

import { useAppDataAPI } from '../../pages/App/AppContext';

vi.mock('../../pages/App/AppContext');
vi.mock('../../utils/Loading');
vi.mock('../../../utils/handleUser');

describe('DeleteModal component', () => {
	it('should navigate to the "/error" path if delete the user fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onCloseDropdown: vi.fn(),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};
		const queryClient = new QueryClient();
		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		vi.mocked(deleteUser).mockImplementationOnce(
			async () =>
				await new Promise((_r, reject) =>
					setTimeout(() => {
						reject(Error());
					}, 100),
				),
		);
		vi.mocked(Loading).mockImplementationOnce(() => (
			<div>Loading component</div>
		));

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

		await user.click(deleteButton);

		const loadingComponent = await screen.findByText('Loading component');

		const errorComponent = await screen.findByText('Error component');

		expect(deleteUser).toBeCalledTimes(1);
		expect(errorComponent).toBeInTheDocument();
		expect(loadingComponent).not.toBeInTheDocument();
	});
	it('should close modal if cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onCloseDropdown: vi.fn(),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
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

		expect(mockCustomHook.onModal).toBeCalledTimes(1);
	});
	it('should delete the user if delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onCloseDropdown: vi.fn(),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValue(mockCustomHook);
		const queryClient = new QueryClient();

		queryClient.setQueryData(['userInfo'], {
			data: {
				username: 'example',
			},
		});

		const mockFetchResult = {
			success: true,
		};

		vi.mocked(deleteUser).mockResolvedValueOnce(mockFetchResult);

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

		await user.click(deleteButton);

		expect(deleteUser).toBeCalledTimes(1);
		expect(mockProps.onCloseDropdown).toBeCalledTimes(1);
		expect(mockCustomHook.onModal).toBeCalledTimes(2);
		expect(mockCustomHook.onAlert).toBeCalledTimes(1);
		expect(queryClient.getQueryData(['userInfo'])).toBeUndefined();
	});
});

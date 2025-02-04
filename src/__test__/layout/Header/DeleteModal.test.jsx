import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { DeleteModal } from '../../../components/layout/Header/DeleteModal';
import { Loading } from '../../../components/utils/Loading';

import { deleteUser } from '../../../utils/handleUser';

vi.mock('../../../utils/handleUser');
vi.mock('../../../components/utils/Loading');

describe('DeleteModal component', () => {
	it('should close modal if cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should navigate to the "/error" path if the user delete fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		const mockFetchResult = {
			success: false,
		};

		deleteUser.mockResolvedValueOnce(mockFetchResult);

		Loading.mockImplementationOnce(() => <div>Loading component</div>);

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
		);

		const deleteButton = screen.getByRole('button', { name: 'Delete' });

		user.click(deleteButton);

		const loadingComponent = await screen.findByText('Loading component');

		await waitFor(async () => {
			const errorComponent = await screen.findByText('Error component');

			expect(deleteUser).toBeCalledTimes(1);
			expect(errorComponent).toBeInTheDocument();
			expect(loadingComponent).not.toBeInTheDocument();
		});
	});
	it('should delete the user if delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onUser: vi.fn(),
			onToggleSettingsMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onAlert: vi.fn(),
		};

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
			<RouterProvider
				router={router}
				future={{
					v7_startTransition: true,
				}}
			/>,
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

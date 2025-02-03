import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { ChangeNameModal } from '../../../components/layout/Header/ChangeNameModal';

import { updateUser } from '../../../utils/handleUser';

vi.mock('../../../utils/handleUser');

describe('ChangeNameModal component', () => {
	it('should change a field values if the field is entered', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};

		const mockName = '_changed';

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const usernameField = screen.getByLabelText('Change username', {
			selector: 'input',
		});

		expect(usernameField).toHaveValue(mockProps.username);

		await user.type(usernameField, mockName);

		expect(usernameField).toHaveValue(`${mockProps.username}${mockName}`);
	});
	it('should render an error field message if the field validation fails after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByText('Change username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(usernameField).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent(
			'New username should be different from the old username',
		);
	});
	it('should validate each input after a failed submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByText('Change username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.click(submitButton);

		expect(usernameField).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent(
			'New username should be different from the old username',
		);

		await user.type(usernameField, '_new');

		await waitFor(
			() => {
				expect(usernameField).not.toHaveClass(/error/);
				expect(usernameErrorMessage).toHaveTextContent('Message placeholder');
			},
			{
				timeout: 500,
			},
		);
	});
	it('should render an error field message if the username update fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const mockFetchResult = {
			success: false,
			fields: {
				username: 'error',
			},
		};

		updateUser.mockResolvedValueOnce(mockFetchResult);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameLabel = screen.getByText('Change username');
		const usernameField = screen.getByLabelText('Change username');
		const usernameErrorMessage = screen.getByText('Message placeholder');

		await user.type(usernameField, '_new');
		await user.click(submitButton);

		expect(updateUser).toBeCalledTimes(1);
		expect(usernameLabel).toHaveClass(/error/);
		expect(usernameErrorMessage).toHaveTextContent(
			mockFetchResult.fields.username,
		);
	});
	it('should navigate to the "/error" path if the username update fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
		};
		const mockFetchResult = {
			success: false,
		};

		updateUser.mockResolvedValueOnce(mockFetchResult);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
				},
				{
					path: '/error',
					element: <div>Error page</div>,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByLabelText('Change username');

		await user.type(usernameField, '_new');
		await user.click(submitButton);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
		expect(updateUser).toBeCalledTimes(1);
	});
	it('should update the username if the username field successfully validates after user submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			username: 'username',
			onUser: vi.fn(),
			onActiveModal: vi.fn(),
		};
		const mockFetchResult = {
			success: true,
			data: 'success',
		};

		updateUser.mockResolvedValueOnce(mockFetchResult);

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <ChangeNameModal {...mockProps} />,
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

		const submitButton = screen.getByRole('button', 'Save');
		const usernameField = screen.getByLabelText('Change username');

		await user.type(usernameField, '_new');
		await user.click(submitButton);

		expect(mockProps.onUser).toBeCalledWith(mockFetchResult.data);
		expect(mockProps.onUser).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(updateUser).toBeCalledTimes(1);
	});
});

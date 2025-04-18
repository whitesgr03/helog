import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Settings } from '../../../components/layout/Header/Settings';

import { ChangeNameModal } from '../../../components/layout/Header/ChangeNameModal';
import { DeleteModal } from '../../../components/layout/Header/DeleteModal';

vi.mock('../../../components/layout/Header/ChangeNameModal');
vi.mock('../../../components/layout/Header/DeleteModal');

describe('Settings component', () => {
	it('should render the user name, email and avatar, if the user prop is provided', () => {
		const mockProps = {
			user: {
				username: 'example',
				email: 'example@gmail.com',
			},
		};

		render(<Settings {...mockProps} />);

		const avatar = screen.getByText(
			mockProps.user.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(mockProps.user.username);
		const email = screen.getByText(mockProps.user.email);

		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
		expect(email).toBeInTheDocument();
	});
	it('should close Settings component, if the close button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onToggleSettingsMenu: vi.fn(),
		};

		render(<Settings {...mockProps} />);

		const closeButton = screen.getByTestId('close-btn');

		await user.click(closeButton);

		expect(mockProps.onToggleSettingsMenu).toBeCalledTimes(1);
	});
	it('should active ChangeNameModal component, if the change username button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: 'example',
			},
			onActiveModal: vi.fn(),
		};

		render(<Settings {...mockProps} />);

		const changeNameBtn = screen.getByRole('button', {
			name: 'Change username',
		});

		await user.click(changeNameBtn);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(mockProps.onActiveModal.mock.calls[0][0].component).toHaveProperty(
			'type',
			ChangeNameModal,
		);
	});
	it('should active DeleteModal component, if the delete account button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		render(<Settings {...mockProps} />);

		const changeNameBtn = screen.getByRole('button', {
			name: 'Delete account',
		});

		await user.click(changeNameBtn);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(mockProps.onActiveModal.mock.calls[0][0].component).toHaveProperty(
			'type',
			DeleteModal,
		);
	});
});

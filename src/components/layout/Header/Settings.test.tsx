import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Settings } from './Settings';
import { ChangeNameModal } from './ChangeNameModal';
import { DeleteModal } from './DeleteModal';

import { useAppDataAPI } from '../../pages/App/AppContext';

vi.mock('../../pages/App/AppContext');
vi.mock('./ChangeNameModal');
vi.mock('./DeleteModal');

describe('Settings component', () => {
	it('should render the user name and avatar, if the user prop is provided', () => {
		const mockProps = {
			user: {
				username: 'example',
				isAdmin: true,
			},
			onCloseDropdown: vi.fn(),
			onToggleSettingsMenu: vi.fn(),
		};

		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValueOnce(mockCustomHook);

		render(<Settings {...mockProps} />);

		const avatar = screen.getByText(
			mockProps.user.username.charAt(0).toUpperCase(),
		);
		const username = screen.getByText(mockProps.user.username);

		expect(avatar).toBeInTheDocument();
		expect(username).toBeInTheDocument();
	});
	it('should close Settings component, if the close button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: 'example',
				email: 'example@gmail.com',
				isAdmin: true,
			},
			onCloseDropdown: vi.fn(),
			onToggleSettingsMenu: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValueOnce(mockCustomHook);

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
				email: 'example@gmail.com',
				isAdmin: true,
			},
			onCloseDropdown: vi.fn(),
			onToggleSettingsMenu: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValueOnce(mockCustomHook);

		render(<Settings {...mockProps} />);

		const changeNameBtn = screen.getByRole('button', {
			name: 'Change username',
		});

		await user.click(changeNameBtn);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);
		expect(mockCustomHook.onModal.mock.calls[0][0].component).toHaveProperty(
			'type',
			ChangeNameModal,
		);
	});
	it('should active DeleteModal component, if the delete account button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			user: {
				username: 'example',
				email: 'example@gmail.com',
				isAdmin: true,
			},
			onCloseDropdown: vi.fn(),
			onToggleSettingsMenu: vi.fn(),
		};
		const mockCustomHook = {
			onAlert: vi.fn(),
			onModal: vi.fn(),
		};

		vi.mocked(useAppDataAPI).mockReturnValueOnce(mockCustomHook);

		render(<Settings {...mockProps} />);

		const changeNameBtn = screen.getByRole('button', {
			name: 'Delete account',
		});

		await user.click(changeNameBtn);

		expect(mockCustomHook.onModal).toBeCalledTimes(1);
		expect(mockCustomHook.onModal.mock.calls[0][0].component).toHaveProperty(
			'type',
			DeleteModal,
		);
	});
});

// Packages
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';

// Styles
import styles from './Dropdown.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';
import loadingStyles from '../../utils/Loading.module.css';

// Components
import { Settings } from './Settings.jsx';

// Utils
import { handleFetch } from '../../../utils/handleFetch.js';
import { queryClient } from '../../../utils/queryOptions.js';

import { useAppDataAPI } from '../../pages/App/AppContext.js';

// Variables
const URL = `${import.meta.env.VITE_RESOURCE_URL}/account/logout`;

// Type
import { DarkTheme } from '../../pages/App/App.js';
import { User } from './Header.js';

interface DropdownProps {
	darkTheme: DarkTheme;
	onColorTheme: () => void;
	onCloseDropdown: () => void;
}

export const Dropdown = ({
	darkTheme,
	onColorTheme,
	onCloseDropdown,
}: DropdownProps) => {
	const { onAlert } = useAppDataAPI();
	const [activeSettings, setActiveSettings] = useState(false);

	const { data: user }: { data?: User } =
		queryClient.getQueryData(['userInfo']) ?? {};

	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const { isPending, mutate } = useMutation({
		mutationFn: async () => {
			const options: RequestInit = {
				method: 'POST',
				headers: {
					'X-CSRF-TOKEN':
						Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ??
						'',
				},
				credentials: 'include',
			};
			return await handleFetch(URL, options);
		},
		onError: () => {
			navigate('/error', { state: { previousPath } });
			onCloseDropdown();
		},
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ['userInfo'] });
			onAlert([
				{
					message: `You have been logged out.`,
					error: false,
					delay: 4000,
				},
			]);
		},
		onSettled: () => onCloseDropdown(),
	});

	const handleLogout = () => mutate();

	const handleToggleSettingsMenu = () => setActiveSettings(!activeSettings);

	return (
		<div className={styles.dropdown}>
			{user && (
				<div className={styles.profile}>
					<div className={styles.avatar}>
						{user.username.charAt(0).toUpperCase()}
					</div>
					<span title={user.username}>{user.username}</span>
				</div>
			)}
			<ul>
				<li>
					<button className={buttonStyles.theme} onClick={onColorTheme}>
						<span
							data-testid="theme-icon"
							className={`${imageStyles.icon} ${
								darkTheme ? styles.moon : styles.sun
							}`}
						/>
						{darkTheme ? 'Dark' : 'Light'} mode
						<div>
							<div />
						</div>
					</button>
				</li>
				{user && (
					<li>
						<button onClick={handleToggleSettingsMenu}>
							<span className={`${imageStyles.icon} ${styles.settings}`} />
							Settings
						</button>
					</li>
				)}
				<li>
					{user ? (
						<button onClick={handleLogout}>
							<span
								data-testid="loading-icon"
								className={`${imageStyles.icon} ${isPending ? loadingStyles.load : styles.logout}`}
							/>
							Logout
						</button>
					) : (
						<Link to="../login" onClick={onCloseDropdown}>
							<span className={`${imageStyles.icon} ${styles.login}`} />
							Login
						</Link>
					)}
				</li>
			</ul>
			{user && activeSettings && (
				<Settings
					onToggleSettingsMenu={handleToggleSettingsMenu}
					onCloseDropdown={onCloseDropdown}
					user={user}
				/>
			)}
		</div>
	);
};

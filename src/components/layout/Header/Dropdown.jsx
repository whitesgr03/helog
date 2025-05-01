// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../utils/queryOptions.js';

// Styles
import styles from './Dropdown.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';
import loadingStyles from '../../utils/Loading.module.css';

// Components
import { Settings } from './Settings.jsx';

// Utils
import { handleFetch } from '../../../utils/handleFetch.js';

// Variables
const URL = `${import.meta.env.VITE_RESOURCE_URL}/account/logout`;

export const Dropdown = ({
	user,
	onAlert,
	darkTheme,
	onColorTheme,
	onCloseDropdown,
	onActiveModal,
}) => {
	const [activeSettings, setActiveSettings] = useState(false);

	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const { isPending, mutate } = useMutation({
		mutationFn: async () => {
			const options = {
				method: 'POST',
				headers: {
					'X-CSRF-TOKEN': Cookies.get(
						import.meta.env.PROD ? '__Secure-token' : 'token',
					),
				},
				credentials: 'include',
			};
			return await handleFetch(URL, options);
		},
		onError: error =>
			navigate('/error', {
				state: { error: error.message, previousPath },
			}),
		onSuccess: () => queryClient.setQueryData(['userInfo'], null),
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
			{activeSettings && (
				<Settings
					user={user}
					onAlert={onAlert}
					onActiveModal={onActiveModal}
					onToggleSettingsMenu={handleToggleSettingsMenu}
					onCloseDropdown={onCloseDropdown}
				/>
			)}
		</div>
	);
};

Dropdown.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	onColorTheme: PropTypes.func,
	onCloseDropdown: PropTypes.func,
	onActiveModal: PropTypes.func,
	onAlert: PropTypes.func,
};

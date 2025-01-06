// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Link, useLocation } from 'react-router-dom';

// Styles
import styles from './Dropdown.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';
import loadingStyles from '../../utils/Loading.module.css';

// Components
import { Settings } from './Settings.jsx';

// Utils
import { handleFetch } from '../../../utils/handleFetch.js';

export const Dropdown = ({
	user,
	onUser,
	onAlert,
	darkTheme,
	onColorTheme,
	onCloseDropdown,
	onActiveModal,
}) => {
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);
	const [activeSettings, setActiveSettings] = useState(false);

	const { pathname: previousPath } = useLocation();

	const handleLogout = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/account/logout`;

		const options = {
			method: 'POST',
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		result.success ? onUser(null) : setError(result.message);

		setLoading(false);
		onCloseDropdown();
	};

	const handleActiveSettings = () => setActiveSettings(true);
	const handleCloseSettings = () => onCloseDropdown(false);
	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error, previousPath }} />
			) : (
				<div className={styles.dropdown}>
					{user?.username && (
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
						{user && user.username && (
							<li>
								<button onClick={handleActiveSettings}>
									<span className={`${imageStyles.icon} ${styles.settings}`} />
									Settings
								</button>
							</li>
						)}
						<li>
							{user ? (
								<button onClick={handleLogout}>
									{loading ? (
										<span
											className={`${imageStyles.icon} ${loadingStyles.load} ${loadingStyles['load-desktop']}`}
										/>
									) : (
										<span className={`${imageStyles.icon} ${styles.logout}`} />
									)}
									Logout
								</button>
							) : (
								<Link to="login" onClick={onCloseDropdown}>
									<span className={`${imageStyles.icon} ${styles.login}`} />
									Login
								</Link>
							)}
						</li>
					</ul>
					{activeSettings && (
						<Settings
							user={user}
							onUser={onUser}
							onAlert={onAlert}
							onActiveModal={onActiveModal}
							onCloseSettings={handleCloseSettings}
						/>
					)}
				</div>
			)}
		</>
	);
};

Dropdown.propTypes = {
	user: PropTypes.object,
	onUser: PropTypes.func,
	darkTheme: PropTypes.bool,
	onColorTheme: PropTypes.func,
	onCloseDropdown: PropTypes.func,
	onActiveModal: PropTypes.func,
	onAlert: PropTypes.func,
};

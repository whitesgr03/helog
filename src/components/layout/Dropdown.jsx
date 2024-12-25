// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Link, useLocation } from 'react-router-dom';

// Styles
import style from '../../styles/layout/Dropdown.module.css';
import button from '../../styles/utils/button.module.css';
import image from '../../styles/utils/image.module.css';

// Components
import Settings from './Settings.jsx';

// Utils
import { handleFetch } from '../../utils/handleFetch.js';

export const Dropdown = ({
	user,
	onUser,
	darkTheme,
	onSwitchColorTheme,
	onCloseDropdown,
	onModel,
	onAlert,
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
	const handleCloseSettings = () => setActiveSettings(false);
	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error, previousPath }} />
			) : (
				<div className={style.dropdown}>
					{user?.name && (
						<div className={style.profile}>
							<div className={style.avatar}>
								{user.name.charAt(0).toUpperCase()}
							</div>
							<span title={user.name}>{user.name}</span>
						</div>
					)}
					<ul>
						<li>
							<button className={button.theme} onClick={onSwitchColorTheme}>
								<span
									className={`${image.icon} ${
										darkTheme ? style.moon : style.sun
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
								<button onClick={handleActiveSettings}>
									<span className={`${image.icon} ${style.settings}`} />
									Settings
								</button>
							</li>
						)}
						<li>
							{user ? (
								<button onClick={handleLogout}>
									{loading ? (
										<span
											className={`${image.icon} ${loadingStyles.load} ${loadingStyles['load-desktop']}`}
										/>
									) : (
										<span className={`${image.icon} ${style.logout}`} />
									)}
									Logout
								</button>
							) : (
								<Link to="login" onClick={onCloseDropdown}>
									<span className={`${image.icon} ${style.login}`} />
									Login
								</Link>
							)}
						</li>
					</ul>
					{activeSettings && (
						<Settings
							user={user}
							handleCloseSettings={handleCloseSettings}
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
	onSwitchColorTheme: PropTypes.func,
	onCloseDropdown: PropTypes.func,
	onModel: PropTypes.func,
	onAlert: PropTypes.func,
};

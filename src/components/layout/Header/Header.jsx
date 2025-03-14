// Packages
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Header.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Dropdown } from './Dropdown';

export const Header = ({
	user,
	onUser,
	onAlert,
	darkTheme,
	onColorTheme,
	onActiveModal,
}) => {
	const [activeDropdown, setActiveDropdown] = useState(false);

	const handleActiveDropdown = () => setActiveDropdown(!activeDropdown);
	const handleCloseDropdown = () => setActiveDropdown(false);

	return (
		<>
			<header className={styles.header}>
				<Link to="../" className={styles.logo} onClick={handleCloseDropdown}>
					<h1>HeLog</h1>
				</Link>
				<nav>
					<ul className={styles.list}>
						{user?.username && (
							<li>
								<a
									href={`${import.meta.env.VITE_HELOG_EDITOR_URL}?theme=${darkTheme}`}
								>
									<span className={`${imageStyles.icon} ${styles.pencil}`} />
									Write
								</a>
							</li>
						)}
						<li className={styles['toggle-btn']}>
							<button onClick={onColorTheme}>
								<div className={buttonStyles.theme}>
									<span
										data-testid="theme-icon"
										className={`${imageStyles.icon} ${darkTheme ? styles.moon : styles.sun}`}
									/>
									<div>
										<div />
									</div>
								</div>
								{darkTheme ? 'Dark' : 'Light'} mode
							</button>
						</li>
						<li>
							<button onClick={handleActiveDropdown}>
								<span className={`${imageStyles.icon} ${styles.account}`} />
								Account
							</button>
						</li>
					</ul>
				</nav>
				{activeDropdown && (
					<>
						<Dropdown
							user={user}
							onUser={onUser}
							onAlert={onAlert}
							darkTheme={darkTheme}
							onColorTheme={onColorTheme}
							onActiveModal={onActiveModal}
							onCloseDropdown={handleCloseDropdown}
						/>
						<div
							className={styles['transparent-background']}
							onClick={handleCloseDropdown}
							data-testid="transparentBgc"
						/>
					</>
				)}
			</header>
		</>
	);
};
Header.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	onColorTheme: PropTypes.func,
	onActiveModal: PropTypes.func,
	onUser: PropTypes.func,
	onAlert: PropTypes.func,
};

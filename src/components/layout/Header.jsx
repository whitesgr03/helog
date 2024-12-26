// Packages
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Header.module.css';
import buttonStyles from '../../styles/button.module.css';
import imageStyles from '../../styles/image.module.css';
import bgcStyles from '../../styles/bgc.module.css';

// Components
import { Dropdown } from './Dropdown';

export const Header = ({ user, onUser, darkTheme, handleSwitchColorTheme }) => {
	const [activeDropdown, setActiveDropdown] = useState(false);

	const handleActiveDropdown = () => setActiveDropdown(!activeDropdown);
	const handleCloseDropdown = () => setActiveDropdown(false);

	return (
		<>
			<header className={styles.header}>
				<Link to="/" className={styles.logo} onClick={handleCloseDropdown}>
					<h1>HeLog</h1>
				</Link>
				<nav>
					<ul className={styles.list}>
						{user && (
							<li>
								<a
									href={`${
										import.meta.env.VITE_HELOG_EDITOR_URL
									}?darkTheme=${darkTheme}`}
								>
									<span className={`${imageStyles.icon} ${styles.pencil}`} />
									Write
								</a>
							</li>
						)}
						<li className={styles.toggleBtn}>
							<button onClick={handleSwitchColorTheme}>
								<div className={buttonStyles.theme}>
									<span
										data-testid={'icon'}
										className={`${imageStyles.icon} ${darkTheme ? styles.moon : styles.sun}`}
									/>
									<div>
										<div />
									</div>
								</div>
								<span>{darkTheme ? 'Dark' : 'Light'} mode</span>
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
					<Dropdown
						user={user}
						onUser={onUser}
						darkTheme={darkTheme}
						onSwitchColorTheme={handleSwitchColorTheme}
						onCloseDropdown={handleCloseDropdown}
					/>
				)}
			</header>
			{activeDropdown && (
				<div
					className={bgcStyles.transparentWindow}
					onClick={handleCloseDropdown}
					data-testid="transparentBgc"
				/>
			)}
		</>
	);
};
Header.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	handleSwitchColorTheme: PropTypes.func,
	onUser: PropTypes.func,
};

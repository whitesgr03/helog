// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Settings.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { ChangeNameModal } from './ChangeNameModal';
import { DeleteModal } from './DeleteModal';

export const Settings = ({ user, onToggleSettingsMenu, onCloseDropdown }) => {


	return (
		<div className={styles.settings}>
			<div
				className={styles['blur-background']}
				onClick={onToggleSettingsMenu}
			/>
			<div className={styles.wrap}>
				<button
					type="button"
					className={buttonStyles['close-btn']}
					onClick={onToggleSettingsMenu}
					data-testid="close-btn"
				>
					<span className={`${imageStyles.icon} ${buttonStyles.close}`} />
				</button>
				<div className={styles.header}>Settings</div>
				<div className={styles.container}>
					<div className={styles['avatar-wrap']}>
						<div className={styles.avatar}>
							{user.username.charAt(0).toUpperCase()}
						</div>
					</div>
					<ul className={styles.list}>
						<li>
							<strong className={styles.title}>Username</strong>
							{<span>{user.username}</span>}
							<button
								className={styles['change-btn']}
								onClick={() =>
									onActiveModal({
										component: (
											<ChangeNameModal
												username={user.username}
												onActiveModal={onActiveModal}
											/>
										),
									})
								}
							>
								Change username
							</button>
						</li>
						<li>
							<strong className={styles.title}>Email</strong>
							<span>{user.email}</span>
						</li>
						<li>
							<strong className={styles.title}>Delete</strong>
							<button
								className={styles['delete-btn']}
								onClick={() =>
									onActiveModal({
										component: (
											<DeleteModal
												onActiveModal={onActiveModal}
												onAlert={onAlert}
												onCloseDropdown={onCloseDropdown}
											/>
										),
									})
								}
							>
								Delete account
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

Settings.propTypes = {
	user: PropTypes.object,
	onToggleSettingsMenu: PropTypes.func,
	onCloseDropdown: PropTypes.func,
};

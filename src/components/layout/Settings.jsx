// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Settings.module.css';
import bgcStyles from '../../../styles/bgc.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { ChangeNameModel } from './ChangeNameModel';
import { DeleteModel } from './DeleteModel';

export const Settings = ({
	user,
	onUser,
	onAlert,
	onCloseSettings,
	onActiveModal,
}) => {
	const handleClick = e => {
		e.target.dataset.closeSetting && onCloseSettings();
	};

	return (
		<div
			className={bgcStyles['blur-window']}
			onClick={handleClick}
			data-close-setting
			data-testid={'blurBgc'}
		>
				<button
					type="button"
					className={buttonStyles['close-btn']}
					data-close-setting
				>
				</button>
				<div className={style.header}>Settings</div>
				<div className={style.container}>
					<div className={styles['avatar-wrap']}>
						<div className={style.avatar}>
							{user && user.username.charAt(0).toUpperCase()}
						</div>
					</div>
					<ul className={style.list}>
						<li>
                Username
							{user && <span>{user.username}</span>}
							<button
								className={styles['change-btn']}
							>
								Change username
							</button>
						</li>
						<li>
							<strong className={style.title}>Email</strong>
							{user && <span>{user.email}</span>}
						</li>
						<li>
							<strong className={style.title}>Delete</strong>
							<button
								className={styles['delete-btn']}
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
	onCloseSettings: PropTypes.func,
	onActiveModal: PropTypes.func,
	onUser: PropTypes.func,
	onAlert: PropTypes.func,
};

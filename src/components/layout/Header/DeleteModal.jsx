// Packages
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './DeleteModal.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteUser } from '../../../utils/handleUser';

// Components
import { Loading } from '../../utils/Loading';

export const DeleteModal = ({
	onUser,
	onToggleSettingsMenu,
	onActiveModal,
	onAlert,
}) => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const handleDelete = async () => {
		setLoading(true);

		const result = await deleteUser();

		const handleSetUser = () => {
			onUser(null);
			onAlert({
				message: 'Your account has been deleted.',
				error: false,
				delay: 2000,
			});
			onActiveModal({ component: null });
			onToggleSettingsMenu();
		};

		result.success
			? handleSetUser()
			: navigate('/error', {
					state: { error: result.message, previousPath },
				});

		setLoading(false);
	};
	return (
		<>
			{loading && <Loading text={'Deleting...'} light={true} shadow={true} />}
			<div className={styles.model}>
				<span className={styles.title}>Delete Your Account Forever</span>
				<span className={styles.content}>Do you really want to delete?</span>
				<div className={styles['button-wrap']}>
					<button
						className={`${buttonStyles.content} ${buttonStyles.cancel}`}
						data-close-model
						onClick={() => onActiveModal({ component: null })}
					>
						Cancel
					</button>
					<button
						className={`${buttonStyles.content} ${buttonStyles.error}`}
						onClick={handleDelete}
					>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};

DeleteModal.propTypes = {
	onAlert: PropTypes.func,
	onUser: PropTypes.func,
	onToggleSettingsMenu: PropTypes.func,
	onActiveModal: PropTypes.func,
};

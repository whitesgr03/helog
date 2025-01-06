// Packages
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './DeleteModel.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteUser } from '../../../utils/handleUser';

// Components
import { Loading } from '../../utils/Loading';

export const DeleteModel = ({
	onUser,
	onCloseSettings,
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
			onAlert({ message: result.message });
			onActiveModal({ component: null });
			onCloseSettings();
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
						className={buttonStyles.cancel}
						data-close-model
						onClick={() => onActiveModal({ component: null })}
					>
						Cancel
					</button>
					<button className={buttonStyles.error} onClick={handleDelete}>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};

DeleteModel.propTypes = {
	onAlert: PropTypes.func,
	onUser: PropTypes.func,
	onCloseSettings: PropTypes.func,
	onActiveModal: PropTypes.func,
};

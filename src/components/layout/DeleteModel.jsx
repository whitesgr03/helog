// Packages
import { useState } from 'react';
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

	const handleDelete = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/account/logout`;

		const options = {
			method: 'POST',
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		const handleSuccess = () => {
			onModel(null);
			onUser(null);
		};

		result.success
			? handleSuccess()
			: onAlert({ message: result.message, error: true });
		// await onDelete();

		setLoading(false);
		onCloseSettings();
	};
	return (
		<div className={styles.model}>
			{loading && (
				<div className={styles.loading}>
					<Loading />
				</div>
			)}
			<span className={styles.title}>Delete Your Account Forever</span>
			<span className={styles.content}>Do you really want to delete?</span>
			<div className={styles['button-wrap']}>
				<button
					className={buttonStyles.cancel}
					data-close-model
				>
					Cancel
				</button>
				<button className={buttonStyles.error} onClick={handleDelete}>
					Delete
				</button>
			</div>
		</div>
	);
};

DeleteModel.propTypes = {
	onAlert: PropTypes.func,
	onUser: PropTypes.func,
	onCloseSettings: PropTypes.func,
	onActiveModal: PropTypes.func,
};

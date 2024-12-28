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
		<div className={style.model}>
			{loading && (
				<div className={style.loading}>
					<Loading />
				</div>
			)}
			<span className={style.title}>Delete {title}</span>
			<span className={style.content}>Do you really want to delete?</span>
			<div className={style.buttonWrap}>
				<button className={button.cancel} data-close-model>
					Cancel
				</button>
				<button className={button.error} onClick={handleDelete}>
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

// Packages
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../utils/queryOptions';

// Styles
import styles from './DeleteModal.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteUser } from '../../../utils/handleUser';

// Components
import { Loading } from '../../utils/Loading';

export const DeleteModal = ({ onCloseDropdown, onActiveModal, onAlert }) => {
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const { isPending, mutate } = useMutation({
		mutationFn: deleteUser,
		onError: error =>
			navigate('/error', {
				state: { error: error.message, previousPath },
			}),
		onSuccess: () => {
			queryClient.setQueryData(['userInfo'], null);
			onAlert({
				message: 'Your account has been deleted.',
				error: false,
				delay: 2000,
			});
			onActiveModal({ component: null });
			onCloseDropdown();
		},
	});

	const handleDelete = () => mutate();

	return (
		<>
			{isPending && <Loading text={'Deleting...'} light={true} shadow={true} />}
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
	onCloseDropdown: PropTypes.func,
	onActiveModal: PropTypes.func,
};

// Packages
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../utils/queryOptions';

// Styles
import styles from './DeleteModal.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteUser } from '../../../utils/handleUser';

// Components
import { Loading } from '../../utils/Loading';

// Context
import { useAppDataAPI } from '../../pages/App/AppContext';

interface DeleteModalProps {
	onCloseDropdown: () => void;
}

export const DeleteModal = ({ onCloseDropdown }: DeleteModalProps) => {
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();
	const { onModal, onAlert } = useAppDataAPI();

	const { isPending, mutate } = useMutation({
		mutationFn: deleteUser,
		onError: () =>
			navigate('/error', {
				state: { previousPath },
			}),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ['userInfo'] });
			onModal({ component: null });
			onCloseDropdown();
			onAlert([
				{
					message: 'Your account have been deleted.',
					error: false,
					delay: 4000,
				},
			]);
		},
	});

	const handleDelete = () => {
		onModal({
			component: <DeleteModal onCloseDropdown={onCloseDropdown} />,
			clickBgToClose: false,
		});
		mutate();
	};

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
						onClick={() => onModal({ component: null })}
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

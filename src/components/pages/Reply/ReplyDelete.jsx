// Packages
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';

// Styles
import headerDeleteModelStyles from '../../layout/Header/DeleteModal.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteReply } from '../../../utils/handleReply';
import { queryClient } from '../../../utils/queryOptions';

// Components
import { Loading } from '../../utils/Loading';

export const ReplyDelete = ({ commentId, replyId, onAlert, onActiveModal }) => {
	const { isPending, mutate } = useMutation({
		mutationFn: deleteReply(replyId),
		onError: () =>
			onAlert({
				message:
					'Delete the reply has some errors occur, please try again later.',
				error: true,
				delay: 4000,
			}),
		onSuccess: response => {
			queryClient.setQueryData(['replies', commentId], data => {
				const newPages = data.pages.map(page => ({
					...page,
					data: page.data.map(reply =>
						reply._id === replyId ? response.data : reply,
					),
				}));
				return {
					pages: newPages,
					pageParams: data.pageParams,
				};
			});
			onAlert({
				message: 'Reply has been deleted.',
				error: false,
				delay: 4000,
			});
		},
		onSettled: () => onActiveModal({ component: null }),
	});

	const handleDeleteComment = () => {
		onActiveModal({
			component: (
				<ReplyDelete
					commentId={commentId}
					replyId={replyId}
					onAlert={onAlert}
					onActiveModal={onActiveModal}
				/>
			),
			clickToClose: false,
		});
		mutate();
	};

	return (
		<>
			{isPending && (
				<Loading text={'Deleting ...'} light={true} shadow={true} />
			)}
			<div className={headerDeleteModelStyles.model}>
				<span className={headerDeleteModelStyles.title}>
					Delete This Reply Forever
				</span>
				<span className={headerDeleteModelStyles.content}>
					Do you really want to delete?
				</span>
				<div className={headerDeleteModelStyles['button-wrap']}>
					<button
						className={`${buttonStyles.content} ${buttonStyles.cancel}`}
						data-close-model
						onClick={() => onActiveModal({ component: null })}
					>
						Cancel
					</button>
					<button
						className={`${buttonStyles.content} ${buttonStyles.error}`}
						onClick={handleDeleteComment}
					>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};

ReplyDelete.propTypes = {
	commentId: PropTypes.string,
	replyId: PropTypes.string,
	onAlert: PropTypes.func,
	onActiveModal: PropTypes.func,
};

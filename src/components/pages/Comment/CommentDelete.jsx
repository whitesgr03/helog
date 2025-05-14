// Packages
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// Styles
import headerDeleteModelStyles from '../../layout/Header/DeleteModal.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteComment } from '../../../utils/handleComment';
import { queryClient } from '../../../utils/queryOptions';

// Components
import { Loading } from '../../utils/Loading';

// Context
import { useAppDataAPI } from '../App/AppContext';

export const CommentDelete = ({ commentId }) => {
	const { postId } = useParams();
	const { onAlert, onModal } = useAppDataAPI();

	const { isPending, mutate } = useMutation({
		mutationFn: deleteComment(commentId),
		onError: () =>
			onAlert({
				message:
					'Delete the comment has some errors occur, please try again later.',
				error: true,
				delay: 4000,
			}),
		onSuccess: response => {
			queryClient.setQueryData(['comments', postId], data => {
				const newPages = data.pages.map(page => ({
					...page,
					data: {
						...page.data,
						comments: page.data.comments.map(comment =>
							comment._id === commentId ? response.data : comment,
						),
					},
				}));
				return {
					pages: newPages,
					pageParams: data.pageParams,
				};
			});
			onAlert({
				message: 'Comment has been deleted.',
				error: false,
				delay: 4000,
			});
		},
		onSettled: () => onModal({ component: null }),
	});

	const handleDeleteComment = () => {
		onModal({
			component: <CommentDelete commentId={commentId} />,
			clickBgToClose: false,
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
					Delete This Comment Forever
				</span>
				<span className={headerDeleteModelStyles.content}>
					Do you really want to delete?
				</span>
				<div className={headerDeleteModelStyles['button-wrap']}>
					<button
						className={`${buttonStyles.content} ${buttonStyles.cancel}`}
						data-close-model
						onClick={() => onModal({ component: null })}
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

CommentDelete.propTypes = {
	commentId: PropTypes.string,
	onModal: PropTypes.func,
};

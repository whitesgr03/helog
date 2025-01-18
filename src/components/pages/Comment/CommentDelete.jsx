// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';

// Styles
import deleteModelStyles from '../../layout/Header/DeleteModel.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deleteComment } from '../../../utils/handleComment';

// Components
import { Loading } from '../../utils/Loading';

export const CommentDelete = ({
	post,
	commentId,
	onUpdatePost,
	onAlert,
	onActiveModal,
}) => {
	const [loading, setLoading] = useState(false);

	const handleDeleteComment = async () => {
		setLoading(true);

		const result = await deleteComment({
			commentId,
		});

		const handleSuccess = () => {
			const newComments = post.comments.map(comment =>
				comment._id === commentId ? { ...comment, ...result.data } : comment,
			);
			onUpdatePost({ postId: post._id, newComments });
			onAlert({
				message: 'Comment has been deleted.',
				error: false,
				delay: 2000,
			});
			onActiveModal({ component: null });
		};

		const handleFail = () => {
			onAlert({
				message: 'There are some errors occur, please try again later.',
				error: true,
				delay: 3000,
			});
			onActiveModal({ component: null });
		};

		result.success ? handleSuccess() : handleFail();

		setLoading(false);
	};
	return (
		<>
			{loading && <Loading text={'Deleting...'} light={true} shadow={true} />}
			<div className={deleteModelStyles.model}>
				<span className={deleteModelStyles.title}>
					Delete This Comment Forever
				</span>
				<span className={deleteModelStyles.content}>
					Do you really want to delete?
				</span>
				<div className={deleteModelStyles['button-wrap']}>
					<button
						className={buttonStyles.cancel}
						data-close-model
						onClick={() => onActiveModal({ component: null })}
					>
						Cancel
					</button>
					<button className={buttonStyles.error} onClick={handleDeleteComment}>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};

CommentDelete.propTypes = {
	post: PropTypes.object,
	commentId: PropTypes.string,
	onUpdatePost: PropTypes.func,
	onAlert: PropTypes.func,
	onActiveModal: PropTypes.func,
};

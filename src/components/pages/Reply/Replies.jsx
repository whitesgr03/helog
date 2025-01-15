// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';

// Styles
import styles from '../Comment/Comments.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { ReplyDetail } from './ReplyDetail';

// Utils
import { getReplies } from '../../../utils/handleReply';

export const Replies = ({ post, comment }) => {
	const { onAlert, onUpdatePost } = useOutletContext();
	const [loading, setLoading] = useState(false);
	const [skipReplies, setSkipReplies] = useState(10);

	const replies = comment?.replies ?? [];

	const handleGetReplies = async () => {
		setLoading(true);

		const result = await getReplies({
			commentId: comment._id,
			skip: skipReplies,
		});

		setSkipReplies(skipReplies + 10);

		const handleSuccess = () => {
			const newComments = post.comments.map(postComment =>
				postComment._id === comment._id
					? { ...postComment, replies: postComment.replies.concat(result.data) }
					: postComment,
			);
			onUpdatePost({ postId: post._id, newComments });
		};

		result.success
			? handleSuccess()
			: onAlert({
					message: 'There are some errors occur, please try again later.',
					error: true,
				});

		setLoading(false);
	};

	return (
		<div className={styles.replies}>
			<div className={styles.content}>
				<ul>
					{replies.map((reply, index) => (
						<ReplyDetail
							key={reply._id}
							index={index}
							post={post}
							comment={comment}
							reply={reply}
						/>
					))}
				</ul>
				{comment?.countReplies > skipReplies && (
					<div className={styles.load}>
						<button
							className={`${buttonStyles.content} ${buttonStyles.more}`}
							onClick={handleGetReplies}
						>
							Show more replies
							<span
								className={`${imageStyles.icon} ${loading ? '' : imageStyles['hide-icon']} ${buttonStyles['load-icon']}`}
							/>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

Replies.propTypes = {
	post: PropTypes.object,
	comment: PropTypes.object,
	onLoading: PropTypes.func,
};

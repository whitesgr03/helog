// Packages
import { useState, useRef } from 'react';
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
	const [shakeTargetId, setShakeTargetId] = useState('');

	const repliesRef = useRef([]);
	const waitForScrollRef = useRef(null);

	const replies = comment.replies;

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
					delay: 3000,
				});

		setLoading(false);
	};

	const handleScroll = id => {
		const target = repliesRef.current.find(reply => reply.id === id);

		const handleShake = () => {
			clearTimeout(waitForScrollRef.current);

			waitForScrollRef.current = setTimeout(() => {
				setShakeTargetId(id);
				window.removeEventListener('scroll', handleShake);
			}, 100);
		};

		window.addEventListener('scroll', handleShake);

		target.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	const handleAnimationEnd = () => setShakeTargetId('');

	return (
		<div className={styles.replies}>
			<div className={styles.content}>
				<ul>
					{replies.map((reply, index) => (
						<div
							key={reply._id}
							id={reply._id}
							className={shakeTargetId === reply._id ? styles.shake : ''}
							ref={element => (repliesRef.current[index] = element)}
							onAnimationEnd={handleAnimationEnd}
						>
							<ReplyDetail
								index={index}
								post={post}
								comment={comment}
								reply={reply}
								onScroll={handleScroll}
							/>
						</div>
					))}
				</ul>
				{comment?.countReplies > skipReplies && (
					<div className={styles.load}>
						<button
							className={`${buttonStyles.content} ${buttonStyles.more}`}
							onClick={handleGetReplies}
						>
							<span className={buttonStyles.text}>
								Show more replies
								{loading && (
									<span
										className={`${imageStyles.icon} ${buttonStyles['load']}`}
									/>
								)}
							</span>
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

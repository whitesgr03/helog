// Packages
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useOutletContext, Navigate, useLocation } from 'react-router-dom';

// Styles
import styles from './Comments.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { CommentDetail } from './CommentDetail';
import { CommentBox } from './CommentBox';

// Utils
import { getComments } from '../../../utils/handleComment';

export const Comments = ({ post }) => {
	const { user, onUpdatePost } = useOutletContext();
	const [replies, setReplies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { pathname: previousPath } = useLocation();

	const comments = post?.comments ?? [];
	const countComments = comments.length + replies.length;

	const comments = post?.comments ?? [];

	const { pathname: previousPath } = useLocation();

	const handleGetReplies = useCallback(
		async option => {
			let url = `${
				import.meta.env.VITE_RESOURCE_URL
			}/blog/replies?postId=${postId}`;

			const result = await handleFetch(url, option);

			const handleResult = () => {
				result.success ? setReplies(result.data) : setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		},
		[postId],
	);

	const repliesCopy = [...replies];

	const items = comments.map(comment => {
		const replyList = [...repliesCopy].filter(
			reply =>
				reply.comment === comment._id &&
				repliesCopy.splice(
					repliesCopy.findIndex(replyCopy => replyCopy._id === reply._id),
					1,
				),
		);

		return (
			<CommentDetail
				key={comment._id}
				postId={postId}
				commentId={comment._id}
				comment={comment}
				replyList={replyList.length > 0 ? replyList : null}
				handleGetComments={handleGetComments}
				handleGetReplies={handleGetReplies}
				isCommentAuthor={user?._id === comment?.author?._id}
				isPostAuthor={postAuthorId === comment?.author?._id}
				isDeleted={comment.deleted}
			>
				{replyList.length > 0 && (
					<>
						{replyList.map(reply => (
							<CommentDetail
								key={reply._id}
								postId={postId}
								commentId={comment._id}
								replyId={reply._id}
								comment={reply}
								isCommentAuthor={user?._id === reply?.author?._id}
								isPostAuthor={postAuthorId === reply?.author?._id}
								handleGetReplies={handleGetReplies}
								isDeleted={reply.deleted}
							/>
						))}
					</>
				)}
			</CommentDetail>
		);
	});

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetComments = async () => {
			const result = await getComments({ postId: post._id, skip: 0, signal });
			const handleResult = () => {
				result.success
					? onUpdatePost({ postId: post._id, newComments: result.data })
					: setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		post?.comments === undefined ? handleGetComments() : setLoading(false);

		return () => controller.abort();
	}, [post, onUpdatePost]);

	return (
		<div className={styles.comments}>
			{error ? (
				<Navigate to="/error" state={{ error, previousPath }} />
			) : loading ? (
				<Loading text={'Loading comments...'} />
			) : (
				<>
					<h3> {countComments > 0 ? countComments : ''} Comments</h3>

					<div className={styles['comment-box-wrap']}>
						<CommentBox
							submitBtn={'Comment'}
							onGetComments={handleGetComments}
							onCreateComment={handleCreateComment}
						/>
					</div>

					<div className={styles.content}>
						{items.length > 0 ? (
							<ul>{items}</ul>
						) : (
							<p>There are not comments.</p>
						)}
					</div>
				</>
			)}
		</div>
	);
};

Comments.propTypes = {
	post: PropTypes.object,
};

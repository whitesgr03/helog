// Packages
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useOutletContext, Navigate, useLocation } from 'react-router-dom';

// Styles
import styles from './Comments.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { CommentDetail } from './CommentDetail';
import { CommentCreate } from './CommentCreate';

// Utils
import { getComments } from '../../../utils/handleComment';

export const Comments = ({ post }) => {
	const { onUpdatePost } = useOutletContext();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { pathname: previousPath } = useLocation();
	const [fetching, setFetching] = useState(true);

	const comments = post?.comments ?? [];

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleFetchComments = async () => {
			const result = await getComments({
				postId: post._id,
				skip: 0,
				signal,
			});
			const handleResult = () => {
				result.success
					? onUpdatePost({ postId: post._id, newComments: result.data })
          : setError(result.message);
        
				setFetching(false);
			};

			result && handleResult();
		};

		post?.comments === undefined ? handleFetchComments() : setFetching(false);

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
					<h3> {post.countComments > 0 ? post.countComments : ''} Comments</h3>

					<div className={styles['comment-box-wrap']}>
						<CommentCreate post={post} />
					</div>

					<div className={styles.content}>
						{comments.length ? (
							<ul>
								{comments.map((comment, index) => (
									<CommentDetail
										key={comment._id}
										index={index}
										post={post}
										comment={comment}
									/>
								))}
							</ul>
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

// Packages
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// Styles
import styles from './Comments.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { CommentDetail } from './CommentDetail';
import { CommentCreate } from './CommentCreate';

// Utils
import { getComments } from '../../../utils/handleComment';

export const Comments = ({ post }) => {
	const { onAlert, onUpdatePost } = useOutletContext();
	const [loading, setLoading] = useState(false);
	const [skipComments, setSkipComments] = useState(10);
	const [fetching, setFetching] = useState(true);

	const comments = post?.comments ?? [];

	const handleGetComments = async () => {
		setLoading(true);
		const result = await getComments({ postId: post._id, skip: skipComments });

		setSkipComments(skipComments + 10);
		result.success
			? onUpdatePost({
					postId: post._id,
					newComments: post.comments.concat(result.data),
				})
			: onAlert({
					message: 'There are some errors occur, please try again later.',
					error: true,
				});
		setLoading(false);
	};

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
					: onAlert({
							message: 'There are some errors occur, please try again later.',
							error: true,
						});

				setFetching(false);
			};

			result && handleResult();
		};

		post?.comments === undefined ? handleFetchComments() : setFetching(false);

		return () => controller.abort();
	}, [post, onUpdatePost, onAlert]);

	return (
		<div className={styles.comments}>
			{fetching ? (
				<Loading text={'Loading comments...'} />
			) : (
				<>
					<h3> {post.countComments > 0 ? post.countComments : ''} Comments</h3>

					<div className={styles['comment-box-wrap']}>
						<CommentCreate post={post} />
					</div>

					<div className={styles.content}>
						{comments.length ? (
							<>
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
								{post.countComments > skipComments &&
									post.comments.length >= 10 && (
										<div className={styles.load}>
											<button
												className={`${buttonStyles.content} ${buttonStyles.more} `}
												onClick={handleGetComments}
											>
												Show more comments
												<span
													className={`${imageStyles.icon} ${loading ? '' : imageStyles['hide-icon']} ${buttonStyles['load-icon']}`}
												/>
											</button>
										</div>
									)}
							</>
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

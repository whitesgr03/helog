// Packages
import { useRef } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Posts.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Posts = ({ posts, limit, postListRef }) => {
	const imageContentRef = useRef(null);
	return (
		<>
			{posts.length ? (
				<ul className={styles.posts} ref={postListRef}>
					{posts.slice(0, limit).map(
						post =>
							post?.content !== '' && (
								<li key={post._id}>
									<div className={styles.info}>
										<strong className={styles['date-time']}>
											{post.author.username}
										</strong>
										<em>{format(post.updatedAt, 'MMMM d, y')}</em>
									</div>

									<Link to={`/posts/${post._id}`}>
										<div className={imageStyles.content} ref={imageContentRef}>
											{post.mainImage ? (
												<img
													src={post.mainImage}
													alt={`${post.title} main image`}
												/>
											) : (
												<div className={styles['empty-image-wrap']}>
													{'( Empty Main Image )'}
												</div>
											)}
										</div>
									</Link>

									<Link to={`/posts/${post._id}`}>
										<h3 className={styles.title}>
											{post.title ?? '( Empty Title )'}
										</h3>
									</Link>
								</li>
							),
					)}
				</ul>
			) : (
				<p className={styles['no-posts']}>There are not posts.</p>
			)}
		</>
	);
};

Posts.propTypes = {
	posts: PropTypes.array,
	limit: PropTypes.number,
	postListRef: PropTypes.object,
};

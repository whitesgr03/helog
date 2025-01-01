// Packages
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
	Link,
	useOutletContext,
	Navigate,
	useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Posts.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Utils
import { getPosts } from '../../../utils/handlePost';

export const Posts = ({ limit = 0 }) => {
	const { user } = useOutletContext();
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const { pathname: previousPath } = useLocation();

	const items = posts.map(
		post =>
			post?.content !== '' && (
				<li key={post._id}>
					<div className={styles.info}>
						<strong
							className={styles['date-time']}
							title={post.author.username}
						>
							{post.author.username}
						</strong>
						<em>
							{format(
								new Date(post.createdAt).getTime() ===
									new Date(post.updatedAt).getTime()
									? post.createdAt
									: post.updatedAt,
								'MMMM d, y',
							)}
						</em>
					</div>

					<Link to={`/posts/${post._id}`}>
						<div className={imageStyles.content}>
							{post.mainImageUrl ? (
								<img src={post.mainImageUrl} alt={`${post.title} main image`} />
							) : (
								<div className={styles['empty-image-wrap']}>
									{'( Empty Main Image )'}
								</div>
							)}
						</div>
					</Link>

					<Link to={`/posts/${post._id}`}>
						<h3 className={styles.title} title={post.title}>
							{post.title ?? '( Empty Title )'}
						</h3>
					</Link>
				</li>
			),
	);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPosts = async () => {
			const result = await getPosts({ limit, signal });

			const handleResult = () => {
				result.success ? setPosts(result.data) : setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		handleGetPosts();
		return () => controller.abort();
	}, [user, limit]);

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error, previousPath }} />
			) : loading ? (
				<Loading />
			) : (
				<>
					{items.length > 0 ? (
						<ul className={styles.posts}>{items}</ul>
					) : (
						<p>There are not posts.</p>
					)}
				</>
			)}
		</>
	);
};

Posts.propTypes = {
	limit: PropTypes.number,
};

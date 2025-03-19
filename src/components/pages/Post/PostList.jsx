// Modules
import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';

// Styles
import styles from './PostList.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Posts } from './Posts';

// Utils
import { getPosts } from '../../../utils/handlePost';

export const PostList = () => {
	const { posts, countPosts, onUpdatePosts } = useOutletContext();

	const [loading, setLoading] = useState(false);
	const postListRef = useRef(null);

	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const skipPosts = posts.length;

	useEffect(() => {
		const handleScroll = async () => {
			const targetRect = postListRef.current.getBoundingClientRect();

			const isScrollToDivBottom = targetRect.bottom <= window.innerHeight;

			const handleGetPosts = async () => {
				setLoading(true);
				const result = await getPosts({ skip: skipPosts });

				const handleSuccess = () => {
					onUpdatePosts(result.data);
					setLoading(false);
				};
				result.success
					? handleSuccess()
					: navigate('/error', {
							state: { error: result.message, previousPath },
						});
			};

			isScrollToDivBottom && (await handleGetPosts());
		};

		!loading &&
			countPosts > skipPosts &&
			window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, [countPosts, loading, skipPosts, onUpdatePosts, navigate, previousPath]);

	return (
		<div className={styles['post-list']}>
			<div className={styles.container} ref={postListRef}>
				<Posts posts={posts} limit={posts.length} />
			</div>
			{loading && (
				<div className={styles['load-btn']}>
					Loading posts ...
					<span className={`${imageStyles.icon} ${buttonStyles['load']}`} />
				</div>
			)}
		</div>
	);
};

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
	const { posts, countPosts, headerRef, onUpdatePosts } = useOutletContext();
	const [skipPosts, setSkipPosts] = useState(10);
	const [loading, setLoading] = useState(false);
	const postListRef = useRef(null);

	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	useEffect(() => {
		const handleGetPosts = async () => {
			setLoading(true);
			const result = await getPosts({ skip: skipPosts });
			setSkipPosts(skipPosts + 10);
			result.success
				? onUpdatePosts(result.data)
				: navigate('/error', {
						state: { error: result.message, previousPath },
					});
			setLoading(false);
		};

		const handleScroll = async () => {
			const postListHeight = postListRef.current.clientHeight;
			const headerHeight = headerRef.current.clientHeight;

			const isScrollToPostListBottom =
				postListHeight +
					headerHeight -
					document.documentElement.scrollTop -
					document.documentElement.clientHeight <=
				0;

			!loading &&
				countPosts > skipPosts &&
				isScrollToPostListBottom &&
				(await handleGetPosts());
		};

		posts.length < countPosts &&
			document.addEventListener('scroll', handleScroll);

		return () => document.removeEventListener('scroll', handleScroll);
	}, [
		posts,
		countPosts,
		headerRef,
		loading,
		onUpdatePosts,
		skipPosts,
		navigate,
		previousPath,
	]);

	return (
		<div className={styles['post-list']}>
			<Posts posts={posts} limit={posts.length} postListRef={postListRef} />
			{loading && (
				<div className={styles['load-btn']}>
					Loading posts ...
					<span
						className={`${imageStyles.icon} ${buttonStyles['load']}`}
					/>
				</div>
			)}
		</div>
	);
};

// Modules
import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// Styles
import styles from './PostList.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Posts } from './Posts';

// Utils
import { getPosts } from '../../../utils/handlePost';

export const PostList = () => {
	const { posts, countPosts, headerRef, onUpdatePosts, onAlert } =
		useOutletContext();
	const [skipPosts, setSkipPosts] = useState(10);
	const [loading, setLoading] = useState(false);
	const postListRef = useRef(null);

	useEffect(() => {
		const handleGetPosts = async () => {
			setLoading(true);
			const result = await getPosts({ skip: skipPosts });
			setSkipPosts(skipPosts + 10);
			result.success
				? onUpdatePosts(result.data)
				: onAlert({
						message: 'There are some errors occur, please try again later.',
						error: true,
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
		onAlert,
		onUpdatePosts,
		skipPosts,
	]);

	return (
		<div className={styles['post-list']}>
			<Posts posts={posts} limit={posts.length} postListRef={postListRef} />
			{loading && (
				<div className={styles['load-btn']}>
					Loading posts ...
					<span
						className={`${imageStyles.icon} ${buttonStyles['load-icon']}`}
					/>
				</div>
			)}
		</div>
	);
};

// Modules
import { useOutletContext } from 'react-router-dom';

// Styles
import styles from './PostList.module.css';

// Components
import { Posts } from './Posts';

export const PostList = () => {
	const { posts, countPosts, headerRef, onUpdatePosts, onAlert } =
		useOutletContext();

	return (
		<div className={styles['post-list']}>
			<Posts posts={posts} limit={posts.length} />
		</div>
	);
};

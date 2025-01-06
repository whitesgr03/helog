// Modules
import { useOutletContext } from 'react-router-dom';

// Styles
import styles from './PostList.module.css';

// Components
import { Posts } from './Posts';
import { Loading } from '../../utils/Loading';

export const PostList = () => {
	const { posts, fetching } = useOutletContext();

	return (
		<div className={styles['post-list']}>
			{fetching ? (
				<Loading text={'Loading posts...'} />
			) : (
				<Posts posts={posts} limit={posts.length} />
			)}
		</div>
	);
};

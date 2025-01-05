// Styles
import styles from './PostList.module.css';

// Components
import { Posts } from './Posts';

export const PostList = () => {
	return (
		<div className={styles['post-list']}>
			<Posts />
		</div>
	);
};

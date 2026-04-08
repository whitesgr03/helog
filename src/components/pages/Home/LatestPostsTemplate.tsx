// Styles
import styles from './LatestPosts.module.css';
import skeleton from '../../../styles/skeleton.module.css';

import { PostListTemplate } from '../Post/PostListTemplate';

export const LatestPostsTemplate = () => {
	return (
		<div className={styles['latest-posts']}>
			<h2 className={`${styles['headline']} ${skeleton.loading}`}>
				Latest Posts
			</h2>
			<PostListTemplate count={4} />
		</div>
	);
};

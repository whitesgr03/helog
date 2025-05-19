// Styles
import styles from './Posts.module.css';

// Component
import { Item } from './Item';

export interface Post {
	_id: string;
	author: {
		username: string;
	};
	title: string;
	mainImage: string;
	updatedAt: Date;
	createdAt: Date;
}

export const Posts = ({ posts }: { posts: Post[] }) => {
	return (
		<>
			{posts.length > 0 ? (
				<ul className={styles.posts}>
					{posts.map((post, index) => (
						<Item key={post._id} post={post} index={index} />
					))}
				</ul>
			) : (
				<p className={styles['no-posts']}>There are not posts.</p>
			)}
		</>
	);
};

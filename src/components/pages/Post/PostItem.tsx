// Packages
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// Styles
import styles from './Posts.module.css';

// Type
import { Post } from './Posts';
import { PostMainImage } from './PostMainImage';

interface PostProps {
	post: Post;
	index: number;
}

export const PostItem = ({ post, index }: PostProps) => {
	return (
		<li key={post._id}>
			<div className={styles.info}>
				<strong className={styles['date-time']}>{post.author.username}</strong>
				<em>{format(post.updatedAt, 'MMMM d, y')}</em>
			</div>

			<Link to={`../posts/${post._id}`}>
				<PostMainImage url={post.mainImage} index={index} />
			</Link>

			<Link to={`../posts/${post._id}`}>
				<h3 className={styles.title} title={post.title}>
					{post.title}
				</h3>
			</Link>
		</li>
	);
};

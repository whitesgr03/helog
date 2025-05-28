// Packages
import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// Styles
import styles from './Posts.module.css';
import imageStyles from '../../../styles/image.module.css';

// Type
import { Post } from './Posts';

interface PostProps {
	post: Post;
	index: number;
}

export const Item = ({ post, index }: PostProps) => {
	const [error, setError] = useState(false);

	const imageContentRef = useRef<HTMLDivElement>(null);

	const { clientWidth = '1024', clientHeight = '768' } =
		imageContentRef.current ?? {};

	const errorImageUrl = `https://fakeimg.pl/${clientWidth}x${clientHeight}/?text=404%20Image%20Error&font=noto`;

	const handleError = () => {
		setError(true);
	};
	const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) =>
		(e.currentTarget.width <= 0 || e.currentTarget.height <= 0) &&
		handleError();
	return (
		<li key={post._id}>
			<div className={styles.info}>
				<strong className={styles['date-time']}>{post.author.username}</strong>
				<em>{format(post.updatedAt, 'MMMM d, y')}</em>
			</div>

			<Link to={`../posts/${post._id}`}>
				<div className={imageStyles.content} ref={imageContentRef}>
					<img
						src={error ? errorImageUrl : post.mainImage}
						alt={`Main image of post ${index + 1}`}
						loading="lazy"
						onError={handleError}
						onLoad={handleLoad}
					/>
				</div>
			</Link>

			<Link to={`../posts/${post._id}`}>
				<h3 className={styles.title} title={post.title}>
					{post.title}
				</h3>
			</Link>
		</li>
	);
};

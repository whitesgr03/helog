// Packages
import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Posts.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Posts = ({ posts, limit }) => {
	const [errorImage, setErrorImage] = useState(null);
	const imageContentRef = useRef(null);

	const handleError = () => {
		const content = imageContentRef.current;
		const { clientWidth, clientHeight } = content;
		setErrorImage(
			`https://fakeimg.pl/${clientWidth}x${clientHeight}/?text=404%20Error&font=noto`,
		);
	};

	const handleLoad = e =>
		(e.target.width <= 0 || e.target.height <= 0) && handleError();

	return (
		<>
			{posts.length ? (
				<ul className={styles.posts}>
					{posts.slice(0, limit).map((post, index) => (
						<li key={post._id}>
							<div className={styles.info}>
								<strong className={styles['date-time']}>
									{post.author.username}
								</strong>
								<em>{format(post.updatedAt, 'MMMM d, y')}</em>
							</div>

							<Link to={`../posts/${post._id}`}>
								<div className={imageStyles.content} ref={imageContentRef}>
									<img
										src={errorImage ?? post.mainImage}
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
					))}
				</ul>
			) : (
				<p className={styles['no-posts']}>There are not posts.</p>
			)}
		</>
	);
};

Posts.propTypes = {
	posts: PropTypes.array,
	limit: PropTypes.number,
};

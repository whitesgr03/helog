// Packages
import { useEffect, useState } from 'react';
import {
	useParams,
	useOutletContext,
	Link,
	Navigate,
	useLocation,
} from 'react-router-dom';
import { format } from 'date-fns';
import { Editor } from '@tinymce/tinymce-react';

// Styles
import styles from './PostDetail.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { Comments } from '../Comment/Comments';

// Utils
import { getPostDetail } from '../../../utils/handlePost';

export const PostDetail = () => {
	const { postId } = useParams();
	const { posts, onUpdatePost } = useOutletContext();
	const [loadContent, setLoadContent] = useState(true);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const imageContentRef = useRef(null);

	const post = posts.find(post => post._id === postId);

	const { pathname: previousPath } = useLocation();

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPostDetail = async () => {
			const result = await getPostDetail({ postId: post._id, signal });
			const handleResult = () => {
				result.success
					? onUpdatePost({ postId: post._id, newPost: result.data })
					: setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		post?.content === undefined ? handleGetPostDetail() : setLoading(false);

		return () => controller.abort();
	}, [post, onUpdatePost]);

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error, previousPath }} />
			) : (
				<>
					<div id="post-detail" className={styles['post-detail']}>
						{(loading || loadContent) && <Loading text={'Loading post...'} />}
						<div
							className={`${styles.container} ${loading || loadContent ? styles.loading : ''}`}
						>
							<Link to={-1} className={styles.link}>
								<span
									className={`${styles['left-arrow']} ${imageStyles.icon}`}
								/>
								Back to previous page
							</Link>
							{post?.title && <h2 className={styles.title}>{post.title}</h2>}
							<div className={styles['date-time']}>
								<strong>{post.author.username}</strong>
								<em>{`Published in ${format(post.createdAt, 'MMMM d, y')}`}</em>
								{new Date(post.createdAt).getDate() !==
									new Date(post.updatedAt).getDate() && (
									<em>{`Edited in ${format(post.updatedAt, 'MMMM d, y')}`}</em>
								)}
								{post?.mainImageUrl && (
									<div className={styles['image-wrap']}>
										<div className={imageStyles.content} ref={imageContentRef}>
											<img
												src={post.mainImageUrl}
												alt={`${post.title}'s main image`}
											/>
										</div>
									</div>
								)}
							</div>
							<Editor
								tinymceScriptSrc="/tinymce/tinymce.min.js"
								licenseKey="gpl"
								id="editor"
								disabled={true}
								value={post.content ?? ''}
								onInit={() => {
									setLoadContent(false);
								}}
								init={{
									menubar: false,
									toolbar: false,
									inline: true,
									plugins: 'codesample',
								}}
							/>
						</div>
					</div>
					{!loading && !loadContent && <Comments post={post} />}
				</>
			)}
		</>
	);
};

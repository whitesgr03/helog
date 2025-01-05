// Packages
import { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Editor } from '@tinymce/tinymce-react';

// Styles
import styles from './PostDetail.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { Error } from '../../utils/Error/Error';
import { Comments } from '../Comment/Comments';

// Utils
import { getPostDetail } from '../../../utils/handlePost';

export const PostDetail = () => {
	const { postId } = useParams();
	const { user } = useOutletContext();
	const [post, setPost] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadContent, setLoadContent] = useState(true);

	const createdAt = post?.createdAt && new Date(post.createdAt).getTime();
	const lastModified =
		post?.lastModified && new Date(post.lastModified).getTime();

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPostDetail = async () => {
			const result = await getPostDetail({ postId, signal });

			const handleResult = () => {
				result.success ? setPost(result.data) : setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		handleGetPostDetail();
		return () => controller.abort();
	}, [user, postId]);
	return (
		<>
			{error || post?.content === '' ? (
				<Error message={error} />
			) : (
				<>
					<div className={`${loading || loadContent ? styles.loading : ''}`}>
						<div id="postDetail" className={styles.postDetail}>
							<Link to="/posts" className={styles.link}>
								<span className={`${styles.leftArrow} ${imageStyles.icon}`} />
								Back to list
							</Link>

							{post?.title && <h2 className={styles.title}>{post.title}</h2>}
							<div className={styles.dateTime}>
								<strong>{post?.author?.name}</strong>
								{post?.lastModified && (
									<em>
										{`${
											createdAt === lastModified ? 'Published' : 'Edited'
										} in ${format(
											createdAt === lastModified
												? post.createdAt
												: post.lastModified,
											'MMMM d, y',
										)}`}
									</em>
								)}

								{post?.mainImageUrl && (
									<div className={styles.imageWrap}>
										<div className={imageStyles.content}>
											<img
												src={post.mainImageUrl}
												alt={`${post.title} main imageStyles`}
											/>
										</div>
									</div>
								)}
							</div>
							<Editor
								tinymceScriptSrc="/tinymce/tinymce.min.js"
								licenseKey="gpl"
								id="content"
								disabled={true}
								value={post?.content}
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
						<Comments postAuthorId={post?.author?._id} postId={postId} />
					</div>
					{(loading || loadContent) && <Loading />}
				</>
			)}
		</>
	);
};

PostDetail.propTypes = {
	post: PropTypes.object,
};

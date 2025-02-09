// Packages
import { useEffect, useState, useRef } from 'react';
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
	const [contentEditorLoad, setContentEditorLoad] = useState(true);
	const [loading, setLoading] = useState(true);
	const [checking, setChecking] = useState(true);
	const [error, setError] = useState(null);
	const [errorImage, setErrorImage] = useState(null);
	const imageContentRef = useRef(null);
	const contentRef = useRef(null);

	const post = posts.find(post => post._id === postId);

	const { pathname: previousPath } = useLocation();

	const handleError = () => {
		const content = imageContentRef.current;
		const { clientWidth, clientHeight } = content;
		setErrorImage(
			`https://fakeimg.pl/${clientWidth}x${clientHeight}/?text=404%20Error&font=noto`,
		);
	};

	const handleLoad = e =>
		(e.target.width <= 0 || e.target.height <= 0) && handleError();

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPostDetail = async () => {
			const result = await getPostDetail({ postId, signal });
			const handleResult = () => {
				result.success
					? onUpdatePost({ postId, newPost: result.data })
					: setError(result);
				setLoading(false);
			};

			result && handleResult();
		};

		post?.content === undefined ? handleGetPostDetail() : setLoading(false);

		return () => controller.abort();
	}, [post, postId, onUpdatePost]);

	useEffect(() => {
		const handleCheckContentImages = async () => {
			const editor = contentRef.current;
			let content = editor.getContent();

			const imgs = content.match(/<img.+">/g) ?? [];

			const imageErrors = await Promise.all(
				imgs.map(
					img =>
						new Promise(resolve => {
							const url = img.match(/(?<=src=")(.*?)(?=")/g)[0];
							const size = img.match(/(?<=width:\s|height:\s).*?(?=px;)/g);
							const image = new Image();
							const handleError = () => {
								const regex = new RegExp(`(?<=src=")${url}(?=")`);
								const errorImageUrl = `https://fakeimg.pl/${size[0] ?? 1024}x${size[1] ?? 768}/?text=404%20Error&font=noto`;
								content = content.replace(regex, errorImageUrl);
								resolve(true);
							};
							const handleLoad = () =>
								image.width <= 0 || image.height <= 0
									? handleError()
									: resolve(false);
							image.onerror = handleError;
							image.onload = handleLoad;
							image.src = url;
						}),
				),
			);

			imageErrors.find(error => error === true) && editor.setContent(content);

			setChecking(false);
		};

		!loading && !contentEditorLoad && handleCheckContentImages();
	}, [loading, contentEditorLoad]);

	return (
		<>
			{error ? (
				error.status === 404 ? (
					<Navigate to="/error/404" />
				) : (
					<Navigate to="/error" state={{ error, previousPath }} />
				)
			) : (
				<>
					<div id="post-detail" className={styles['post-detail']}>
						{checking && <Loading text={'Loading post...'} />}
						<div
							className={`${styles.container} ${checking ? styles.hide : ''}`}
						>
							<Link to={-1} className={styles.link}>
								<span
									className={`${styles['left-arrow']} ${imageStyles.icon}`}
								/>
								Back to previous page
							</Link>
							{post?.title && <h2 className={styles.title}>{post.title}</h2>}
							<div className={styles['published-date']}>
								<strong>{post.author.username}</strong>
								<em>{`Published in ${format(post.createdAt, 'MMMM d, y')}`}</em>
								{new Date(post.createdAt).getDate() !==
									new Date(post.updatedAt).getDate() && (
									<em>{`Edited in ${format(post.updatedAt, 'MMMM d, y')}`}</em>
								)}
							</div>
							{post?.mainImage && (
								<div className={styles['image-wrap']}>
									<div className={imageStyles.content} ref={imageContentRef}>
										<img
											src={errorImage || post.mainImage}
											alt="Main image"
											onError={handleError}
											onLoad={handleLoad}
										/>
									</div>
								</div>
							)}

							<Editor
								tinymceScriptSrc="/tinymce/tinymce.min.js"
								licenseKey="gpl"
								id="editor-content"
								disabled={true}
								initialValue={post?.content ?? ''}
								onInit={(evt, editor) => {
									setContentEditorLoad(false);
									contentRef.current = editor;
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
					{!checking && <Comments post={post} />}
				</>
			)}
		</>
	);
};

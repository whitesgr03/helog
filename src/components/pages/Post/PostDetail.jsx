// Packages
import { useEffect, useState, useRef } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Editor } from '@tinymce/tinymce-react';
import { useQuery } from '@tanstack/react-query';

// Styles
import styles from './PostDetail.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { Comments } from '../Comment/Comments';

// Utils
import { queryPostDetailOption } from '../../../utils/queryOptions';

export const PostDetail = () => {
	const { postId } = useParams();
	const [contentEditorLoad, setContentEditorLoad] = useState(true);
	const [checking, setChecking] = useState(true);
	const [errorImage, setErrorImage] = useState(null);

	const imageContentRef = useRef(null);
	const contentRef = useRef(null);

	const { pathname: previousPath } = useLocation();

	const {
		isPending,
		isError,
		data: post,
		error,
	} = useQuery(queryPostDetailOption(postId));

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

		!isPending && !contentEditorLoad && handleCheckContentImages();
	}, [isPending, contentEditorLoad]);

	return (
		<>
			<div id="post-detail" className={styles['post-detail']}>
				{isError ? (
					error.cause.status === 404 ? (
						<Navigate to="/error/404" />
					) : (
						<Navigate
							to="/error"
							state={{
								previousPath,
							}}
						/>
					)
				) : (
					checking && <Loading text={'Loading post ...'} />
				)}
				<div
					className={`${styles.container} ${checking ? styles.hide : ''}`}
					data-testid="container"
				>
					{post && (
						<>
							<Link to="/posts" className={styles.link}>
								<span
									className={`${styles['left-arrow']} ${imageStyles.icon}`}
								/>
								Back to list
							</Link>

							<h2 className={styles.title} title={post.title}>
								{post.title}
							</h2>

							<div className={styles['published-date']}>
								<strong>{post.author.username}</strong>

								<em>{`Published in ${format(post.createdAt, 'MMMM d, y')}`}</em>
								{new Date(post.createdAt).getDate() !==
									new Date(post.updatedAt).getDate() && (
									<em>{`Edited in ${format(post.updatedAt, 'MMMM d, y')}`}</em>
								)}
							</div>

							<div className={styles['image-wrap']}>
								<div className={imageStyles.content} ref={imageContentRef}>
									<img
										title={post.title}
										src={errorImage || post.mainImage}
										alt="Main image"
										onError={handleError}
										onLoad={handleLoad}
									/>
								</div>
							</div>
						</>
					)}
					<Editor
						id="editor-content"
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
			{!checking && (
				<Comments
					post={post}
					onUpdatePost={
						appComponentPost ? onUpdatePost : handleUpdateCurrentPost
					}
				/>
			)}
		</>
	);
};

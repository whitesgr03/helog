// Packages
import { useEffect, useState, useRef } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
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
	const { postId = '' } = useParams() ?? {};
	const [contentEditorLoad, setContentEditorLoad] = useState(true);
	const [checking, setChecking] = useState(true);
	const [errorMainImage, setErrorMainImage] = useState(false);

	const imageContentRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<TinyMCEEditor | null>(null);

	const { pathname: previousPath } = useLocation();

	const {
		isPending,
		isError,
		data: post,
		error,
	} = useQuery(queryPostDetailOption(postId));

	const { clientWidth = '350', clientHeight = '200' } =
		imageContentRef.current ?? {};

	const errorImageUrl = `https://fakeimg.pl/${clientWidth}x${clientHeight}/?text=404%20Error&font=noto`;

	const handleError = () => setErrorMainImage(true);
	const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) =>
		(e.currentTarget.width <= 0 || e.currentTarget.height <= 0) &&
		handleError();

	useEffect(() => {
		let editorContent = editorRef.current?.getContent() ?? '';
		const imgs = editorContent?.match(/<img.+">/g) ?? [];

		const handleCheckContentImages = async () => {
			const imageErrors = await Promise.all(
				imgs.map(
					img =>
						new Promise(resolve => {
							const [url = ''] = img.match(/(?<=src=")(.*?)(?=")/g) ?? [];
							const [width = '350', height = '200'] =
								img.match(/(?<=width:\s|height:\s).*?(?=px;)/g) ?? [];

							const image = new Image();
							const handleError = () => {
								const errorImageUrl = `https://fakeimg.pl/${width}x${height}/?text=404%20Image%20Error&font=noto`;

								editorContent = editorContent.replace(url, errorImageUrl);

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

			Array.isArray(imageErrors) &&
				imageErrors.find(error => error === true) &&
				editorRef.current?.setContent(editorContent);

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
										src={errorMainImage ? errorImageUrl : post.mainImage}
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
						onInit={(_evt, editor) => {
							editorRef.current = editor;
							setContentEditorLoad(false);
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

			{!isPending && !isError && (
				<div className={`${checking ? styles.hide : ''}`}>
					<Comments postId={postId} />
				</div>
			)}
		</>
	);
};

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
import { PostMainImage } from './PostMainImage';

// Utils
import { queryPostDetailOption } from '../../../utils/queryOptions';

export const PostDetail = () => {
	const { postId = '' } = useParams() ?? {};
	const [editorLoading, setEditorLoading] = useState(true);
	const [checkingEditorImages, setCheckingEditorImages] = useState(true);

	const editorRef = useRef<TinyMCEEditor | null>(null);

	const { pathname: previousPath } = useLocation();

	const {
		isPending,
		isError,
		data: post,
		error,
	} = useQuery(queryPostDetailOption(postId));

	useEffect(() => {
		const checkEditorImages = async () => {
			let editorContent = editorRef.current?.getContent() ?? '';
			const editorImages = editorContent?.match(/<img.+">/g) ?? [];

			const isErrorImage = (src: string) =>
				new Promise(resolve => {
					const newImage = new Image();
					newImage.onerror = () => resolve(true);
					newImage.onload = () =>
						newImage.width <= 0 || newImage.height <= 0
							? resolve(true)
							: resolve(false);
					newImage.src = src;
				});

			const replaceErrorImageToFakeImage = (
				src: string,
				width: string,
				height: string,
			) => {
				const fakeImageUrl = `https://fakeimg.pl/${width}x${height}/?text=404%20Image%20Error&font=noto`;

				editorContent = editorContent.replace(src, fakeImageUrl);
				editorRef.current?.setContent(editorContent);
			};

			for (const image of editorImages) {
				const [src = ''] = image.match(/(?<=src=")(.*?)(?=")/g) ?? [];
				const [width = '350', height = '200'] =
					image.match(/(?<=width:\s|height:\s).*?(?=px;)/g) ?? [];

				(await isErrorImage(src)) &&
					replaceErrorImageToFakeImage(src, width, height);
			}

			setCheckingEditorImages(false);
		};

		!isPending && !editorLoading && checkEditorImages();
	}, [isPending, editorLoading]);

	return (
		<>
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
				<div id="post-detail" className={styles['post-detail']}>
					{editorLoading ? (
						<Loading text={'Formatting Text ...'} />
					) : (
						checkingEditorImages && <Loading text={'Optimizing images ...'} />
					)}

					<div
						className={`${styles.container} ${checkingEditorImages ? styles.hide : ''}`}
						data-testid="container"
					>
						{post && (
							<>
								<title>{post.title}</title>
								<meta
									name="description"
									content={`Written by ${post.author.username}, Published in ${post.updatedAt}, Summary: ${post.title}, 10 min read.`}
								/>
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
									<PostMainImage title={post.title} url={post.mainImage} />
								</div>
							</>
						)}
						<Editor
							id="editor-content"
							initialValue={post?.content ?? ''}
							onInit={(_evt, editor) => {
								editorRef.current = editor;
								setEditorLoading(false);
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
			)}

			{!isPending && !isError && (
				<div className={`${checkingEditorImages ? styles.hide : ''}`}>
					<Comments postId={postId} />
				</div>
			)}
		</>
	);
};

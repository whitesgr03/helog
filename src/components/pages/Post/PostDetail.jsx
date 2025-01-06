// Packages
import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Editor } from '@tinymce/tinymce-react';

// Styles
import styles from './PostDetail.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { Comments } from '../Comment/Comments';

export const PostDetail = () => {
	const { postId } = useParams();
	const { posts, fetching } = useOutletContext();
	const [loadContent, setLoadContent] = useState(true);

	const post = posts.find(post => post.id === postId);

	return (
		<>
			{fetching ? (
				<Loading text={'Loading post...'} />
			) : (
				<div className={loadContent ? styles.loading : ''}>
					<div id="post-detail" className={styles['post-detail']}>
						<Link to="/posts" className={styles.link}>
							<span className={`${styles['left-arrow']} ${imageStyles.icon}`} />
							Back to list
						</Link>
						{post?.title && <h2 className={styles.title}>{post.title}</h2>}
						<div className={styles['date-time']}>
							<strong>{post.author.username}</strong>
							{post.updatedAt && (
								<em>
									{`${new Date(post.createdAt).getTime() !== new Date(post.updatedAt).getTime() ? 'Edited' : 'Published'} in ${format(post.updatedAt, 'MMMM d, y')}`}
								</em>
							)}
							{post?.mainImageUrl && (
								<div className={styles['image-wrap']}>
									<div className={imageStyles.content}>
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
							id="content"
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
					<Comments postAuthorId={post?.author?._id} postId={postId} />
				</div>
			)}
		</>
	);
};

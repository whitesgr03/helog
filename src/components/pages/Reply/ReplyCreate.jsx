// Packages
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';

// Styles
import styles from '../Comment/CommentBox.module.css';
import formStyles from '../../../styles/form.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Utils
import { replyComment } from '../../../utils/handleReply';
import { createReply } from '../../../utils/handleReply';
import { verifySchema } from '../../../utils/verifySchema';

export const ReplyCreate = ({ post, comment, reply, onCloseReplyBox }) => {
	const { user, onAlert, onUpdatePost } = useOutletContext();
	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState({ content: '' });
	const [loading, setLoading] = useState(false);
	const [debounce, setDebounce] = useState(false);
	const textbox = useRef(null);
	const timer = useRef(null);

	const schema = useMemo(
		() => ({
			content: string()
				.trim()
				.required('Content is required.')
				.max(500, ({ max }) => `Content must be less than ${max} long.`),
		}),
		[],
	);

	const handleCreateComment = async () => {
		setLoading(true);

		const result = reply
			? await createReply({
					data: formFields,
					replyId: reply._id,
				})
			: await replyComment({
					data: formFields,
					commentId: comment._id,
				});

		const handleSuccess = () => {
			const newComments = post.comments.map(postComment =>
				postComment._id === comment._id
					? {
							...postComment,
							countReplies: postComment?.countReplies
								? postComment.countReplies + 1
								: 1,
							replies: postComment?.replies
								? reply
									? [...postComment.replies, result.data]
									: [result.data, ...postComment.replies]
								: [result.data],
						}
					: postComment,
			);

			onUpdatePost({
				postId: post._id,
				newPost: {
					...post,
					countComments: post.countComments + 1,
					comments: newComments,
				},
			});

			onAlert({
				message: 'A new reply has been added.',
				error: false,
				delay: 2000,
			});
			onCloseReplyBox();
		};

		result.success
			? handleSuccess()
			: result.fields
				? setInputErrors({ ...result.fields })
				: onAlert({
						message: 'There are some errors occur, please try again later.',
						error: true,
						delay: 3000,
					});

		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const validationResult = await verifySchema({ schema, data: formFields });

		const handleInValid = () => {
			setInputErrors(validationResult.fields);
			setDebounce(false);
		};

		const handleValid = async () => {
			setInputErrors({});
			await handleCreateComment();
		};

		validationResult.success ? await handleValid() : handleInValid();
	};

	const handleChange = e => {
		const ref = textbox.current;

		ref.style.height = 'auto';

		const height =
			ref.offsetHeight > ref.scrollHeight ? ref.offsetHeight : ref.scrollHeight;

		ref.style.height = `${height}px`;

		const { name, value } = e.target;

		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);
		!isEmpty(inputErrors) && setDebounce(true);
	};

	useEffect(() => {
		debounce &&
			(timer.current = setTimeout(async () => {
				const validationResult = await verifySchema({
					schema,
					data: formFields,
				});
				validationResult.success
					? setInputErrors({})
					: setInputErrors(validationResult.fields);
			}, 500));

		return () => {
			clearTimeout(timer.current);
		};
	}, [schema, debounce, formFields]);

	return (
		<div className={styles['comment-box']}>
			{loading && (
				<>
					<div className={styles.blur} />
					<Loading text={'Commenting...'} />
				</>
			)}
			<form
				className={formStyles.content}
				onSubmit={e => !loading && handleSubmit(e)}
			>
				<div className={formStyles['label-wrap']}>
					<label
						className={`${inputErrors.content ? formStyles.error : ''}`}
						data-testid="label"
					>
						<div className={styles.profile}>
							<div className={styles.avatar}>
								{user.username.charAt(0).toUpperCase()}
							</div>
							<h4>{user.username}</h4>
						</div>
						<textarea
							name="content"
							placeholder="write a comment..."
							onChange={handleChange}
							value={formFields.content}
							ref={textbox}
							rows="1"
							autoFocus={true}
						/>
					</label>
					{!isEmpty(inputErrors) && (
						<div data-testid="error-message">
							<span className={`${imageStyles.icon} ${formStyles.alert}`} />
							<span className={formStyles.placeholder}>
								{inputErrors.content}
							</span>
						</div>
					)}
				</div>

				<div className={styles['button-wrap']}>
					<button
						type="button"
						className={`${buttonStyles.content} ${buttonStyles.cancel}`}
						onClick={onCloseReplyBox}
					>
						Cancel
					</button>
					<button
						type="submit"
						className={`${buttonStyles.content} ${buttonStyles.success}`}
					>
						Comment
					</button>
				</div>
			</form>
		</div>
	);
};

ReplyCreate.propTypes = {
	post: PropTypes.object,
	comment: PropTypes.object,
	reply: PropTypes.object,
	onCloseReplyBox: PropTypes.func,
};

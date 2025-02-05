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
import { updateReply } from '../../../utils/handleReply';
import { verifySchema } from '../../../utils/verifySchema';

export const ReplyUpdate = ({ post, commentId, reply, onCloseCommentBox }) => {
	const { onAlert, onUpdatePost } = useOutletContext();
	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState({ content: reply.content });
	const [loading, setLoading] = useState(false);
	const [debounce, setDebounce] = useState(false);
	const textbox = useRef(null);
	const timer = useRef(null);

	const schema = useMemo(
		() => ({
			content: string()
				.trim()
				.required('Content is required.')
				.notOneOf(
					[reply.content],
					'New content should be different from the old content.',
				)
				.max(500, ({ max }) => `Content must be less than ${max} long.`),
		}),
		[reply.content],
	);

	const handleUpdateComment = async () => {
		setLoading(true);

		const result = await updateReply({
			replyId: reply._id,
			data: formFields,
		});

		const handleSuccess = () => {
			const newComments = post.comments.map(postComment =>
				postComment._id === commentId
					? {
							...postComment,
							replies: postComment.replies.map(commentReply =>
								commentReply._id === reply._id ? result.data : commentReply,
							),
						}
					: postComment,
			);

			onUpdatePost({
				postId: post._id,
				newComments,
			});
			onAlert({
				message: 'Reply has been updated.',
				error: false,
				delay: 2000,
			});
			onCloseCommentBox();
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
			await handleUpdateComment();
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

	useEffect(() => {
		const setTextboxHeight = () => {
			const ref = textbox.current;

			const height =
				ref.offsetHeight > ref.scrollHeight
					? ref.offsetHeight
					: ref.scrollHeight;

			ref.style.height = `${height}px`;

			const lastTextPosition = ref.value.length;
			ref.setSelectionRange(lastTextPosition, lastTextPosition);
		};

		setTextboxHeight();
	}, []);

	return (
		<div className={styles['comment-box']}>
			{loading && (
				<>
					<div className={styles.blur} />
					<Loading text={'Updating...'} />
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
						onClick={onCloseCommentBox}
					>
						Cancel
					</button>
					<button
						type="submit"
						className={`${buttonStyles.content} ${buttonStyles.success}`}
					>
						Update
					</button>
				</div>
			</form>
		</div>
	);
};

ReplyUpdate.propTypes = {
	post: PropTypes.object,
	commentId: PropTypes.string,
	reply: PropTypes.object,
	onCloseCommentBox: PropTypes.func,
};

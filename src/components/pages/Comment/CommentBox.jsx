// Packages
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';

// Styles
import styles from './CommentBox.module.css';
import formStyles from '../../../styles/form.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Utils
import { createComment } from '../../../utils/handleComment';
import { verifySchema } from '../../../utils/verifySchema';

export const CommentBox = ({
	post,
	submitBtn,
	onUpdatePost,
	onCloseCommentBox,
	defaultValue = '',
}) => {
	const defaultFields = { content: defaultValue };

	const { user, onAlert } = useOutletContext();
	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState(defaultFields);
	const [loading, setLoading] = useState(false);
	const [showSubmitButton, setShowSubmitButton] = useState(false);
	const [debounce, setDebounce] = useState(false);
	const textbox = useRef(null);
	const timer = useRef(null);

	const schema = useMemo(
		() => ({
			content: string()
				.trim()
				.required('Content is required.')
				.when([], {
					is: () => defaultValue !== '',
					then: schema =>
						schema.notOneOf(
							[defaultValue],
							'New content should be different from the old content.',
						),
				})
				.max(500, ({ max }) => `Content must be less than ${max} long.`),
		}),
		[defaultValue],
	);

	const handleCreateComment = async () => {
		setLoading(true);

		const result = await createComment({ postId: post.id, data: formFields });

		const handleSuccess = () => {
			onUpdatePost({
				postId: post.id,
				newComments: [result.data, ...post.comments],
			});
			onAlert({ message: 'Add comment successfully' });
			setFormFields(defaultFields);
			setDebounce(false);
			onCloseCommentBox ? onCloseCommentBox(false) : setShowSubmitButton(false);
		};

		result.success
			? handleSuccess()
			: result.fields
				? setInputErrors({ ...result.fields })
				: onAlert({
						message: 'There are some errors occur, please try again later.',
						error: true,
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

	const handleFocus = () => {
		const handleBlur = () => {
			textbox.current.blur();
			onAlert({
				message: 'You need to be logged in to your account to post a comment.',
			});
		};

		user ? setShowSubmitButton(true) : handleBlur();
	};

	const handleCloseSubmitButton = () => {
		textbox.current.style.height = 'auto';
		setShowSubmitButton(false);
		setFormFields(defaultFields);
		setInputErrors({});
		setDebounce(false);
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

		submitBtn === 'Update' && setTextboxHeight();
	}, [submitBtn]);

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
					<label className={`${inputErrors.content ? formStyles.error : ''}`}>
						{user && defaultValue === '' && (
							<div className={styles.profile}>
								<div className={styles.avatar}>
									{user.username.charAt(0).toUpperCase()}
								</div>
								<h4 title={user.username}>{user.username}</h4>
							</div>
						)}
						<textarea
							name="content"
							placeholder="write a comment..."
							onChange={handleChange}
							onFocus={handleFocus}
							value={formFields.content}
							ref={textbox}
							rows="1"
							autoFocus={submitBtn !== 'Comment'}
						/>
					</label>
					{!isEmpty(inputErrors) &&
						(submitBtn === 'Reply' || showSubmitButton) && (
							<div>
								<span className={`${imageStyles.icon} ${formStyles.alert}`} />
								<span className={formStyles.placeholder}>
									{inputErrors.content}
								</span>
							</div>
						)}
				</div>

				{(submitBtn === 'Reply' || showSubmitButton) && (
					<div className={styles['button-wrap']}>
						<button
							type="button"
							className={buttonStyles.cancel}
							onClick={onCloseCommentBox ?? handleCloseSubmitButton}
						>
							Cancel
						</button>
						<button type="submit" className={buttonStyles.success}>
							{submitBtn}
						</button>
					</div>
				)}
			</form>
		</div>
	);
};

CommentBox.propTypes = {
	post: PropTypes.object,
	submitBtn: PropTypes.string,
	onUpdatePost: PropTypes.func,
	onCloseCommentBox: PropTypes.func,
	defaultValue: PropTypes.string,
};

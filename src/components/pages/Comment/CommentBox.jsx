// Packages
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { object, string } from 'yup';

// Styles
import styles from './CommentBox.module.css';
import formStyles from '../../../styles/form.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Utils
// import handleGetAuthCode from '../../utils/handleGetAuthCode';

export const CommentBox = ({
	submitBtn,
	onGetComments,
	onCreateComment,
	onCloseCommentBox,
	defaultValue,
}) => {
	const defaultFields = { content: defaultValue ?? '' };

	const { user, onAlert } = useOutletContext();
	const [inputErrors, setInputErrors] = useState(null);
	const [formFields, setFormFields] = useState(defaultFields);
	const [loading, setLoading] = useState(null);
	const [showSubmitButton, setShowSubmitButton] = useState(null);
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

		const result = await createComment({ postId, data: formFields });

		const handleSuccess = () => {
			onUpdatePost({ postId, newComments: [result.data, ...comments] });
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

		(!defaultValue || defaultValue !== formFields.content) &&
		!loading &&
		(await handleValidFields(formFields))
			? await handleAddComment()
			: setDebounce(false);
	};

	const handleChange = e => {
		const ref = textbox.current;

		ref.styles.height = 'auto';

		const height =
			ref.offsetHeight > ref.scrollHeight ? ref.offsetHeight : ref.scrollHeight;

		ref.styles.height = `${height}px`;

		const { name, value } = e.target;

		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);
		inputErrors && setDebounce(true);
	};

	// const handleFocus = () =>
	// 	user ? setShowSubmitButton(true) : handleGetAuthCode();
	const handleCloseSubmitButton = () => {
		textbox.current.styles.height = 'auto';
		setShowSubmitButton(false);
		setFormFields(defaultFields);
		setInputErrors(null);
		setDebounce(false);
	};

	useEffect(() => {
		debounce &&
			(timer.current = setTimeout(() => handleValidFields(formFields), 500));

		return () => {
			clearTimeout(timer.current);
		};
	}, [debounce, formFields]);

	useEffect(() => {
		const setTextboxHeight = () => {
			const ref = textbox.current;

			const height =
				ref.offsetHeight > ref.scrollHeight
					? ref.offsetHeight
					: ref.scrollHeight;

			ref.styles.height = `${height}px`;

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
						{user && !defaultValue && (
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
							// onFocus={handleFocus}
							value={handleUnescape(formFields.content)}
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
									{inputErrors?.content}
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
	submitBtn: PropTypes.string,
	onGetComments: PropTypes.func,
	onCreateComment: PropTypes.func,
	onCloseCommentBox: PropTypes.func,
	defaultValue: PropTypes.string,
};

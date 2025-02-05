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

const DEFAULT_FIELDS = { content: '' };

export const CommentCreate = ({ post }) => {
	const { user, onAlert, onUpdatePost } = useOutletContext();
	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState(DEFAULT_FIELDS);
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
				.max(500, ({ max }) => `Content must be less than ${max} long.`),
		}),
		[],
	);

	const handleCreateComment = async () => {
		setLoading(true);

		const result = await createComment({ postId: post._id, data: formFields });

		const handleSuccess = () => {
			onUpdatePost({
				postId: post._id,
				newPost: {
					...post,
					countComments: post.countComments + 1,
					comments: [result.data, ...post.comments],
				},
			});
			onAlert({
				message: 'A new comment has been added.',
				error: false,
				delay: 2000,
			});
			setDebounce(false);
			setShowSubmitButton(false);
			setFormFields(DEFAULT_FIELDS);
			textbox.current.style.height = 'auto';
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

		const handleValidation = async () => {
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

		!loading && (await handleValidation());
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
				error: false,
				delay: 2000,
			});
		};

		user ? setShowSubmitButton(true) : handleBlur();
	};

	const handleCloseBtns = () => {
		textbox.current.style.height = 'auto';
		setShowSubmitButton(false);
		setFormFields(DEFAULT_FIELDS);
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

	return (
		<div className={styles['comment-box']}>
			{loading && (
				<>
					<div className={styles.blur} />
					<Loading text={'Commenting...'} />
				</>
			)}
			<form className={formStyles.content} onSubmit={handleSubmit}>
				<div className={formStyles['label-wrap']}>
					<label className={`${inputErrors.content ? formStyles.error : ''}`}>
						{user && (
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
						/>
					</label>
					{!isEmpty(inputErrors) && showSubmitButton && (
						<div>
							<span className={`${imageStyles.icon} ${formStyles.alert}`} />
							<span className={formStyles.placeholder}>
								{inputErrors.content}
							</span>
						</div>
					)}
				</div>

				{showSubmitButton && (
					<div className={styles['button-wrap']}>
						<button
							type="button"
							className={`${buttonStyles.content} ${buttonStyles.cancel}`}
							onClick={handleCloseBtns}
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
				)}
			</form>
		</div>
	);
};

CommentCreate.propTypes = {
	post: PropTypes.object,
};

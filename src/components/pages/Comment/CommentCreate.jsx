// Packages
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation } from '@tanstack/react-query';

// Styles
import commentBoxStyles from './CommentBox.module.css';
import formStyles from '../../../styles/form.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Utils
import { createComment } from '../../../utils/handleComment';
import { verifySchema } from '../../../utils/verifySchema';
import { queryClient } from '../../../utils/queryOptions';

const defaultFields = { content: '' };

export const CommentCreate = () => {
	const { onAlert } = useOutletContext();
	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState(defaultFields);
	const [showSubmitButton, setShowSubmitButton] = useState(false);
	const [debounce, setDebounce] = useState(false);
	const textbox = useRef(null);
	const timer = useRef(null);

	const { postId } = useParams();
	const { data: user } = queryClient.getQueryData(['userInfo']) ?? {};

	const schema = useMemo(
		() => ({
			content: string()
				.trim()
				.required('Content is required.')
				.max(500, ({ max }) => `Content must be less than ${max} long.`),
		}),
		[],
	);

	const { isPending, mutate } = useMutation({
		mutationFn: createComment(postId),
		onError: () =>
			onAlert({
				message:
					'Add new comment has some errors occur, please try again later.',
				error: true,
				delay: 4000,
			}),
		onSuccess: response => {
			const handleRefetchComments = () => {
				queryClient.invalidateQueries({ queryKey: ['comments', postId] });
				onAlert({
					message: 'Add new comment completed.',
					error: false,
					delay: 4000,
				});
				setDebounce(false);
				setShowSubmitButton(false);
				setFormFields(defaultFields);
				textbox.current.style.height = 'auto';
			};
			response.success
				? handleRefetchComments()
				: setInputErrors({ ...response.fields });
		},
	});

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
				mutate(formFields);
			};
			validationResult.success ? handleValid() : handleInValid();
		};

		!isPending && user && (await handleValidation());
	};

	const handleChange = e => {
		const textboxRef = textbox.current;

		textboxRef.style.height = 'auto';

		const height =
			textboxRef.offsetHeight > textboxRef.scrollHeight
				? textboxRef.offsetHeight
				: textboxRef.scrollHeight;

		textboxRef.style.height = `${height}px`;

		const { name, value } = e.target;

		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);
		!isEmpty(inputErrors) && setDebounce(true);
	};

	const triggerBlur = () => {
		onAlert({
			message: 'You need to be logged in to your account to post a comment.',
			error: false,
			delay: 4000,
		});
		textbox.current.blur();
	};

	const handleClose = () => {
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

		return () => clearTimeout(timer.current);
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
					<label
						className={`${inputErrors.content ? formStyles.error : ''}`}
						data-testid="label"
					>
						{user?.username && (
							<div className={styles.profile}>
								<div className={styles.avatar}>
									{user.username.charAt(0).toUpperCase()}
								</div>
								<h4>{user.username}</h4>
							</div>
						)}
						<textarea
							name="content"
							placeholder="write a comment..."
							onChange={handleChange}
							onFocus={() => (user ? setShowSubmitButton(true) : triggerBlur())}
							value={formFields.content}
							ref={textbox}
							rows="1"
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

				{showSubmitButton && (
					<div className={styles['button-wrap']}>
						<button
							type="button"
							className={`${buttonStyles.content} ${buttonStyles.cancel}`}
							onClick={handleClose}
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

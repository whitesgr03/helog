// Packages
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation } from '@tanstack/react-query';

// Styles
import commentBoxStyles from '../Comment/CommentBox.module.css';
import formStyles from '../../../styles/form.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Utils
import { replyComment } from '../../../utils/handleReply';
import { createReply } from '../../../utils/handleReply';
import { verifySchema } from '../../../utils/verifySchema';
import { queryClient } from '../../../utils/queryOptions';

export const ReplyCreate = ({ commentId, replyId, onShowReplyBox }) => {
	const { onAlert } = useOutletContext();

	const [inputErrors, setInputErrors] = useState({});
	const [formFields, setFormFields] = useState({ content: '' });
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
		mutationFn: replyId ? createReply(replyId) : replyComment(commentId),
		onError: () =>
			onAlert({
				message: 'Add new reply has some errors occur, please try again later.',
				error: true,
				delay: 4000,
			}),
		onSuccess: response => {
			const handleRefetchComments = () => {
				queryClient.invalidateQueries({ queryKey: ['replies', commentId] });
				queryClient.setQueryData(['comments', postId], data => {
					const newPages = data.pages.map(page => ({
						...page,
						data: {
							...page.data,
							comments: page.data.comments.map(comment =>
								comment._id === commentId
									? { ...comment, child: [...comment.child, response.data._id] }
									: comment,
							),
						},
					}));
					return {
						pages: newPages,
						pageParams: data.pageParams,
					};
				});

				onAlert({
					message: 'Add new reply completed.',
					error: false,
					delay: 4000,
				});
				onShowReplyBox(false);
			};
			response.success
				? handleRefetchComments()
				: setInputErrors({ ...response.fields });
		},
	});

	const handleSubmit = async e => {
		e.preventDefault();

		const validationResult = await verifySchema({ schema, data: formFields });

		const handleInValid = () => {
			setInputErrors(validationResult.fields);
			setDebounce(false);
		};

		const handleValid = async () => {
			setInputErrors({});
			await handleCreateReply();
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
		<div
			className={`${commentBoxStyles['reply-box']} ${commentBoxStyles.container}`}
		>
			{isPending && <Loading text={'Commenting ...'} blur={true} />}
			<form className={formStyles.content} onSubmit={handleSubmit}>
				<div className={formStyles['label-wrap']}>
					<label
						className={`${inputErrors.content ? formStyles.error : ''}`}
						data-testid="label"
					>
						<div className={commentBoxStyles.profile}>
							<div className={commentBoxStyles.avatar}>
								{user.username.charAt(0).toUpperCase()}
							</div>
							<h4 className={commentBoxStyles.name}>{user.username}</h4>
						</div>
						<textarea
							className={commentBoxStyles.box}
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

				<div className={commentBoxStyles.interactive}>
					<button
						type="button"
						className={`${commentBoxStyles['interactive-button']} ${buttonStyles.content} ${buttonStyles.cancel}`}
						onClick={onShowReplyBox}
					>
						Cancel
					</button>
					<button
						type="submit"
						className={`${commentBoxStyles['interactive-button']} ${buttonStyles.content} ${buttonStyles.success}`}
					>
						Comment
					</button>
				</div>
			</form>
		</div>
	);
};

ReplyCreate.propTypes = {
	commentId: PropTypes.string,
	replyId: PropTypes.string,
	onShowReplyBox: PropTypes.func,
};

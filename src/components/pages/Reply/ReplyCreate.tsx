// Packages
import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation, useQuery } from '@tanstack/react-query';

// Styles
import commentBoxStyles from '../Comment/CommentBox.module.css';
import formStyles from '../../../styles/form.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Utils
import { createReply } from '../../../utils/handleReply';
import { verifySchema } from '../../../utils/verifySchema';
import { queryUserInfoOption } from '../../../utils/queryOptions';

// Context
import { useAppDataAPI } from '../App/AppContext';

import { CommentData } from '../Comment/Comments';

interface ReplyCreateProps {
	commentId: string;
	replyId?: string;
	onShowReplyBox: () => void;
}

interface inputErrors {
	content?: string;
}

export const ReplyCreate = ({
	commentId,
	replyId,
	onShowReplyBox,
}: ReplyCreateProps) => {
	const { onAlert } = useAppDataAPI();

	const [inputErrors, setInputErrors] = useState<inputErrors>({});
	const [formFields, setFormFields] = useState({ content: '' });
	const [debounce, setDebounce] = useState(false);
	const textbox = useRef<HTMLTextAreaElement>(null);
	const timer = useRef<NodeJS.Timeout>();

	const { postId } = useParams();

	const { data: user } = useQuery({ ...queryUserInfoOption, enabled: false });

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
		mutationFn: createReply,
		onError: () =>
			onAlert([
				{
					message:
						'Add new reply has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]),
		onSuccess: response => {
			const handleRefetchComments = () => {
				queryClient.invalidateQueries({ queryKey: ['replies', commentId] });
				queryClient.setQueryData(['comments', postId], (data: CommentData) => {
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

				onAlert([
					{
						message: 'Add new reply completed.',
						error: false,
						delay: 4000,
					},
				]);
				onShowReplyBox();
			};
			response.success
				? handleRefetchComments()
				: setInputErrors({ ...response.fields });
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const handleValidation = async () => {
			const validationResult = await verifySchema({ schema, data: formFields });
			const handleInValid = () => {
				setInputErrors(validationResult.fields);
				setDebounce(false);
			};
			const handleValid = async () => {
				setInputErrors({});
				mutate(replyId ? { replyId, formFields } : { commentId, formFields });
			};
			validationResult.success ? handleValid() : handleInValid();
		};

		!isPending && (await handleValidation());
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const setTextareaHeight = (textbox: HTMLTextAreaElement) => {
			textbox.style.height = 'auto';

			const height =
				textbox.offsetHeight > textbox.scrollHeight
					? textbox.offsetHeight
					: textbox.scrollHeight;

			textbox.style.height = `${height}px`;
		};

		textbox.current && setTextareaHeight(textbox.current);

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
								{user?.username.charAt(0).toUpperCase()}
							</div>
							<h4 className={commentBoxStyles.name}>{user?.username}</h4>
						</div>
						<textarea
							className={commentBoxStyles.box}
							name="content"
							placeholder="write a comment..."
							onChange={handleChange}
							value={formFields.content}
							ref={textbox}
							rows={1}
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

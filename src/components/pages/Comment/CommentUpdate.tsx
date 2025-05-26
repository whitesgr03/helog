// Packages
import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Styles
import commentBoxStyles from './CommentBox.module.css';
import formStyles from '../../../styles/form.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';

// Utils
import { updateComment } from '../../../utils/handleComment';
import { verifySchema } from '../../../utils/verifySchema';

// Context
import { useAppDataAPI } from '../App/AppContext';

// Type
import { Comment, CommentData } from './Comments';

interface inputErrors {
	content?: string;
}

interface CommentUpdateProps {
	commentId: Comment['_id'];
	content: Comment['content'];
	onCloseCommentBox: () => void;
}

export const CommentUpdate = ({
	commentId,
	content,
	onCloseCommentBox,
}: CommentUpdateProps) => {
	const { onAlert } = useAppDataAPI();
	const [inputErrors, setInputErrors] = useState<inputErrors>({});
	const [formFields, setFormFields] = useState({ content });
	const [debounce, setDebounce] = useState(false);
	const textbox = useRef<HTMLTextAreaElement>(null);
	const timer = useRef<NodeJS.Timeout>();

	const { postId } = useParams();

	const schema = useMemo(
		() => ({
			content: string()
				.trim()
				.required('Content is required.')
				.notOneOf(
					[content],
					'New content should be different from the old content.',
				)
				.max(500, ({ max }) => `Content must be less than ${max} long.`),
		}),
		[content],
	);
	const queryClient = useQueryClient();
	const { isPending, mutate } = useMutation({
		mutationFn: updateComment,
		onError: () =>
			onAlert([
				{
					message:
						'Edit the comment has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]),
		onSuccess: response => {
			const handleUpdateComment = () => {
				queryClient.setQueryData(
					['comments', postId],
					(oldData: CommentData) => {
						const newPages = oldData.pages.map(page => ({
							...page,
							data: {
								...page.data,
								comments: page.data.comments.map(comment =>
									comment._id === commentId ? response.data : comment,
								),
							},
						}));
						return {
							pages: newPages,
							pageParams: oldData.pageParams,
						};
					},
				);
				onAlert([
					{
						message: 'Comment has been updated.',
						error: false,
						delay: 4000,
					},
				]);
				onCloseCommentBox();
			};
			response.success
				? handleUpdateComment()
				: setInputErrors({ ...response.fields });
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const handleValidation = async () => {
			const validationResult = await verifySchema({
				schema,
				data: formFields,
			});

			const handleInValid = () => {
				setInputErrors(validationResult.fields);
				setDebounce(false);
			};

			const handleValid = async () => {
				setInputErrors({});
				mutate({ commentId, formFields });
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

		return () => clearTimeout(timer.current);
	}, [schema, debounce, formFields]);

	useEffect(() => {
		const setTextareaHeight = (textbox: HTMLTextAreaElement) => {
			const height =
				textbox.offsetHeight > textbox.scrollHeight
					? textbox.offsetHeight
					: textbox.scrollHeight;

			textbox.style.height = `${height}px`;

			const lastTextPosition = textbox.value.length;

			textbox.setSelectionRange(lastTextPosition, lastTextPosition);
		};

		textbox.current && setTextareaHeight(textbox.current);
	}, []);

	return (
		<div className={commentBoxStyles.container}>
			{isPending && <Loading text={'Saving ...'} blur={true} />}
			<form className={formStyles.content} onSubmit={handleSubmit}>
				<div className={formStyles['label-wrap']}>
					<label
						className={`${inputErrors.content ? formStyles.error : ''}`}
						data-testid="label"
					>
						<textarea
							className={commentBoxStyles.box}
							name="content"
							placeholder="edit your comment..."
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
						onClick={onCloseCommentBox}
					>
						Cancel
					</button>
					<button
						type="submit"
						className={`${commentBoxStyles['interactive-button']} ${buttonStyles.content} ${buttonStyles.success}`}
					>
						Save
					</button>
				</div>
			</form>
		</div>
	);
};

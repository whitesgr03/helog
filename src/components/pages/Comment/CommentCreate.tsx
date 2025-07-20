// Packages
import { useState, useRef, useEffect, useMemo } from 'react';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

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
import { queryUserInfoOption } from '../../../utils/queryOptions';

// Context
import { useAppDataAPI } from '../App/AppContext';

const defaultFields = { content: '' };

interface inputErrors {
	content?: string;
}

export const CommentCreate = ({ postId }: { postId: string }) => {
	const { onAlert } = useAppDataAPI();
	const [inputErrors, setInputErrors] = useState<inputErrors>({});
	const [formFields, setFormFields] = useState(defaultFields);
	const [showSubmitButton, setShowSubmitButton] = useState(false);
	const [debounce, setDebounce] = useState(false);
	const textbox = useRef<HTMLTextAreaElement>(null);
	const timer = useRef<NodeJS.Timeout>();

	const queryClient = useQueryClient();
	const { data: user } = useQuery({ ...queryUserInfoOption(), enabled: false });

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
		mutationFn: createComment,
		onError: () =>
			onAlert([
				{
					message:
						'Add new comment has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]),
		onSuccess: response => {
			const handleRefetchComments = () => {
				queryClient.invalidateQueries({ queryKey: ['comments', postId] });
				onAlert([
					{
						message: 'Add new comment completed.',
						error: false,
						delay: 4000,
					},
				]);
				setDebounce(false);
				setShowSubmitButton(false);
				setFormFields(defaultFields);
				textbox.current && (textbox.current.style.height = 'auto');
			};
			response.success
				? handleRefetchComments()
				: setInputErrors({ ...response.fields });
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validationForm = async () => {
			const validationResult = await verifySchema({ schema, data: formFields });
			const handleInValid = () => {
				setInputErrors(validationResult.fields);
				setDebounce(false);
			};
			const handleValid = async () => {
				setInputErrors({});
				mutate({ postId, formFields });
			};
			validationResult.success ? handleValid() : handleInValid();
		};

		!isPending && user && (await validationForm());
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

	const blurAfterSendAlert = () => {
		onAlert([
			{
				message: 'You need to be logged in to your account to post a comment.',
				error: false,
				delay: 4000,
			},
		]);
		textbox.current?.blur();
	};

	const closeForm = () => {
		textbox.current && (textbox.current.style.height = 'auto');
		setShowSubmitButton(false);
		setFormFields(defaultFields);
		setInputErrors({});
		setDebounce(false);
	};

	useEffect(() => {
		const handleInputDebounce = () => {
			timer.current = setTimeout(async () => {
				const validationResult = await verifySchema({
					schema,
					data: formFields,
				});
				validationResult.success
					? setInputErrors({})
					: setInputErrors(validationResult.fields);
			}, 500);
		};

		debounce && handleInputDebounce();
		return () => clearTimeout(timer.current);
	}, [schema, debounce, formFields]);

	return (
		<div className={commentBoxStyles.container}>
			{isPending && <Loading text={'Commenting ...'} blur={true} />}
			<form className={formStyles.content} onSubmit={handleSubmit}>
				<div className={formStyles['label-wrap']}>
					<label
						className={`${inputErrors?.content ? formStyles.error : ''}`}
						data-testid="label"
					>
						{user && (
							<div className={commentBoxStyles.profile}>
								<div className={commentBoxStyles.avatar}>
									{user.username.charAt(0).toUpperCase()}
								</div>
								<h4 className={commentBoxStyles.name}>{user.username}</h4>
							</div>
						)}
						<textarea
							className={commentBoxStyles.box}
							name="content"
							placeholder="write a comment..."
							onChange={handleChange}
							onFocus={() =>
								user ? setShowSubmitButton(true) : blurAfterSendAlert()
							}
							value={formFields.content}
							ref={textbox}
							rows={1}
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
					<div className={commentBoxStyles.interactive}>
						<button
							type="button"
							className={`${commentBoxStyles['interactive-button']} ${buttonStyles.content} ${buttonStyles.cancel}`}
							onClick={closeForm}
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
				)}
			</form>
		</div>
	);
};

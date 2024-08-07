// Packages
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { object, string } from "yup";

// Styles
import style from "../../styles/comment/CommentBox.module.css";
import form from "../../styles/utils/form.module.css";
import image from "../../styles/utils/image.module.css";
import button from "../../styles/utils/button.module.css";

// Components
import Loading from "../layout/Loading";

// Utils
import handleGetAuthCode from "../../utils/handleGetAuthCode";

const CommentBox = ({
	submitBtn,
	onGetComments,
	onCreateComment,
	onCloseCommentBox,
	defaultValue,
}) => {
	const defaultFields = { content: defaultValue ?? "" };

	const { user, onAlert } = useOutletContext();
	const [inputErrors, setInputErrors] = useState(null);
	const [formFields, setFormFields] = useState(defaultFields);
	const [loading, setLoading] = useState(null);
	const [showSubmitButton, setShowSubmitButton] = useState(null);
	const [debounce, setDebounce] = useState(false);
	const textbox = useRef(null);
	const timer = useRef(null);

	const handleValidFields = async fields => {
		let isValid = false;
		const schema = object({
			content: string()
				.trim()
				.required("The content is required.")
				.max(
					500,
					({ max }) => `The content must be less than ${max} long.`
				),
		}).noUnknown();

		try {
			await schema.validate(fields, {
				abortEarly: false,
			});
			setInputErrors({});
			isValid = true;
			return isValid;
		} catch (err) {
			const obj = {};

			for (const error of err.inner) {
				obj[error.path] ?? (obj[error.path] = error.message);
			}

			setInputErrors(obj);
			return isValid;
		}
	};

	const handleAddComment = async () => {
		setLoading(true);
		const result = await onCreateComment(formFields);

		const handleSetInputErrors = () => {
			const obj = {};
			for (const error of result.errors) {
				obj[error.field] = error.message;
			}
			setInputErrors(obj);
		};

		const handleSetFields = async () => {
			await onGetComments();
			setFormFields(defaultFields);
			setDebounce(false);
			onCloseCommentBox
				? onCloseCommentBox(false)
				: setShowSubmitButton(false);
		};

		result.success
			? await handleSetFields()
			: result?.errors
			? handleSetInputErrors()
			: onAlert({ message: result.message, error: true });

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

		ref.style.height = "auto";

		const height =
			ref.offsetHeight > ref.scrollHeight
				? ref.offsetHeight
				: ref.scrollHeight;

		ref.style.height = `${height}px`;

		const { name, value } = e.target;

		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);
		inputErrors && setDebounce(true);
	};

	const handleFocus = () =>
		user ? setShowSubmitButton(true) : handleGetAuthCode();
	const handleCloseSubmitButton = () => {
		textbox.current.style.height = "auto";
		setShowSubmitButton(false);
		setFormFields(defaultFields);
		setInputErrors(null);
		setDebounce(false);
	};

	const handleUnescape = str =>
		str
			.replace(/&quot;/g, '"')
			.replace(/&#x27;/g, "'")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&#x2F;/g, "/")
			.replace(/&#x5C;/g, "\\")
			.replace(/&#96;/g, "`")
			.replace(/&amp;/g, "&");

	useEffect(() => {
		debounce &&
			(timer.current = setTimeout(
				() => handleValidFields(formFields),
				500
			));

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

			ref.style.height = `${height}px`;

			const lastTextPosition = ref.value.length;
			ref.setSelectionRange(lastTextPosition, lastTextPosition);
		};

		submitBtn === "Update" && setTextboxHeight();
	}, [submitBtn]);

	return (
		<div className={`${style.commentBox} ${loading ? style.loading : ""}`}>
			{loading && (
				<div className={style.blur}>
					<Loading />
				</div>
			)}
			<form className={form.content} onSubmit={handleSubmit}>
				<div className={form.labelWrap}>
					<label
						className={`${inputErrors?.content ? form.error : ""}`}
					>
						{user && !defaultValue && (
							<div className={style.profile}>
								<div className={style.avatar}>
									{user?.name.charAt(0).toUpperCase()}
								</div>
								<h4 title={user?.name}>{user?.name}</h4>
							</div>
						)}
						<textarea
							name="content"
							placeholder="write a comment ..."
							onChange={handleChange}
							onFocus={handleFocus}
							value={handleUnescape(formFields.content)}
							ref={textbox}
							rows="1"
							autoFocus={submitBtn !== "Comment"}
						/>
					</label>
					{(defaultValue ||
						submitBtn === "Reply" ||
						showSubmitButton) &&
						inputErrors && (
							<div>
								<span
									className={`${image.icon} ${form.alert}`}
								/>
								<span className={form.placeholder}>
									{inputErrors?.content}
								</span>
							</div>
						)}
				</div>

				{(defaultValue ||
					submitBtn === "Reply" ||
					showSubmitButton) && (
					<div className={style.buttonWrap}>
						<button
							type="button"
							className={button.cancel}
							onClick={
								onCloseCommentBox ?? handleCloseSubmitButton
							}
						>
							Cancel
						</button>
						<button type="submit" className={button.success}>
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

export default CommentBox;

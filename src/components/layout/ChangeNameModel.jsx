// Packages
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { object, string } from "yup";

// Styles
import style from "../../styles/layout/ChangeNameModel.module.css";
import { settings } from "../../styles/layout/Settings.module.css";
import { blurWindow } from "../../styles/utils/bgc.module.css";
import form from "../../styles/utils/form.module.css";
import button from "../../styles/utils/button.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import { AppContext } from "../../contexts/AppContext";
import Error from "./Error";

// Utils
import { updateUser } from "../../utils/handleUser";

const ChangeNameModel = ({ handleCloseModel, defaultValue }) => {
	const defaultForm = { name: defaultValue || "" };
	const [error, setError] = useState(null);
	const [inputErrors, setInputErrors] = useState(null);
	const [formFields, setFormFields] = useState(defaultForm);
	const [debounce, setDebounce] = useState(false);
	const [loading, setLoading] = useState(false);
	const timer = useRef(null);

	const {
		setUser,
		accessToken,
		handleVerifyTokenExpire,
		handleExChangeToken,
	} = AppContext();

	const handleValidFields = async fields => {
		let isValid = false;
		const schema = object({
			name: string()
				.trim()
				.required("The name is required.")
				.max(30, ({ max }) => `The name must be less than ${max} long.`)
				.matches(
					/^[a-zA-Z0-9]\w*$/,
					"The name must be alphanumeric."
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

	const handleUpdate = async () => {
		setLoading(true);
		const isTokenExpire = await handleVerifyTokenExpire();
		const newAccessToken = isTokenExpire && (await handleExChangeToken());

		const result = await updateUser(
			newAccessToken || accessToken,
			formFields
		);

		const handleSetUser = async data => {
			setUser(data);
			handleCloseModel();
		};

		const handleSetInputErrors = () => {
			const obj = {};
			for (const error of result.errors) {
				obj[error.field] = error.message;
			}
			setInputErrors(obj);
		};

		result.success
			? handleSetUser(result.data)
			: result?.errors
			? handleSetInputErrors()
			: setError(result.message);

		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		!loading && (await handleValidFields(formFields))
			? await handleUpdate()
			: setDebounce(false);
	};

	const handleChange = e => {
		const { name, value } = e.target;
		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);
		inputErrors && setDebounce(true);
	};

	const handleClick = e => {
		e.target.dataset.closeModel && handleCloseModel();
	};

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

	return (
		<div
			className={blurWindow}
			onClick={handleClick}
			data-close-model
			data-testid={"blurBgc"}
		>
			<div className={`${settings} ${style.model}`}>
				<button
					type="button"
					className={button.closeBtn}
					data-close-model
				>
					<span className={`${image.icon} ${button.close}`} />
				</button>

				<form className={form.content} onSubmit={handleSubmit}>
					<div className={form.labelWrap}>
						<label
							htmlFor="changeName"
							className={`${inputErrors?.name ? form.error : ""}`}
						>
							Change Name
							<input
								id="changeName"
								type="text"
								name="name"
								value={formFields.name}
								onChange={handleChange}
							/>
						</label>
						<div>
							<span className={`${image.icon} ${form.alert}`} />
							<span className={form.placeholder}>
								{inputErrors?.name ?? "Message placeholder"}
							</span>
						</div>
					</div>

					<button
						type="submit"
						className={`${button.success} ${
							loading ? button.loading : ""
						}`}
					>
						<span className={button.text}>
							Save
							<span
								className={`${image.icon} ${button.loadIcon}`}
							/>
						</span>
					</button>
				</form>
				{error && (
					<div
						className={blurWindow}
						onClick={handleClick}
						data-close-model
						data-testid={"blurBgc"}
					>
						<div className={`${settings} ${style.model}`}>
							<button
								type="button"
								className={button.closeBtn}
								data-close-model
							>
								<span
									className={`${image.icon} ${button.close}`}
								/>
							</button>
							<Error message={error} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

ChangeNameModel.propTypes = {
	handleCloseModel: PropTypes.func,
	defaultValue: PropTypes.string,
};

export default ChangeNameModel;

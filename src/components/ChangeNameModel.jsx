import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { object, string } from "yup";

import style from "../styles/ChangeNameModel.module.css";
import { settings } from "../styles/Settings.module.css";
import { blur } from "../styles/utils/blur.module.css";
import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import handleFetch from "../utils/handleFetch";

import { UserContext } from "../contexts/UserContext";

const PUT_USER_URL = "http://localhost:3000/blog/users";

const defaultForm = { name: "" };

const ChangeNameModel = ({ handleCloseModel }) => {
	const [errors, setErrors] = useState(null);
	const [formFields, setFormFields] = useState(defaultForm);
	const timer = useRef(null);

	const { token, user, handleGetUser } = UserContext();

	const handleValidFields = async fields => {
		let isValid = false;
		const schema = object({
			name: string()
				.trim()
				.required("The name is required.")
				.max(30, ({ max }) => `The name must be less than ${max} long.`)
				.matches(
					/^[a-zA-Z]\w*$/,
					"The name must be alphanumeric and underscore."
				),
		}).noUnknown();

		try {
			await schema.validate(fields, {
				abortEarly: false,
			});

			setErrors({});
			isValid = true;
			return isValid;
		} catch (err) {
			const obj = {};
			for (const error of err.inner) {
				obj[error.path] ?? (obj[error.path] = error.message);
			}
			setErrors(obj);
			return isValid;
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const isValid = await handleValidFields(formFields);

		const handleUpdate = async () => {
			const fetchOption = {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formFields),
			};

			try {
				await handleFetch(`${PUT_USER_URL}/${user._id}`, fetchOption);
				await handleGetUser();
				handleCloseModel();
			} catch (err) {
				const obj = {};
				for (const error of err.cause) {
					obj[error.field] = error.message;
				}
				setErrors(obj);
			}
		};

		isValid && (await handleUpdate());
	};

	const handleChange = e => {
		const { name, value } = e.target;
		const fields = {
			...formFields,
			[name]: value,
		};
		setFormFields(fields);

		errors && timer.current && clearTimeout(timer.current);
		errors &&
			(timer.current = setTimeout(() => handleValidFields(fields), 500));
	};

	return (
		<div className={blur} onClick={handleCloseModel} data-close>
			<div className={`${settings} ${style.model}`}>
				<button type="button" className={button.closeBtn} data-close>
					<span className={`${image.icon} ${button.close}`} />
				</button>

				<form className={form.content} onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="changeName"
							className={`${errors?.name ? form.error : ""}`}
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
								{errors?.name ?? "This is a placeholder"}
							</span>
						</div>
					</div>
					<button className={button.success} type="submit">
						Save
					</button>
				</form>
			</div>
		</div>
	);
};

ChangeNameModel.propTypes = {
	handleCloseModel: PropTypes.func,
};

export default ChangeNameModel;

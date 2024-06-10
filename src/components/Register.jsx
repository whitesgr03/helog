import { useState, useRef, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { object, string, ref } from "yup";

import style from "../styles/Register.module.css";
import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import handleFetch from "../utils/handleFetch";
import Error from "./Error";

const POST_REGISTER_URL = "http://localhost:3000/blog/users";

const defaultForm = { name: "", email: "", password: "", confirmPassword: "" };

const Register = () => {
	const [formFields, setFormFields] = useState(defaultForm);
	const [error, setError] = useState(null);
	const [inputErrors, setInputErrors] = useState(null);
	const [debounce, setDebounce] = useState(false);
	const [loading, setLoading] = useState(false);
	const timer = useRef(null);

	const { setToken } = useOutletContext();
	const navigate = useNavigate();

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
			email: string()
				.trim()
				.lowercase()
				.required("The email is required.")
				.matches(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
					"The email must be in the correct format."
				),
			password: string()
				.trim()
				.required("The password is required.")
				.min(8, "The password is incorrect."),
			confirmPassword: string()
				.trim()
				.required("The confirm password is required.")
				.oneOf(
					[ref("password"), null],
					"The confirmation password does not match the password."
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

	const handleRegister = async () => {
		setLoading(true);

		const fetchOption = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formFields),
		};
		try {
			const result = await handleFetch(POST_REGISTER_URL, fetchOption);
			const handleSetToken = () => {
				localStorage.setItem("token", JSON.stringify(result.data));
				setToken(result.data.token);
				navigate("/", { replace: true });
			};
			const handleSetInputErrors = () => {
				const obj = {};
				for (const error of result.errors) {
					obj[error.field] = error.message;
				}
				setInputErrors(obj);
			};
			result.success
				? handleSetToken()
				: result?.errors
				? handleSetInputErrors()
				: setError(result.message);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();

		!loading && (await handleValidFields(formFields))
			? handleRegister()
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
		<>
			{error ? (
				<Error message={error} />
			) : (
				<div className={style.register}>
					<h3 className={style.title}>Sign Up</h3>
					<form className={form.content} onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor="name"
								className={`${
									inputErrors?.name ? form.error : ""
								}`}
							>
								Name
								<input
									id="name"
									type="text"
									name="name"
									value={formFields.name}
									onChange={handleChange}
								/>
							</label>
							<div>
								<span
									className={`${image.icon} ${form.alert}`}
								/>
								<span className={form.placeholder}>
									{inputErrors?.name ?? "Message placeholder"}
								</span>
							</div>
						</div>
						<div>
							<label
								htmlFor="email"
								className={`${
									inputErrors?.email ? form.error : ""
								}`}
							>
								Email
								<input
									id="email"
									type="email"
									name="email"
									value={formFields.email}
									onChange={handleChange}
								/>
							</label>
							<div>
								<span
									className={`${image.icon} ${form.alert}`}
								/>
								<span className={form.placeholder}>
									{inputErrors?.email ??
										"Message placeholder"}
								</span>
							</div>
						</div>
						<div>
							<label
								htmlFor="password"
								className={`${
									inputErrors?.password ? form.error : ""
								}`}
							>
								Password
								<input
									id="password"
									type="password"
									name="password"
									value={formFields.password}
									onChange={handleChange}
								/>
							</label>
							<div>
								<span
									className={`${image.icon} ${form.alert}`}
								/>
								<span className={form.placeholder}>
									{inputErrors?.password ??
										"Message placeholder"}
								</span>
							</div>
						</div>
						<div>
							<label
								htmlFor="confirmPassword"
								className={`${
									inputErrors?.confirmPassword
										? form.error
										: ""
								}`}
							>
								Confirm Password
								<input
									id="confirmPassword"
									type="password"
									name="confirmPassword"
									value={formFields.confirmPassword}
									onChange={handleChange}
								/>
							</label>
							<div>
								<span
									className={`${image.icon} ${form.alert}`}
								/>
								<span className={form.placeholder}>
									{inputErrors?.confirmPassword ??
										"Message placeholder"}
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
								Register
								<span
									className={`${image.icon} ${button.loadIcon}`}
								/>
							</span>
						</button>
					</form>
				</div>
			)}
		</>
	);
};

export default Register;

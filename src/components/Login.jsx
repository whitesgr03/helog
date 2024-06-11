import { useState, useRef, useEffect } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";

import style from "../styles/Login.module.css";
import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import Error from "./Error";
import handleFetch from "../utils/handleFetch";

const POST_LOGIN_URL = `${import.meta.env.VITE_HOST}/blog/users/login`;

const defaultForm = { email: "", password: "" };

const Login = () => {
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
	const handleLogin = async () => {
		setLoading(true);

		const fetchOption = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formFields),
		};
		try {
			const result = await handleFetch(POST_LOGIN_URL, fetchOption);
			const handleSetToken = () => {
				localStorage.setItem("token", JSON.stringify(result.data));
				setToken(result.data.token);
				navigate(-1, { replace: true });
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
			? handleLogin()
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
				<div className={style.login}>
					<h3 className={style.title}>Sign In</h3>
					<div className={style.test} />
					<div className={style.formWrap}>
						<form className={form.content} onSubmit={handleSubmit}>
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
							<button
								type="submit"
								className={`${button.success} ${
									loading ? button.loading : ""
								}`}
							>
								<span className={button.text}>
									Login
									<span
										className={`${image.icon} ${button.loadIcon}`}
									/>
								</span>
							</button>
						</form>
						<div className={style.linkWrap}>
							<p>New to HeLog?</p>
							<Link to="/users/register">Create an account</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Login;

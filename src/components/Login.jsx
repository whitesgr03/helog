import { useState, useRef } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";

import style from "../styles/Login.module.css";
import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import handleFetch from "../utils/handleFetch";

const POST_LOGIN_URL = "http://localhost:3000/blog/users/login";

const defaultForm = { email: "", password: "" };

const Login = () => {
	const [formFields, setFormFields] = useState(defaultForm);
	const [errors, setErrors] = useState(null);
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
	const handleLogin = async () => {
		const fetchOption = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formFields),
		};
		try {
			const data = await handleFetch(POST_LOGIN_URL, fetchOption);
			localStorage.setItem("token", JSON.stringify(data));
			setToken(data.token);
			navigate("/", { replace: true });
		} catch (err) {
			const obj = {};
			for (const error of err.cause) {
				obj[error.field] = error.message;
			}
			setErrors(obj);
		}
	};
	const handleSubmit = async e => {
		e.preventDefault();
		(await handleValidFields(formFields)) && handleLogin();
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
		<div className={style.login}>
			<h3 className={style.title}>Sign In</h3>
			<div className={style.formWrap}>
				<form className={form.content} onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className={`${errors?.email ? form.error : ""}`}
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
							<span className={`${image.icon} ${form.alert}`} />
							<span className={form.placeholder}>
								{errors?.email ?? "Error message placeholder"}
							</span>
						</div>
					</div>
					<div>
						<label
							htmlFor="password"
							className={`${errors?.password ? form.error : ""}`}
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
							<span className={`${image.icon} ${form.alert}`} />
							<span className={form.placeholder}>
								{errors?.password ??
									"Error message placeholder"}
							</span>
						</div>
					</div>
					<button type="submit" className={button.success}>
						Login
					</button>
				</form>
				<div className={style.linkWrap}>
					<p>New to HeLog?</p>
					<Link to="/users/register">Create an account</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;

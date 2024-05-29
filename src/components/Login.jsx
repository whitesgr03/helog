import { useState } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";

import style from "../styles/Login.module.css";
import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";

import handleFetch from "../utils/handleFetch";

const POST_LOGIN_URL = "http://localhost:3000/blog/users/login";

const Login = () => {
	const { setToken } = useOutletContext();
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const handelSubmit = async e => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const formProps = Object.fromEntries(formData);

		const fetchOption = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		};
		try {
			const data = await handleFetch(POST_LOGIN_URL, {
				...fetchOption,
				body: JSON.stringify(formProps),
			});

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

	return (
		<div className={style.login}>
			<h3 className={style.title}>Sign In</h3>
			<div className={style.formWrap}>
				<form className={form.content} onSubmit={handelSubmit}>
					<div>
						<label
							htmlFor="loginEmail"
							className={`${errors.email ? form.error : ""}`}
						>
							Email
							<input type="email" id="loginEmail" name="email" />
						</label>
						<span>
							{errors.email
								? errors.email
								: "This is a placeholder"}
						</span>
					</div>
					<div>
						<label
							htmlFor="loginPassword"
							className={`${errors.password ? form.error : ""}`}
						>
							Password
							<input
								type="password"
								id="loginPassword"
								name="password"
							/>
						</label>
						<span>
							{errors.password
								? errors.password
								: "This is a placeholder"}
						</span>
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

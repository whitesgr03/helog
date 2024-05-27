import { useContext } from "react";
import { Link } from "react-router-dom";

import style from "../styles/Login.module.css";
import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";

import { DarkThemeContext } from "../contexts/DarkThemeContext";

const Login = () => {
	const [darkTheme] = useContext(DarkThemeContext);
	const inputError = false;

	const handelSubmit = e => {
		e.preventDefault();
		const isVerify = false;
		const formData = new FormData(e.target);
		const formProps = Object.fromEntries(formData);

		console.log(formProps);

		isVerify && console.log("Post request", JSON.stringify(formProps));
		isVerify && e.target.reset();
	};

	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.login}`}>
			<h3 className={style.title}>Sign In</h3>
			<div className={style.formWrap}>
				<form
					className={`${darkTheme ? form.dark : ""} ${form.content}`}
					onSubmit={handelSubmit}
				>
					<div>
						<label
							htmlFor="loginEmail"
							className={`${inputError ? form.error : ""}`}
						>
							Email
							<input type="email" id="loginEmail" name="email" />
						</label>
						<span>This is a placeholder</span>
					</div>
					<div>
						<label
							htmlFor="loginPassword"
							className={`${inputError ? form.error : ""}`}
						>
							Password
							<input
								type="password"
								id="loginPassword"
								name="password"
							/>
						</label>
						<span>This is a placeholder</span>
					</div>
					<button
						type="submit"
						className={`${darkTheme ? button.dark : ""} ${
							button.success
						}`}
					>
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

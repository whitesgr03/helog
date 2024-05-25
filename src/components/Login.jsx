import style from "../styles/Login.module.css";

import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";

import { Link } from "react-router-dom";

const Login = () => {
	const darkTheme = false;
	const inputError = true;
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.login}`}>
			<h3 className={style.title}>Sign In</h3>
			<div className={style.formWrap}>
				<form
					className={`${darkTheme ? form.dark : ""} ${form.content}`}
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

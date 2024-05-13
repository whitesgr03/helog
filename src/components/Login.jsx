import style from "../styles/Login.module.css";

import { Link } from "react-router-dom";

const Login = () => {
	return (
		<div className={style.login}>
			<h3 className={style.title}>Login</h3>
			<div className={style.formWrap}>
				<form className={style.form}>
					<label className={style.label} htmlFor="loginEmail">
						Email
					</label>
					<input
						className={style.input}
						type="text"
						id="loginEmail"
					/>
					<label className={style.label} htmlFor="loginPassword">
						Password
					</label>
					<input
						className={style.input}
						type="text"
						id="loginPassword"
					/>
					<button className={style.submitBtn} type="submit">
						Login
					</button>
				</form>
				<div className={style.linkWrap}>
					<p>New to HeLog?</p>
					<Link className={style.link} to="/user/register">
						Create an account
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;

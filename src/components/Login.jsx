import style from "../styles/Login.module.css";
import { form } from "../styles/form.module.css";
import { successBtn } from "../styles/button.module.css";

import { Link } from "react-router-dom";

const Login = () => {
	return (
		<div className={style.login}>
			<h3 className={style.title}>Sign In</h3>
			<div className={style.formWrap}>
				<form className={form}>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" name="email" />
					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password" />
					<button type="submit" className={successBtn}>
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

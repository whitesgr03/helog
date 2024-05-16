import style from "../styles/Login.module.css";
import form from "../styles/form.module.css";

import { Link } from "react-router-dom";

const Login = () => {
	return (
		<div className={style.login}>
			<h3 className={form.title}>Sign In</h3>
			<div className={form.wrap}>
				<form className={form.container}>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" name="email" />
					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password" />
					<button type="submit">Login</button>
				</form>
				<div className={style.linkWrap}>
					<p>New to HeLog?</p>
					<Link to="/users/register" className={style.link}>
						Create an account
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;

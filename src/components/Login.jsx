import style from "../styles/Login.module.css";
import "../styles/form.css";

import { Link } from "react-router-dom";

const Login = () => {
	return (
		<div className={style.login}>
			<h3 className="title">Sign In</h3>
			<div className="formWrap">
				<form>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" name="email" />
					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password" />
					<button className="submitBtn" type="submit">
						Login
					</button>
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

import style from "../styles/Register.module.css";
import { form } from "../styles/form.module.css";
import { successBtn } from "../styles/button.module.css";

const Register = () => {
	return (
		<div className={style.register}>
			<h3 className={style.title}>Sign Up</h3>
			<form className={form}>
				<label htmlFor="email">Email</label>
				<input type="email" id="email" name="email" />
				<label htmlFor="name">Name</label>
				<input type="text" id="name" name="name" />
				<label htmlFor="password">Password</label>
				<input type="password" id="password" name="password" />
				<label htmlFor="confirmPassword">Confirm Password</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
				/>
				<button type="submit" className={successBtn}>
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;

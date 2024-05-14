import style from "../styles/Register.module.css";
import "../styles/form.css";

const Register = () => {
	return (
		<div className={style.register}>
			<h3 className="title">Sign Up</h3>
			<div className="formWrap">
				<form>
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
					<button className="submitBtn" type="submit">
						Register
					</button>
				</form>
			</div>
		</div>
	);
};

export default Register;

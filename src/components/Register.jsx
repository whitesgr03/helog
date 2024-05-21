import style from "../styles/Register.module.css";

import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";

const Register = () => {
	const darkTheme = true;
	const inputError = true;
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.register}`}>
			<h3 className={style.title}>Sign Up</h3>
			<form className={`${darkTheme ? form.dark : ""} ${form.content}`}>
				<div>
					<label
						htmlFor="registerEmail"
						className={`${inputError ? form.error : ""}`}
					>
						Email
						<input type="email" id="registerEmail" name="email" />
					</label>
					<span>This is a placeholder</span>
				</div>
				<div>
					<label
						htmlFor="registerName"
						className={`${inputError ? form.error : ""}`}
					>
						Name
						<input type="text" id="registerName" name="name" />
					</label>
					<span>This is a placeholder</span>
				</div>
				<div>
					<label
						htmlFor="registerPassword"
						className={`${inputError ? form.error : ""}`}
					>
						Password
						<input
							type="password"
							id="registerPassword"
							name="password"
						/>
					</label>
					<span>This is a placeholder</span>
				</div>
				<div>
					<label
						htmlFor="registerConfirmPassword"
						className={`${inputError ? form.error : ""}`}
					>
						Confirm Password
						<input
							type="password"
							id="registerConfirmPassword"
							name="confirmPassword"
						/>
					</label>
					<span>This is a placeholder</span>
				</div>
				<button type="submit" className={button.success}>
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;

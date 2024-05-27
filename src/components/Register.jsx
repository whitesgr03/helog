import { useContext } from "react";

import style from "../styles/Register.module.css";
import form from "../styles/utils/form.module.css";
import button from "../styles/utils/button.module.css";

import { DarkThemeContext } from "../contexts/DarkThemeContext";

const Register = () => {
	const [darkTheme] = useContext(DarkThemeContext);
	const inputError = true;

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
		<div className={`${darkTheme ? style.dark : ""} ${style.register}`}>
			<h3 className={style.title}>Sign Up</h3>
			<form
				className={`${darkTheme ? form.dark : ""} ${form.content}`}
				onSubmit={handelSubmit}
			>
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

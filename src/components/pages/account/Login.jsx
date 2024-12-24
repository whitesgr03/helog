// Packages
import { Navigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

// style
import image from "../../../styles/utils/image.module.css";
import style from "../../../styles/pages/account/login.module.css";

// Components
import { Loading } from "../../layout/Loading";

// Assets
import googleIcon from "../../../assets/google.png";
import facebookIcon from "../../../assets/facebook.png";

export const Login = () => {
	const { user } = useOutletContext();

	const [loading, setLoading] = useState(false);

	const handleSocialLogin = async provider => {
		setLoading(true);

		window.location.assign(
			`${import.meta.env.VITE_RESOURCE_URL}/account/login/${provider}`
		);

		setLoading(false);
	};

	return (
		<>
			{user ? (
				<Navigate to="/" replace={true} />
			) : (
				<div className={style.account}>
					<h3 className={style.title}>User Sign in</h3>
					<div className={style.container}>
						{loading && <Loading text={"Submitting..."} />}
						<div className={style.federation}>
							<button
								className={style["federation-button"]}
								onClick={() => handleSocialLogin("google")}
							>
								<div className={`${image} ${style.google}`}>
									<img src={googleIcon} alt="Google icon" />
								</div>
								Sign in with Google
							</button>
							<button
								className={style["federation-button"]}
								onClick={() => handleSocialLogin("facebook")}
							>
								<div className={`${image} ${style.facebook}`}>
									<img
										src={facebookIcon}
										alt="Facebook icon"
									/>
								</div>
								Sign in with Facebook
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

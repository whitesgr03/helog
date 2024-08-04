// Packages
import { useState } from "react";
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/DeleteModel.module.css";
import button from "../../styles/utils/button.module.css";
import Loading from "./Loading";

// Utils

const DeleteModel = ({ onDelete, title }) => {
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);
		await onDelete();
		setLoading(false);
	};
	return (
		<div className={style.model}>
			{loading && (
				<div className={style.loading}>
					<Loading />
				</div>
			)}
			<span className={style.title}>Delete {title}</span>
			<span className={style.content}>Do you really want to delete?</span>
			<div className={style.buttonWrap}>
				<button className={button.cancel} data-close-model>
					Cancel
				</button>
				<button className={button.error} onClick={handleDelete}>
					Delete
				</button>
			</div>
		</div>
	);
};

DeleteModel.propTypes = {
	onDelete: PropTypes.func,
	title: PropTypes.string,
};

export default DeleteModel;

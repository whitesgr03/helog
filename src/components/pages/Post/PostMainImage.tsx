// Packages
import { useState, useRef } from 'react';

// Styles
import imageStyles from '../../../styles/image.module.css';

interface IPostMainImage {
	title: string;
	url: string;
}

export const PostMainImage = ({ url, title }: IPostMainImage) => {
	const [error, setError] = useState(false);

	const imageContentRef = useRef<HTMLDivElement>(null);

	const { clientWidth = '1024', clientHeight = '768' } =
		imageContentRef.current ?? {};

	const errorImageUrl = `https://fakeimg.pl/${clientWidth}x${clientHeight}/?text=404%20Image%20Error&font=noto`;

	const handleError = () => {
		setError(true);
	};
	const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) =>
		(e.currentTarget.width <= 0 || e.currentTarget.height <= 0) &&
		handleError();
	return (
		<div className={imageStyles.content} ref={imageContentRef}>
			<img
				title={title}
				src={error ? errorImageUrl : url}
				alt={title}
				loading="lazy"
				onError={handleError}
				onLoad={handleLoad}
			/>
		</div>
	);
};

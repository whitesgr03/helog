import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
// import { format } from "date-fns";
// import { BrowserRouter } from "react-router-dom";

import PostDetail from "../components/PostDetail";

describe("PostDetail component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<PostDetail />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});

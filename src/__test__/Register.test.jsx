import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Register from "../components/Register";

describe("Register component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Register />, { wrapper: BrowserRouter });

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});

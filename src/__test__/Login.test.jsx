import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import Login from "../components/Login";

describe("Login component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Login />, { wrapper: BrowserRouter });

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});

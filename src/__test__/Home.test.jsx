import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Home from "../components/Home";

describe("Home component", () => {
	it("should be rendered Home component", () => {
		const { asFragment } = render(<Home />, { wrapper: BrowserRouter });

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});

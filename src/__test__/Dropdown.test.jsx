import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Dropdown from "../components/Header";

describe("Dropdown component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Dropdown />, { wrapper: BrowserRouter });

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});

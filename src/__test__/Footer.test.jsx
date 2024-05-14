import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import Footer from "../components/Footer";

describe("Footer component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Footer />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});

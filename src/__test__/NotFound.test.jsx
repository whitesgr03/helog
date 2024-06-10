import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import NotFound from "../components/NotFound";

describe("NotFound component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<NotFound />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});

import { vi, describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import handleFetch from "../utils/handleFetch";
import useFetch from "../hooks/useFetch";

vi.mock("../utils/handleFetch");

describe("useFetch hook", () => {
	it("should return the initial value and then the new data when the fetch result is successfully", async () => {
		const mockResult = {
			success: true,
			data: [],
		};
		handleFetch.mockReturnValueOnce(mockResult);
		const { result } = renderHook(useFetch);

		const { data, error, loading } = result.current;

		expect(data).toEqual(null);
		expect(error).toEqual(null);
		expect(loading).toEqual(true);

		await waitFor(() => {
			const { data, error, loading } = result.current;
			expect(data).toEqual(mockResult.data);
			expect(error).toEqual(null);
			expect(loading).toEqual(false);
		});
	});
	it("should return the error message when the fetch result is fails.", async () => {
		const mockResult = {
			success: false,
			message: "error",
		};

		handleFetch.mockReturnValueOnce(mockResult);

		const { result } = renderHook(useFetch);

		await waitFor(() => {
			const { data, error, loading } = result.current;
			expect(data).toEqual(null);
			expect(error).toEqual(mockResult.message);
			expect(loading).toEqual(false);
		});
	});
	it("should return the error message when the fetch is fails.", async () => {
		const mockErrorMessage = "Fetch error";

		handleFetch.mockImplementationOnce(() => {
			throw new Error(mockErrorMessage);
		});

		const { result } = renderHook(useFetch);

		await waitFor(() => {
			const { data, error, loading } = result.current;
			expect(data).toEqual(null);
			expect(error.message).toEqual(mockErrorMessage);
			expect(loading).toEqual(false);
		});
	});
});

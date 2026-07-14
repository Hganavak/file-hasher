import { fireEvent, render, screen } from "@testing-library/react";
import { FileDropzone } from "./FileDropzone";

describe("FileDropzone", () => {
  it("renders a file input and browse button", () => {
    render(<FileDropzone onFileSelect={() => {}} />);

    expect(screen.getByLabelText(/choose a file to hash/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /browse files/i }),
    ).toBeInTheDocument();
  });

  it("calls onFileSelect with the chosen file", () => {
    const onFileSelect = vi.fn();
    render(<FileDropzone onFileSelect={onFileSelect} />);

    fireEvent.change(screen.getByLabelText(/choose a file to hash/i), {
      target: { files: [new File([], "test.txt")] },
    });
    expect(onFileSelect).toHaveBeenCalledWith(new File([], "test.txt"));
  });

  it("accepts a file via drag and drop", () => {
    const onFileSelect = vi.fn();
    render(<FileDropzone onFileSelect={onFileSelect} />);

    fireEvent.dragOver(screen.getByText(/drag a file here/i));
    expect(screen.getByRole("region")).toHaveClass("bg-sun");
    fireEvent.drop(screen.getByText(/drag a file here/i), {
      dataTransfer: { files: [new File([], "test.txt")] },
    });
    expect(onFileSelect).toHaveBeenCalledWith(new File([], "test.txt"));
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIBubble } from "@/components/song/AIBubble";

describe("AIBubble", () => {
  const defaultProps = {
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    status: 'idle' as const,
    aiResponse: '',
    errorMessage: '',
    question: '',
    setQuestion: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render question input when status is idle", () => {
    render(<AIBubble {...defaultProps} />);
    
    expect(screen.getByPlaceholderText(/Что бы вы хотели узнать об этих словах/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Спросить ИИ/i })).toBeInTheDocument();
  });

  it("should call onSubmit when question is submitted", () => {
    render(<AIBubble {...defaultProps} question="Test question" />);
    
    const button = screen.getByRole("button", { name: /Спросить ИИ/i });
    fireEvent.click(button);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith("Test question");
  });

  it("should show loading state when status is loading", () => {
    render(<AIBubble {...defaultProps} status="loading" />);
    
    expect(screen.getByTestId("ai-loading-indicator")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Что бы вы хотели узнать об этих словах/i)).not.toBeInTheDocument();
  });

  it("should display AI response when status is result", () => {
    render(<AIBubble {...defaultProps} status="result" aiResponse="This is the answer." />);
    
    expect(screen.getByText("This is the answer.")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Что бы вы хотели узнать об этих словах/i)).not.toBeInTheDocument();
  });

  it("should show error message when status is error", () => {
    render(<AIBubble {...defaultProps} status="error" errorMessage="API Error" />);
    
    expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
  });

  it("should call onReset when Try Again is clicked", () => {
    render(<AIBubble {...defaultProps} status="error" errorMessage="API Error" />);
    
    const button = screen.getByRole("button", { name: /Try Again/i });
    fireEvent.click(button);
    
    expect(defaultProps.onReset).toHaveBeenCalled();
  });
});

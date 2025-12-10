import { render, screen } from "@testing-library/react";
import App from "./App";

test('renders Health App link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Health App/i);
  expect(linkElement).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders logo', () => {
  render(<App />);
  const logoElement = screen.getByAltText("logo");
  expect(logoElement).toBeInTheDocument();
});

test('renders main', () => {
  render(<App />);
  const mainTextElement = screen.getByText("Main part");
  expect(mainTextElement).toBeInTheDocument();
});

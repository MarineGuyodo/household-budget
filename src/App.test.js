import { render, screen } from '@testing-library/react';
import App from './App';

test('renders logo', () => {
  render(<App />);
  const logoElement = screen.getByAltText("logo");
  expect(logoElement).toBeInTheDocument();
});

test('renders navigation', () => {
  render(<App />);
  const navFirstSectionElement = screen.getByText("Saisie des données");
  expect(navFirstSectionElement).toBeInTheDocument();
});

test('renders footer', () => {
  render(<App />);
  const footerSecondLinkElement = screen.getByText("Contact");
  expect(footerSecondLinkElement).toBeInTheDocument();
});

test('renders account', () => {
  render(<App />);
  const firstAccountElement = screen.getByText("Compte de Marine");
  expect(firstAccountElement).toBeInTheDocument();
});

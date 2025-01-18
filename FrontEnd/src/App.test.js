import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i); // What in the world is this ?
  expect(linkElement).toBeInTheDocument();
});

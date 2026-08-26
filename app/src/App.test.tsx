import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the contact form', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /new contact/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/callsign/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rst sent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rst received/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mode/i)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /two sample recent contacts/i })).toBeInTheDocument();
    expect(screen.getByText('K1ABC')).toBeInTheDocument();
    expect(screen.getByText('DL7HAM')).toBeInTheDocument();
  });
});

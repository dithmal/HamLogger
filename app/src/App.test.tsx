import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the contact form and contacts from the server', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [
              {
                id: 'contact-1',
                call: '4S7RS',
                freq: '7.060',
                mode: 'CW',
                rstSent: '599',
                rstRcvd: '599',
                qsoDate: '2026-08-26'
              }
            ]
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );

    render(<App />);

    expect(screen.getByRole('heading', { name: /new contact/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/callsign/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rst sent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rst received/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mode/i)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /recent contacts loaded from the server/i })).toBeInTheDocument();
    expect(await screen.findByText('4S7RS')).toBeInTheDocument();
    expect(screen.getByText('7.060 MHz')).toBeInTheDocument();
  });

  it('switches to the QSL Manager screen', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [] }), { status: 200 })));
    render(<App />);

    await waitFor(() => expect(screen.getByRole('button', { name: /qsl manager/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /qsl manager/i }));

    expect(screen.getByRole('heading', { name: /qsl manager/i })).toBeInTheDocument();
  });
});

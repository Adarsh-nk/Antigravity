import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App.jsx';

describe('Client React Application Shell', () => {
  it('renders landing page brand name and call to actions', async () => {
    render(<App />);

    const brandNameElements = await screen.findAllByText('KrishiMitra');
    expect(brandNameElements.length).toBeGreaterThan(0);

    const heroHeading = screen.getByText(/Trustworthy, Safe & Custom Crop Advice for Every Farmer/i);
    expect(heroHeading).toBeInTheDocument();
  });
});

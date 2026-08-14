import React from 'react';
import { render, screen } from '@testing-library/react';
import { RoleHome } from '../HomeDashboard';

describe('RoleHome dispatcher', () => {
  it('renders the individual home for the individual role', () => {
    render(<RoleHome name="Amina Diallo" primaryRole="individual" />);
    expect(screen.getByText(/Good morning|Good afternoon|Good evening/)).toBeInTheDocument();
  });

  it('renders the entrepreneur home with a female-founder grant card', () => {
    render(<RoleHome name="Amina Diallo" primaryRole="entrepreneur" femaleFounder />);
    expect(screen.getByText('Female Innovators Seed Fund')).toBeInTheDocument();
  });

  it('omits the grant card for a standard entrepreneur', () => {
    render(<RoleHome name="Kofi Mensah" primaryRole="entrepreneur" femaleFounder={false} />);
    expect(screen.queryByText('Female Innovators Seed Fund')).not.toBeInTheDocument();
  });

  it('renders the freelancer home for the freelancer role', () => {
    render(<RoleHome name="Yann Lebrun" primaryRole="freelancer" />);
    expect(screen.getByText('Income this month')).toBeInTheDocument();
  });

  it('renders the SME home for the sme role', () => {
    render(<RoleHome name="Fatou Sow" primaryRole="sme" />);
    expect(screen.getByText('Cash position')).toBeInTheDocument();
  });
});
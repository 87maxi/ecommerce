import { render, screen } from '@testing-library/react';
import StatsCard from '../../app/components/StatsCard';

describe('StatsCard', () => {
  it('renders title, value, and description', () => {
    render(
      <StatsCard 
        title="Test Stat" 
        value={100} 
        description="This is a test description" 
      />
    );
    
    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('displays number values correctly', () => {
    render(
      <StatsCard 
        title="Number Value" 
        value={1234} 
        description="Number test" 
      />
    );
    
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('displays string values correctly', () => {
    render(
      <StatsCard 
        title="String Value" 
        value="10.5 ETH" 
        description="String test" 
      />
    );
    
    expect(screen.getByText('10.5 ETH')).toBeInTheDocument();
  });

  it('applies correct color class for primary', () => {
    render(
      <StatsCard 
        title="Primary" 
        value={100} 
        description="Primary color test" 
        color="primary" 
      />
    );
    
    const indicator = screen.getByTestId('color-indicator');
    expect(indicator).toHaveClass('bg-primary');
  });

  it('applies correct color class for success', () => {
    render(
      <StatsCard 
        title="Success" 
        value={100} 
        description="Success color test" 
        color="success" 
      />
    );
    
    const indicator = screen.getByTestId('color-indicator');
    expect(indicator).toHaveClass('bg-success');
  });

  it('applies correct color class for warning', () => {
    render(
      <StatsCard 
        title="Warning" 
        value={100} 
        description="Warning color test" 
        color="warning" 
      />
    );
    
    const indicator = screen.getByTestId('color-indicator');
    expect(indicator).toHaveClass('bg-warning');
  });

  it('applies correct color class for danger', () => {
    render(
      <StatsCard 
        title="Danger" 
        value={100} 
        description="Danger color test" 
        color="danger" 
      />
    );
    
    const indicator = screen.getByTestId('color-indicator');
    expect(indicator).toHaveClass('bg-danger');
  });
});
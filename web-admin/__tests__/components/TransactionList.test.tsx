import { render, screen } from '@testing-library/react';
import TransactionList from '../../app/components/TransactionList';

describe('TransactionList', () => {
  const transactions = [
    { id: '0x8a1...d2e4', user: 'Alice', amount: '0.5 ETH', status: 'confirmed', time: '2 min ago' },
    { id: '0x3b2...f7a1', user: 'Bob', amount: '1.2 ETH', status: 'pending', time: '15 min ago' },
    { id: '0x1c3...e8b2', user: 'Charlie', amount: '0.8 ETH', status: 'failed', time: '1 hour ago' }
  ];

  it('renders all transactions', () => {
    render(<TransactionList transactions={transactions} />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('0x8a1...d2e4')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('0.5 ETH')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText('2 min ago')).toBeInTheDocument();
  });

  it('shows correct status badge colors', () => {
    render(<TransactionList transactions={transactions} />);
    
    // Check status badge colors
    const confirmedBadge = screen.getByText('Confirmed').closest('span');
    const pendingBadge = screen.getByText('Pending').closest('span');
    const failedBadge = screen.getByText('Failed').closest('span');
    
    expect(confirmedBadge).toHaveClass('bg-success/20', 'text-success');
    expect(pendingBadge).toHaveClass('bg-warning/20', 'text-warning');
    expect(failedBadge).toHaveClass('bg-danger/20', 'text-danger');
  });

  it('renders empty state when no transactions provided', () => {
    render(<TransactionList transactions={[]} />);
    
    // Should still show table header but no rows
    expect(screen.getByText('Transaction')).toBeInTheDocument();
    expect(screen.queryByText(/0x/i)).not.toBeInTheDocument();
  });

  it('format of transaction data is preserved', () => {
    render(<TransactionList transactions={transactions} />);
    
    // Check that transaction ID is displayed as monospace
    const txIdElement = screen.getByText('0x8a1...d2e4');
    expect(txIdElement).toHaveClass('font-mono');
    
    // Check that amounts are displayed correctly
    expect(screen.getByText('0.5 ETH')).toBeInTheDocument();
    expect(screen.getByText('1.2 ETH')).toBeInTheDocument();
  });
});
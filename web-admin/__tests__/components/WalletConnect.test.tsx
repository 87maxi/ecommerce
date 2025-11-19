import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletConnect from '../../app/components/WalletConnect';

describe('WalletConnect', () => {
  const mockOnConnect = jest.fn();
  const mockOnDisconnect = jest.fn();

  beforeEach(() => {
    mockOnConnect.mockClear();
    mockOnDisconnect.mockClear();
    // Clear the mock implementations
    window.mockEthereum.request.mockClear();
    window.mockEthereum.on.mockClear();
    window.mockEthereum.removeListener.mockClear();
  });

  it('renders connect button when not connected', () => {
    render(<WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} />);
    
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('renders wallet info when connected', async () => {
    // Mock connected state
    const mockAddress = '0x1234567890123456789012345678901234567890';
    
    // Use the shared mock from setup
    window.mockEthereum.request.mockImplementation((args: { method: string }) => {
      if (args.method === 'eth_accounts') {
        return [mockAddress];
      }
      if (args.method === 'eth_chainId') {
        return '0x7a69'; // 31337 in hex
      }
      return [];
    });
    
    // Wait for useEffect to complete
    render(<WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} />);
    
    await waitFor(() => {
      expect(mockOnConnect).toHaveBeenCalledWith(mockAddress);
    });
    
    expect(screen.getByText(/0x1234/i)).toBeInTheDocument();
    expect(screen.getByText(/chain: 31337/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
  });

  it('calls onConnect when wallet connects', async () => {
    const user = userEvent.setup();
    
    // Mock connection response
    const mockAddress = '0x1234567890123456789012345678901234567890';
    
    // Use the shared mock from setup
    window.mockEthereum.request.mockImplementation((args: { method: string }) => {
      if (args.method === 'eth_requestAccounts') {
        return [mockAddress];
      }
      if (args.method === 'eth_chainId') {
        return '0x7a69';
      }
      return [];
    });

    render(<WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} />);
    
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    await user.click(connectButton);
    
    await waitFor(() => {
      expect(mockOnConnect).toHaveBeenCalledWith(mockAddress);
    });
  });

  it('calls onDisconnect when disconnect button is clicked', async () => {
    const user = userEvent.setup();
    
    // Set up already connected state
    const mockAddress = '0x1234567890123456789012345678901234567890';
    
    // Use the shared mock from setup
    window.mockEthereum.request.mockImplementation((args: { method: string }) => {
      if (args.method === 'eth_accounts') {
        return [mockAddress];
      }
      if (args.method === 'eth_chainId') {
        return '0x7a69';
      }
      return [];
    });

    render(<WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} />);
    
    await waitFor(() => {
      expect(mockOnConnect).toHaveBeenCalledWith(mockAddress);
    });
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    await user.click(disconnectButton);
    
    expect(mockOnDisconnect).toHaveBeenCalled();
  });

  it('shows error when connect is clicked without MetaMask', async () => {
    const user = userEvent.setup();
    
    // Mock no MetaMask
    Object.defineProperty(window, 'ethereum', {
      value: undefined,
      writable: true,
    });

    render(<WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} />);
    
    // Click connect button
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    await user.click(connectButton);
    
    // Error should be shown after trying to connect
    await waitFor(() => {
      expect(screen.getByText(/metamask is not installed/i)).toBeInTheDocument();
    });
  });

  it('handles connection errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock error during connection
    window.mockEthereum.request = jest
      .fn()
      .mockRejectedValue(new Error('User rejected request'));

    render(<WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} />);
    
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    await user.click(connectButton);
    
    await waitFor(() => {
      expect(screen.getByText(/user rejected request/i)).toBeInTheDocument();
    }, { timeout: 10000 });
    
    expect(mockOnConnect).not.toHaveBeenCalled();
  });
});
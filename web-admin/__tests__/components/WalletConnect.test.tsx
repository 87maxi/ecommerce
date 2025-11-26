import { render, screen, fireEvent } from '@testing-library/react';
import WalletConnect from '../components/WalletConnect';

// Mock the useWallet hook
jest.mock('../hooks/useWallet', () => ({
  useWallet: () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    isConnected: false,
    address: null,
    chainId: null,
    connecting: false,
    error: null,
  }),
}));

describe('WalletConnect', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });
  it('renders connect button when not connected', () => {
    render(<WalletConnect />);
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('calls connect function when button is clicked', () => {
    const mockConnect = jest.fn();
    const mockDisconnect = jest.fn();

    jest.spyOn(require('../hooks/useWallet'), 'useWallet').mockReturnValue({
      connect: mockConnect,
      disconnect: mockDisconnect,
      isConnected: false,
      address: null,
      chainId: null,
      connecting: false,
      error: null,
    });

    render(<WalletConnect />);
    fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
    expect(mockConnect).toHaveBeenCalled();
  });
  it('renders wallet info when connected', () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    
    jest.spyOn(require('../hooks/useWallet'), 'useWallet').mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
      isConnected: true,
      address: mockAddress,
      chainId: '0x7a69',
      connecting: false,
      error: null,
    });
    
    render(<WalletConnect />);
    expect(screen.getByText(/0x1234/i)).toBeInTheDocument();
    expect(screen.getByText(/chain: 31337/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
  });

  it('calls disconnect when disconnect button is clicked', () => {
    const mockDisconnect = jest.fn();
    const mockAddress = '0x1234567890123456789012345678901234567890';
    
    jest.spyOn(require('../hooks/useWallet'), 'useWallet').mockReturnValue({
      connect: jest.fn(),
      disconnect: mockDisconnect,
      isConnected: true,
      address: mockAddress,
      chainId: '0x7a69',
      connecting: false,
      error: null,
    });

    render(<WalletConnect />);

    fireEvent.click(screen.getByRole('button', { name: /disconnect/i }));
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('shows connecting state', () => {
    jest.spyOn(require('../hooks/useWallet'), 'useWallet').mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
      isConnected: false,
      address: null,
      chainId: null,
      connecting: true,
      error: null,
    });

    render(<WalletConnect />);
    expect(screen.getByText(/connecting/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    const errorMessage = 'Connection failed';

    jest.spyOn(require('../hooks/useWallet'), 'useWallet').mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
      isConnected: false,
      address: null,
      chainId: null,
      connecting: false,
      error: errorMessage,
    });

    render(<WalletConnect />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});

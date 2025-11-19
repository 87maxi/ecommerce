import '@testing-library/jest-dom';

// Mock ResizeObserver
const ResizeObserverMock = function () {
  this.observe = jest.fn();
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
};

window.ResizeObserver = ResizeObserverMock;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Set up the mock ethereum object
const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

Object.defineProperty(window, 'ethereum', {
  value: mockEthereum,
  writable: true,
});

// Make mock available globally
(window as any).mockEthereum = mockEthereum;
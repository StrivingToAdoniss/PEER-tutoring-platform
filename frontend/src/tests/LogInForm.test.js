// LogInForm.test.js
jest.mock('axios', () => ({
    post: jest.fn(),
    get: jest.fn(),
  }));
  
  import React from 'react';
  import { render, fireEvent, screen, waitFor } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import LogInForm from '../components/LogInForm';
  import { MemoryRouter } from 'react-router-dom';
  import axios from 'axios';
  
  // Inject the necessary DOM structure before each test so that
  // .corner-image, .login-container, and .login-content exist.
describe('LogInForm Component', () => {
  // Remove beforeEach DOM manipulation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderComponent() {
    return render(
      <MemoryRouter>
        <LogInForm />
      </MemoryRouter>
    );
  }

  it('renders the form with email and password fields', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('submits form with provided email and password and handles success', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { tokens: { access: 'fakeAccess', refresh: 'fakeRefresh' } },
    });

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password@1' } });

    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BASE_URL}/accounts/login`,
        { email: 'user@example.com', password: 'Password@1' }
      );
    });

  });

  it('shows error message on invalid credentials (400)', async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 400 },
    });

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });

    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows error message if account not approved (403)', async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 403 },
    });

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'pending@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password@1' } });

    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Your account is not approved by the admin yet.')).toBeInTheDocument();
    });
  });

  it('shows generic error message on unexpected error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password@1' } });

    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Unable to connect to the server. Please check your connection.')).toBeInTheDocument();
    });
  });
});
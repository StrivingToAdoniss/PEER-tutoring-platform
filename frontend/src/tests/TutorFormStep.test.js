import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TutorFormStep from '../components/TutorFormStep';

// Mock the Button component to avoid external complexity and just render a simple button
jest.mock('../components/Button', () => ({ text, onClick, className, disabled }) => (
  <button onClick={onClick} className={className} disabled={disabled}>
    {text}
  </button>
));

// A small wrapper component to mimic parent state updates:
// Since TutorFormStep receives initialFormData and onChange, we simulate a controlled parent by updating state.
function Wrapper({ initialData, onBack, onNext }) {
  const [formData, setFormData] = React.useState(initialData);

  return (
    <TutorFormStep
      initialFormData={formData}
      onBack={onBack}
      onNext={onNext}
      onChange={(changedFields) => setFormData({ ...formData, ...changedFields })}
    />
  );
}

describe('TutorFormStep Component', () => {
  const mockOnBack = jest.fn();
  const mockOnNext = jest.fn();
  let initialFormData;

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnNext.mockClear();

    initialFormData = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
    };
  });

  it('renders the form with all inputs and buttons', () => {
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('calls onChange when input values change', () => {
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John', name: 'first_name' } });

    // The updated value means onChange works and state updates
    expect(firstNameInput).toHaveValue('John');
  });

  it('shows gray-button when form is incomplete (simulating "disabled")', () => {
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);

    // Form is incomplete, so next button should have the gray-button class
    expect(screen.getByText('Next')).toHaveClass('gray-button');

    // Fill one field
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John', name: 'first_name' } });
    // Still incomplete, next should still have gray-button class
    expect(screen.getByText('Next')).toHaveClass('gray-button');
  });

  it('shows validation errors and does not call onNext if password and username do not meet criteria', async () => {
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);

    // Fill all fields with invalid username and password
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John', name: 'first_name' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe', name: 'last_name' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'abc', name: 'username' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass', name: 'password' } });

    // All required fields are filled, so the button should now have blue-button class
    expect(screen.getByText('Next')).toHaveClass('blue-button');

    // Click next
    fireEvent.click(screen.getByText('Next'));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 4 characters long, contain at least one uppercase letter and one special character.')).toBeInTheDocument();
      expect(screen.getByText('Username must be at least 4 characters long.')).toBeInTheDocument();
    });

    // onNext should not have been called
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('calls onNext when the form is valid and submitted', async () => {
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);

    // Fill fields with valid data
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John', name: 'first_name' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe', name: 'last_name' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'john123', name: 'username' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password@1', name: 'password' } });

    // Now all required fields are filled with valid data, button should have blue-button class
    expect(screen.getByText('Next')).toHaveClass('blue-button');

    // Submit form
    fireEvent.click(screen.getByText('Next'));

    // onNext should be called since validation passes
    await waitFor(() => expect(mockOnNext).toHaveBeenCalled());
  });

  it('calls onBack when the Back button is clicked', () => {
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);

    fireEvent.click(screen.getByText('Back'));
    expect(mockOnBack).toHaveBeenCalled();
  });
});

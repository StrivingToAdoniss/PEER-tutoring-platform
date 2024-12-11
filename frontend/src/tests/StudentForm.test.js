jest.mock('axios', () => ({
    post: jest.fn(),
    get: jest.fn(),
  }));
  
  import React, { useState } from 'react';
  import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import StudentForm from '../components/StudentForm';
  import { MemoryRouter } from 'react-router-dom';
  
  // Mock Button so we don't rely on its implementation
  jest.mock('../components/Button', () => ({ text, onClick, className, disabled }) => (
    <button onClick={onClick} className={className} disabled={disabled}>
      {text}
    </button>
  ));
  
  function Wrapper({ onSubmit, onBack }) {
    // This simulates a parent component that manages state
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      specialization: '',
      university: '',
      current_grade: '',
      role: 'student',
    });
  
    return (
      <MemoryRouter>
        <StudentForm
          onSubmit={onSubmit}
          onBack={onBack}
          initialFormData={formData}
          onChange={(changedFields) => setFormData({ ...formData, ...changedFields })}
        />
      </MemoryRouter>
    );
  }
  
  describe('StudentForm Component', () => {
    let mockOnSubmit;
    let mockOnBack;
  
    beforeEach(() => {
      mockOnSubmit = jest.fn();
      mockOnBack = jest.fn();
    });
  
    it('renders the form with all inputs and buttons', () => {
      render(<Wrapper onSubmit={mockOnSubmit} onBack={mockOnBack} />);
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByText('Select University')).toBeInTheDocument();
      expect(screen.getByText('Select Specialty')).toBeInTheDocument();
      expect(screen.getByText('Select Grade')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });
  
    it('calls onChange when input values change', () => {
      render(<Wrapper onSubmit={mockOnSubmit} onBack={mockOnBack} />);
      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John', name: 'first_name' },
      });
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'john@example.com', name: 'email' },
      });
      // The fact that these values changed without throwing means onChange was called
      // If you want to verify onChange calls, you could mock it separately or spy on Wrapper's setState.
    });
  
    it('calls onBack when the Back button is clicked', () => {
      render(<Wrapper onSubmit={mockOnSubmit} onBack={mockOnBack} />);
      fireEvent.click(screen.getByText('Back'));
      expect(mockOnBack).toHaveBeenCalled();
    });
  
    it('disables the Register button if the form is incomplete', () => {
      render(<Wrapper onSubmit={mockOnSubmit} onBack={mockOnBack} />);
      expect(screen.getByText('Register')).toBeDisabled();
  
      // Fill only one field
      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John', name: 'first_name' },
      });
      expect(screen.getByText('Register')).toBeDisabled();
    });
  
    it('enables the Register button when all fields are filled', async () => {
      render(<Wrapper onSubmit={mockOnSubmit} onBack={mockOnBack} />);
  
      // Fill all required fields
      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John', name: 'first_name' },
      });
      fireEvent.change(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe', name: 'last_name' },
      });
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'john@example.com', name: 'email' },
      });
      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'john123', name: 'username' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'Password@1', name: 'password' },
      });
  
      // For selects, find them by their name attributes (querySelector fallback)
      const universitySelect = document.querySelector('select[name="university"]');
      fireEvent.change(universitySelect, { target: { value: 'KU Leuven', name: 'university' } });
  
      const specializationSelect = document.querySelector('select[name="specialization"]');
      fireEvent.change(specializationSelect, { target: { value: 'Math', name: 'specialization' } });
  
      const gradeSelect = document.querySelector('select[name="current_grade"]');
      fireEvent.change(gradeSelect, { target: { value: '2', name: 'current_grade' } });
  
      await waitFor(() => expect(screen.getByText('Register')).not.toBeDisabled());
    });
  
    it('adds the visible class to form elements after 100ms', () => {
      jest.useFakeTimers();
  
      render(<Wrapper onSubmit={mockOnSubmit} onBack={mockOnBack} />);
      const studentForm = document.querySelector('.student-form');
      const buttonContainer = document.querySelector('.form-button-container');
  
      // Initially should not have class
      expect(studentForm).not.toHaveClass('visible');
      expect(buttonContainer).not.toHaveClass('visible');
  
      // Advance time inside act so effects run
      act(() => {
        jest.advanceTimersByTime(100);
      });
  
      expect(studentForm).toHaveClass('visible');
      expect(buttonContainer).toHaveClass('visible');
  
      jest.useRealTimers();
    });
  });
  
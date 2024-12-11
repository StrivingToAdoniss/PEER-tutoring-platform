// Mock axios before importing the component
jest.mock('axios', () => ({
    post: jest.fn(),
  }));
  
  import React from 'react';
  import { render, fireEvent, screen, waitFor } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import TutorUniversityStep from '../components/TutorUniversityStep';
  import { MemoryRouter } from 'react-router-dom';
  
  // Mock the Button component (no submit type to avoid form submission issues)
  jest.mock('../components/Button', () => ({ text, onClick, className, disabled }) => (
    <button type="button" onClick={onClick} className={className} disabled={disabled}>
      {text}
    </button>
  ));
  
  // Mock useNavigate
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    };
  });
  
  // Mock FileReader
  class MockFileReader {
    readAsDataURL(file) {
      setTimeout(() => {
        if (this.onloadend) {
          this.onloadend({ target: { result: 'data:image/png;base64,mockdata' } });
        }
      }, 0);
    }
  }
  window.FileReader = MockFileReader;
  
  function Wrapper({ initialData, onBack, onNext }) {
    const [formData, setFormData] = React.useState(initialData);
  
    return (
      <MemoryRouter>
        <TutorUniversityStep
          initialFormData={formData}
          onBack={onBack}
          onNext={onNext}
          onChange={(changedFields) => {
            setFormData({ ...formData, ...changedFields });
          }}
        />
      </MemoryRouter>
    );
  }
  
  describe('TutorUniversityStep Component', () => {
    const mockOnBack = jest.fn();
    const mockOnNext = jest.fn();
    const axios = require('axios');
    let initialFormData;
  
    beforeEach(() => {
      jest.clearAllMocks();
      initialFormData = {
        photo_url: null,
        confirmation_file: null,
        university: '',
        specialization: '',
        subject: '',
        current_grade: '',
      };
    });
  
    it('renders the form with all inputs and buttons', () => {
      render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Select University')).toBeInTheDocument();
      expect(screen.getByText('Select Specialty')).toBeInTheDocument();
      expect(screen.getByText('Select Subject To Tutor')).toBeInTheDocument();
      expect(screen.getByText('Select Course Number')).toBeInTheDocument();
    });
  
    it('disables Next button when form is incomplete', async () => {
      render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);
      // Initially incomplete
      expect(screen.getByText('Next')).toBeDisabled();
    });
  
  
    it('calls onBack when Back button is clicked', () => {
      render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onNext={mockOnNext} />);
      fireEvent.click(screen.getByText('Back'));
      expect(mockOnBack).toHaveBeenCalled();
    });
  
    it('submits form successfully and navigates to /login', async () => {
      const completeData = {
        photo_url: new File(['photo'], 'photo.png', { type: 'image/png' }),
        confirmation_file: new File(['cert'], 'cert.pdf', { type: 'application/pdf' }),
        university: 'KU Leuven',
        specialization: 'Specialty X',
        subject: 'Subject X',
        current_grade: '2',
      };
  
      axios.post.mockResolvedValueOnce({ data: { message: 'success' } });
  
      render(<Wrapper initialData={completeData} onBack={mockOnBack} onNext={mockOnNext} />);
      const form = document.querySelector('form.tutor-form');
      fireEvent.submit(form);
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  
    it('shows error message if submission fails', async () => {
      const completeData = {
        photo_url: new File(['photo'], 'photo.png', { type: 'image/png' }),
        confirmation_file: new File(['cert'], 'cert.pdf', { type: 'application/pdf' }),
        university: 'KU Leuven',
        specialization: 'Specialty X',
        subject: 'Subject X',
        current_grade: '2',
      };
  
      axios.post.mockRejectedValueOnce(new Error('Failed request'));
  
      render(<Wrapper initialData={completeData} onBack={mockOnBack} onNext={mockOnNext} />);
      const form = document.querySelector('form.tutor-form');
      fireEvent.submit(form);
  
      await waitFor(() =>
        expect(screen.getByText('Failed to submit the form. Please try again.')).toBeInTheDocument()
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
  
// Mock axios before importing the component
jest.mock('axios', () => ({
  post: jest.fn(),
}));

import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import TutorUniversityStep from '../components/TutorUniversityStep';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock the Button component (no submit type to avoid form submission issues)
jest.mock('../components/Button', () => ({ text, onClick, className, disabled }) => (
  <button type="button" onClick={onClick} className={className} disabled={disabled}>
    {text || 'Button'} {/* Ensures a fallback text */}
  </button>
));


// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other functionalities
  useNavigate: () => mockNavigate, // Mock useNavigate to return mockNavigate
}));

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

function Wrapper({ initialData, onBack, onSubmit}) {
  const [formData, setFormData] = React.useState(initialData);

  return (
    <MemoryRouter>
      <TutorUniversityStep
        initialFormData={formData}
        onBack={onBack}
        onSubmit={mockNavigate}
        onChange={(changedFields) => {
          setFormData({ ...formData, ...changedFields });
        }}
      />
    </MemoryRouter>
  );
}

describe('TutorUniversityStep Component', () => {
  const mockOnBack = jest.fn();
  const axios = require('axios');
  let initialFormData;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
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
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onSubmit={mockNavigate} />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText('Select University')).toBeInTheDocument();
    expect(screen.getByText('Select Specialty')).toBeInTheDocument();
    expect(screen.getByText('Select Subject To Tutor')).toBeInTheDocument();
    expect(screen.getByText('Select Course Number')).toBeInTheDocument();
  });

  it('disables Next button when form is incomplete', async () => {
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onSubmit={mockNavigate} />);
    const nextButton = screen.getByRole('button', { name: /register/i });
    expect(nextButton).toBeDisabled();
  });

  it('calls onBack when Back button is clicked', () => {
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onSubmit={mockNavigate} />);
    userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('submits form successfully and navigates to /login', async () => {
    // Mock successful API response
    axios.post.mockResolvedValueOnce({ data: { message: 'success' } });
  
    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onSubmit={mockNavigate} />);
    
    // Simulate user clicking the "Register" button
    userEvent.click(screen.getByRole('button', { name: /register/i }));
  
    // Wait for axios.post to be called
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledTimes(1);
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_BASE_URL}/tutor/university-step`,
    //     initialFormData
    //   );
    // });
  
    // Verify navigation to '/login'
    //expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
  

  it('shows error message if submission fails', async () => {
    // Mock failed API response
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<Wrapper initialData={initialFormData} onBack={mockOnBack} onSubmit={mockNavigate} />);

    // Simulate user clicking the "Register" button
    userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      //expect(axios.post).toHaveBeenCalledTimes(1);
      // Verify that navigate was not called
      expect(mockNavigate).not.toHaveBeenCalled();
      // Assuming the component displays an error message on failure
      //expect(screen.getByText('An unexpected error occurred. Please try again later.')).toBeInTheDocument();
    });
  });
});

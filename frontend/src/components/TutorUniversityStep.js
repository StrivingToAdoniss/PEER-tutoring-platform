import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';
import '../styles/TutorUniversityStep.css';
import backgroundImage from '../assets/SignUp/tutor_step_3_background.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;


const TutorUniversityStep = ({ initialFormData, onBack, onSubmit, onChange }) => {
  const navigate = useNavigate();
  const profilePhotoInputRef = useRef(null);
  const certificationInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [certificationName, setCertificationName] = useState(null);
  const [confirmationFile, setConfirmationFile] = useState(null); 
  const [error, setError] = useState('');

  // Mock data for dropdowns
  const universities = [
    "KU Leuven",
    "Ghent University",
    "Wageningen University and Research",
    "Aarhus University",
    "Uppsala University",
    "UCLouvain",
    "Institute for European Studies - Université libre de Bruxelles",
    "University of Antwerp",
    "MIP Politecnico Di Milano",
    "Vrije Universiteit Brussel (VUB)",
    "University of Liège",
    "University of Kent",
    "Politecnico di Torino",
    "Hasselt University",
    "University of Luxembourg",
    "Université de Mons",
    "University of Salzburg",
    "University of Namur",
    "Institute of Tropical Medicine Antwerp (ITM)",
    "GEM Stones",
    "Haute Ecole Charlemagne",
    "Brussels School of Governance",
    "VIVES University of Applied Sciences",
    "Evangelische Theologische Faculteit (ETF)",
    "LUCA School of Arts - Campus Sint-Lucas Brussels",
    "IAD - Institut des Arts de Diffusion",
    "Catholic University College of Bruges-Ostend",
    "ESRA International Film School",
    "Lerian-Nti",
    "EU-Japan Centre for Industrial Cooperation",
    "Flemish Interuniversity Council - University Development Cooperation (VLIR-UOS)",
    "FWO: Fonds Wetenschappelijk Onderzoek - Vlaanderen",
    "GLOBIS University",
    "Université UCLouvain Saint-Louis Bruxelles",
    "The United Nations University Institute on Comparative Regional Integration Studies (UNU-CRIS)",
    "Thomas More",
    "UC Leuven-Limburg",
    "The Haute École de Namur-Liège-Luxembourg",
    "The International School of Protocol & Diplomacy ISPD",
    "Artevelde University of Applied Sciences",
    "Howest University of Applied Sciences",
    "Haute Ecole Libre Mosane",
    "United International Business Schools",
    "Odisee University",
    "Utrecht Summer School",
    "Entrepreneurship School",
    "EIT Food",
    "ECS European Communication School Brussels",
    "ICHEC Brussels Management School",
    "EUREC - The Association of European Renewable Energy Research Centres",
    "College of Europe",
    "EIT Urban Mobility Master School",
    "UBI Business School",
    "Antwerp Management School",
    "Vlerick Business School",
    "IHECS FORMATIONS - Journalism & Communication",
    "Solvay Brussels School of Economics and Management",
    "EIT RawMaterials Academy",
    "InnoEnergy MastersPlus",
    "Centre international de formation européenne - CIFE",
    "Swiss School Of Business and Management",
    "KdG University of Applied Sciences and Arts",
    "Global Institute of Sport",
    "HEH - Haute Ecole de la Communauté française en Hainaut",
    "Wallonie-Bruxelles International (WBI)",
    "European Desk - Belgian-Italian Chamber of Commerce",
    "EIT Digital Professional School",
    "iSE The Institute of Sustainable Energy by InnoEnergy",
    "Royal Military Academy",
    "Haute Ecole de Namur",
    "Artesis Plantijn University of Applied Sciences and Arts Antwerp",
    "Belgium Directorate-General for Development Cooperation",
    "Alliance française de Bruxelles-Europe",
    "European Public Health Master",
    "The European Heart Academy",
    "Cours Florent School",
    "Erasmus Brussels University of Applied Sciences and Arts",
    "IPE Management School Paris",
    "Haute École Albert Jacquard"
  ];
  const specialties = ["Specialty X", "Specialty Y", "Specialty Z"];
  const subjects = ["Subject X", "Subject Y", "Subject Z"];
  const courseNumbers = ["1", "2", "3", "4"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value }); // Propagate changes to parent
  };

  useEffect(() => {
    if (initialFormData.photo_url) {
      if (initialFormData.photo_url instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(initialFormData.photo_url);
      } else if (typeof initialFormData.photo_url === 'string') {
        setPhotoPreview(initialFormData.photo_url);
      }
    } else {
      setPhotoPreview(null); // Reset if undefined
    }
  
    if (initialFormData.confirmation_file && initialFormData.confirmation_file !== confirmationFile) {
      const name =
        initialFormData.confirmation_file.name ||
        (typeof initialFormData.confirmation_file === 'string'
          ? initialFormData.confirmation_file
          : null);
      setCertificationName(name);
    }
  }, [initialFormData, confirmationFile]);
  
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { name } = e.target;

    //console.log(`File selected for ${name}:`, file);
  
    if (name === 'photo_url') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        onChange({ [name]: file });
      };
      reader.readAsDataURL(file);
    } else if (name === 'confirmation_file') {
      setCertificationName(file.name);
      //console.log(`Confirmation file name: ${file.name}`);
      onChange({ [name]: file });
    }
  };
  

  const handleSubmit = async () => {
    
    // Prepare FormData for file uploads
    const FinalformData = new FormData();
    FinalformData.append('first_name', initialFormData.first_name);
    FinalformData.append('last_name', initialFormData.last_name);
    FinalformData.append('email', initialFormData.email);
    FinalformData.append('username', initialFormData.username);
    FinalformData.append('password', initialFormData.password);
    FinalformData.append('role', initialFormData.role);
    FinalformData.append('current_grade', initialFormData.current_grade);
    FinalformData.append('university', initialFormData.university);
    FinalformData.append('specialization', initialFormData.specialization);
    FinalformData.append('subject', initialFormData.subject);

    // Append files
    if (initialFormData.photo_url instanceof File) {
      FinalformData.append('photo_url', initialFormData.photo_url);
    } else {
      //console.error('photo_url is not a File object:', initialFormData.photo_url);
    }
    
    if (initialFormData.confirmation_file instanceof File) {
      FinalformData.append('confirmation_file', initialFormData.confirmation_file);
    } else {
      //console.error('confirmation_file is not a File object:', initialFormData.confirmation_file);
    }
    

    // console.log('FormData being sent:');
    // for (let [key, value] of FinalformData.entries()) {
    //   if (value instanceof File) {
    //     console.log(`${key}: File {name: ${value.name}, size: ${value.size}}`);
    //   } else {
    //     console.log(`${key}:`, value);
    //   }
    // }
    

    try {
      const response = await axios.post(`${baseURL}/accounts/registration`, FinalformData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      //console.log('Registration successful:', response.data);
      if(response.status === 201){
        //console.log('Registration successful:', response.data);
        navigate('/login');
        onSubmit(initialFormData);
  
      }
      else{
        //console.log('We got error: ', response.status);
      }

    } catch (error) {
      //console.error('Error submitting form:', error.response?.data || error.message);
      setError('Failed to submit the form. Please try again.');
    }
  };
  

  const isFormComplete =
  initialFormData.photo_url &&
  initialFormData.confirmation_file &&
  initialFormData.university.trim() !== '' &&
  initialFormData.specialization.trim() !== '' &&
  initialFormData.current_grade.trim() !== '';

  return (
    <div className="tutor-form-step">
      <div className="tutor-image">
        <img src={backgroundImage} alt="Tutor illustration" />
      </div>
      <form onSubmit={handleSubmit} className="tutor-form">
        
      <div className="outer-container">
        {/* Adjusted Width Container for Fields */}
        <div className="adjusted-width-container">
          
          {/* Section 1: Profile Photo Upload */}
          <div className="form-section">
            <span className="side-text">Upload profile photo:</span>
            <div className="filterItem">
              <div className="upload-container">
                <Button
                  className={`plus-button ${photoPreview ? 'square-button' : ''}`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    profilePhotoInputRef.current.click();
                  }}
                />
                <input
                  type="file"
                  name="photo_url"
                  accept="image/*"
                  ref={profilePhotoInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="photo-preview"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Institute */}
          <div className="form-section">
            <span className="side-text">Institute:</span>
            <div className="filterItem">
              <select
                name="university"
                value={initialFormData.university}
                onChange={handleChange}
                required
              >
                <option value=""disabled hidden>Select University</option>
                {universities.map((university, index) => (
                  <option key={index} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Specialty */}
          <div className="form-section">
            <span className="side-text">Specialty:</span>
            <div className="filterItem">
              <select
                name="specialization"
                value={initialFormData.specialization}
                onChange={handleChange}
                required
              >
                <option value=""disabled hidden>Select Specialty</option>
                {specialties.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>

            {/* Section 4: Subject */}
                    <div className="form-section">
            <span className="side-text">Subject:</span>
            <div className="filterItem">
              <select
                name="subject"
                value={initialFormData.subject}
                onChange={handleChange}
                required
              >
                <option value=""disabled hidden>Select Subject To Tutor</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 5: Course Number */}
          <div className="form-section">
            <span className="side-text">Course Number:</span>
            <div className="filterItem">
              <select
                name="current_grade"
                value={initialFormData.current_grade}
                onChange={handleChange}
                required
              >
                <option value=""disabled hidden>Select Course Number</option>
                {courseNumbers.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          {/* Section 5: Certificate Upload */}
          <div className="form-section">
            <span className="side-text">Upload certified document from the university:</span>
            <div className="filterItem">
              <div className="upload-container">
                <Button
                  className="plus-button"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    certificationInputRef.current.click();
                  }}
                />
                <input
                  type="file"
                  name="confirmation_file"
                  accept="image/*,.pdf,.doc,.docx"
                  ref={certificationInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              {certificationName && typeof certificationName === 'string' && (
                <span className="file-name">{certificationName}</span>
              )}
            </div>
          </div>

        </div>
        </div>

        {/* Back and Next Buttons */}
        <div className="form-button-container">
          <Button text="Back" className="outline-button" onClick={onBack} />
          <Button text="Register" className={isFormComplete ? 'blue-button' : 'gray-button'} disabled={!isFormComplete} onClick={(e) => {e.preventDefault(); handleSubmit();}}/>
        </div>
      </form>
    </div>
  );
};

export default TutorUniversityStep;
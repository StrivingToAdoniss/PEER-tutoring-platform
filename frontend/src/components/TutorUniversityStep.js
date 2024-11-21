import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';
import '../styles/TutorUniversityStep.css';
import backgroundImage from '../assets/SignUp/tutor_step_3_background.svg';

const TutorUniversityStep = ({ formData, onBack, onNext, onChange }) => {
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [certificateFileName, setCertificateFileName] = useState('');
  const profilePhotoInputRef = useRef(null);
  const certificationInputRef = useRef(null);

  // Mock data for dropdowns
  const institutes = [
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
  const courseNumbers = ["1", "2", "3", "4"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      education: { [name]: value },
    });
  };

  useEffect(() => {
    if (formData.profilePhotoPreview) {
      setProfilePhotoPreview(formData.profilePhotoPreview);
    }
    if (formData.certificateFileName) {
      setCertificateFileName(formData.certificateFileName);
    }
  }, [formData.profilePhotoPreview, formData.certificateFileName]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (e.target.name === 'profilePhoto') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
        onChange({
          profilePhoto: file,
          profilePhotoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (e.target.name === 'certifications') {
      setCertificateFileName(file.name);
      onChange({
        certifications: file,
        certificateFileName: file.name,
      });
    }
  };

  const handleSubmit = (e) => {
    onNext();
  };

  const isFormComplete =
  formData.profilePhoto &&
  formData.certifications &&
  formData.education &&
  formData.education.institute &&
  formData.education.specialty &&
  formData.education.courseNumber;

  return (
    <div className="tutor-form-step">
      <div className="tutor-image">
        <img src={backgroundImage} alt="Tutor illustration" />
      </div>
      <form onSubmit={handleSubmit} className="tutor-form">
        
      <div class="outer-container">
        {/* Adjusted Width Container for Fields */}
        <div className="adjusted-width-container">
          
          {/* Section 1: Profile Photo Upload */}
          <div className="form-section">
            <span className="side-text">Upload profile photo:</span>
            <div className="filterItem">
              <div className="upload-container">
                <Button
                  className={`plus-button ${profilePhotoPreview ? 'square-button' : ''}`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    profilePhotoInputRef.current.click();
                  }}
                />
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  ref={profilePhotoInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {profilePhotoPreview && (
                  <img
                    src={profilePhotoPreview}
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
                name="institute"
                value={formData.education.institute}
                onChange={handleInputChange}
                required
              >
                <option value=""disabled hidden>Select Institute</option>
                {institutes.map((institute, index) => (
                  <option key={index} value={institute}>
                    {institute}
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
                name="specialty"
                value={formData.education.specialty}
                onChange={handleInputChange}
                required
              >
                <option value=""disabled hidden>Select Specialty</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Course Number */}
          <div className="form-section">
            <span className="side-text">Course Number:</span>
            <div className="filterItem">
              <select
                name="courseNumber"
                value={formData.education.courseNumber}
                onChange={handleInputChange}
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
                  name="certifications"
                  accept="image/*,.pdf,.doc,.docx"
                  ref={certificationInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              {certificateFileName && (
                <span className="file-name">{certificateFileName}</span>
              )}
            </div>
          </div>

        </div>
        </div>

        {/* Back and Next Buttons */}
        <div className="form-button-container">
          <Button text="Back" className="outline-button" onClick={onBack} />
          <Button text="Next" className={isFormComplete ? 'blue-button' : 'gray-button'} />
        </div>
      </form>
    </div>
  );
};

export default TutorUniversityStep;
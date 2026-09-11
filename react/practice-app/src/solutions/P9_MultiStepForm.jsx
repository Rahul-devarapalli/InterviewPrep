import React, { useState } from 'react';

// Key Interview Concepts Demonstrated:
// 1. Lifting state up: The parent manages the shared form data while rendering different step components.
// 2. Form Validation: Validating on a per-step basis before allowing progression.
// 3. Step management: Using an index/state to render correct view and calculate progress.

const P9_MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', state: '', zip: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    let newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.name.trim()) { newErrors.name = 'Name is required'; isValid = false; }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Valid email is required'; isValid = false; }
      if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) { newErrors.phone = 'Valid 10-digit phone is required'; isValid = false; }
    } else if (step === 2) {
      if (!formData.street.trim()) { newErrors.street = 'Street is required'; isValid = false; }
      if (!formData.city.trim()) { newErrors.city = 'City is required'; isValid = false; }
      if (!formData.state.trim()) { newErrors.state = 'State is required'; isValid = false; }
      if (!formData.zip.trim() || !/^\d{5}$/.test(formData.zip)) { newErrors.zip = 'Valid 5-digit zip is required'; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div>
        <h3>Registration Complete!</h3>
        <p>Your details have been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Step {currentStep} of {totalSteps}</h2>
      
      <div>
        <progress value={currentStep} max={totalSteps} />
      </div>

      {/* Step 1: Personal Info */}
      {currentStep === 1 && (
        <div>
          <div>
            <label>Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span>{errors.name}</span>}
          </div>
          <div>
            <label>Email Address</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span>{errors.email}</span>}
          </div>
          <div>
            <label>Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <span>{errors.phone}</span>}
          </div>
        </div>
      )}

      {/* Step 2: Address Info */}
      {currentStep === 2 && (
        <div>
          <div>
            <label>Street Address</label>
            <input name="street" value={formData.street} onChange={handleChange} />
            {errors.street && <span>{errors.street}</span>}
          </div>
          <div>
            <label>City</label>
            <input name="city" value={formData.city} onChange={handleChange} />
            {errors.city && <span>{errors.city}</span>}
          </div>
          <div>
            <div>
              <label>State</label>
              <input name="state" value={formData.state} onChange={handleChange} />
              {errors.state && <span>{errors.state}</span>}
            </div>
            <div>
              <label>Zip Code</label>
              <input name="zip" value={formData.zip} onChange={handleChange} />
              {errors.zip && <span>{errors.zip}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div>
          <h3>Review Details</h3>
          <div>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
          </div>
          <div>
            <p><strong>Address:</strong><br />{formData.street}<br />{formData.city}, {formData.state} {formData.zip}</p>
          </div>
        </div>
      )}

      <div>
        <button 
          onClick={handlePrev} 
          disabled={currentStep === 1}
        >
          Previous
        </button>
        
        {currentStep < totalSteps ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default P9_MultiStepForm;

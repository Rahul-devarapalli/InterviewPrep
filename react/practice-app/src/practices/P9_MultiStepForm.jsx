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
      if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g,''))) { newErrors.phone = 'Valid 10-digit phone is required'; isValid = false; }
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

  const styles = {
    container: {
      backgroundColor: '#1a1a2e', color: '#e0e0e0', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 20px', fontFamily: 'system-ui, sans-serif'
    },
    card: {
      backgroundColor: '#2a2a4a', padding: '30px', borderRadius: '12px',
      width: '100%', maxWidth: '500px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
    },
    title: { color: '#00d4ff', marginTop: 0, textAlign: 'center' },
    progressBarContainer: {
      width: '100%', backgroundColor: '#1a1a2e', borderRadius: '8px',
      height: '8px', marginBottom: '30px', overflow: 'hidden'
    },
    progressBar: {
      height: '100%', backgroundColor: '#00d4ff', transition: 'width 0.3s ease',
      width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
    },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '500' },
    input: {
      width: '100%', padding: '10px', borderRadius: '6px',
      border: '1px solid #444', backgroundColor: '#1a1a2e', color: '#fff',
      boxSizing: 'border-box'
    },
    error: { color: '#f87171', fontSize: '0.85rem', marginTop: '5px', display: 'block' },
    buttonContainer: {
      display: 'flex', justifyContent: 'space-between', marginTop: '30px'
    },
    btn: (disabled, isPrimary) => ({
      padding: '10px 20px', borderRadius: '6px', border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      backgroundColor: disabled ? '#444' : isPrimary ? '#00d4ff' : '#444',
      color: disabled ? '#888' : isPrimary ? '#1a1a2e' : '#fff',
      fontWeight: '600'
    }),
    summaryBlock: { backgroundColor: '#1a1a2e', padding: '15px', borderRadius: '6px', marginBottom: '15px' },
    successMsg: { textAlign: 'center', color: '#4ade80', fontSize: '1.2rem', padding: '40px 0' }
  };

  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successMsg}>
            <h3>Registration Complete!</h3>
            <p>Your details have been submitted successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Step {currentStep} of {totalSteps}</h2>
        
        <div style={styles.progressBarContainer}>
          <div style={styles.progressBar}></div>
        </div>

        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <span style={styles.error}>{errors.name}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input style={styles.input} name="email" type="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span style={styles.error}>{errors.email}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input style={styles.input} name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <span style={styles.error}>{errors.phone}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Address Info */}
        {currentStep === 2 && (
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Street Address</label>
              <input style={styles.input} name="street" value={formData.street} onChange={handleChange} />
              {errors.street && <span style={styles.error}>{errors.street}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input style={styles.input} name="city" value={formData.city} onChange={handleChange} />
              {errors.city && <span style={styles.error}>{errors.city}</span>}
            </div>
            <div style={{display: 'flex', gap: '15px'}}>
              <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>State</label>
                <input style={styles.input} name="state" value={formData.state} onChange={handleChange} />
                {errors.state && <span style={styles.error}>{errors.state}</span>}
              </div>
              <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>Zip Code</label>
                <input style={styles.input} name="zip" value={formData.zip} onChange={handleChange} />
                {errors.zip && <span style={styles.error}>{errors.zip}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div>
            <h3 style={{marginTop: 0, color: '#fff'}}>Review Details</h3>
            <div style={styles.summaryBlock}>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
            </div>
            <div style={styles.summaryBlock}>
              <p><strong>Address:</strong><br/>{formData.street}<br/>{formData.city}, {formData.state} {formData.zip}</p>
            </div>
          </div>
        )}

        <div style={styles.buttonContainer}>
          <button 
            style={styles.btn(currentStep === 1, false)} 
            onClick={handlePrev} 
            disabled={currentStep === 1}
          >
            Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button style={styles.btn(false, true)} onClick={handleNext}>Next</button>
          ) : (
            <button style={styles.btn(false, true)} onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default P9_MultiStepForm;

import React, { useState } from 'react';

// Key Interview Concepts Demonstrated:
// 1. Lifting state up: The parent manages the shared form data while rendering different step components.
// 2. Form Validation: Validating on a per-step basis before allowing progression.
// 3. Step management: Using an index/state to render correct view and calculate progress.

const P9_MultiStepForm = () => {
  const totalSteps = 3;

  // TODO: 1. Set up state variables:
  // - currentStep: number tracking active step (starts at 1)
  // - formData: object storing form inputs:
  //   { name: '', email: '', phone: '', street: '', city: '', state: '', zip: '' }
  // - errors: object storing validation error messages per field (default: {})
  // - isSubmitted: boolean indicating if registration is complete (default: false)

  // TODO: 2. Implement handleChange(e) input handler:
  // - Extract name and value from e.target
  // - Update formData state immutably
  // - If an error exists for the field in `errors`, clear it as the user types

  // TODO: 3. Implement validateStep(step) validation helper:
  // - For Step 1 (Personal Info):
  //   * name: required (trimmed)
  //   * email: required, must match email pattern (e.g. /\S+@\S+\.\S+/)
  //   * phone: required, must be valid 10-digit phone number (e.g. /^\d{10}$/ on stripped digits)
  // - For Step 2 (Address Info):
  //   * street: required (trimmed)
  //   * city: required (trimmed)
  //   * state: required (trimmed)
  //   * zip: required, must be valid 5-digit zip (e.g. /^\d{5}$/)
  // - Update errors state with any error messages
  // - Return boolean indicating if step is valid

  // TODO: 4. Implement navigation & submission handlers:
  // - handleNext(): Validate current step; if valid, increment currentStep by 1
  // - handlePrev(): Decrement currentStep by 1
  // - handleSubmit(e): Prevent default form submission and set isSubmitted to true

  // TODO: 5. Conditionally render success screen if isSubmitted is true:
  // if (isSubmitted) {
  //   return (
  //     <div>
  //       <h3>Registration Complete!</h3>
  //       <p>Your details have been submitted successfully.</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* TODO: Display current step indicator and progress */}
      <h2>Step {/* currentStep */} of {totalSteps}</h2>
      
      <div>
        {/* TODO: Wire up progress value to currentStep */}
        <progress value={1} max={totalSteps} />
      </div>

      {/* Step 1: Personal Info */}
      {/* TODO: Conditionally render when currentStep === 1 */}
      <div>
        <div>
          <label>Full Name</label>
          <input
            name="name"
            placeholder="Full Name"
            // TODO: Wire up value={formData.name} and onChange={handleChange}
          />
          {/* TODO: Display errors.name if present */}
        </div>
        <div>
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            // TODO: Wire up value={formData.email} and onChange={handleChange}
          />
          {/* TODO: Display errors.email if present */}
        </div>
        <div>
          <label>Phone Number</label>
          <input
            name="phone"
            placeholder="Phone Number"
            // TODO: Wire up value={formData.phone} and onChange={handleChange}
          />
          {/* TODO: Display errors.phone if present */}
        </div>
      </div>

      {/* Step 2: Address Info */}
      {/* TODO: Conditionally render when currentStep === 2 */}
      <div>
        <div>
          <label>Street Address</label>
          <input
            name="street"
            placeholder="Street Address"
            // TODO: Wire up value={formData.street} and onChange={handleChange}
          />
          {/* TODO: Display errors.street if present */}
        </div>
        <div>
          <label>City</label>
          <input
            name="city"
            placeholder="City"
            // TODO: Wire up value={formData.city} and onChange={handleChange}
          />
          {/* TODO: Display errors.city if present */}
        </div>
        <div>
          <div>
            <label>State</label>
            <input
              name="state"
              placeholder="State"
              // TODO: Wire up value={formData.state} and onChange={handleChange}
            />
            {/* TODO: Display errors.state if present */}
          </div>
          <div>
            <label>Zip Code</label>
            <input
              name="zip"
              placeholder="Zip Code"
              // TODO: Wire up value={formData.zip} and onChange={handleChange}
            />
            {/* TODO: Display errors.zip if present */}
          </div>
        </div>
      </div>

      {/* Step 3: Review */}
      {/* TODO: Conditionally render when currentStep === 3 */}
      <div>
        <h3>Review Details</h3>
        <div>
          <p><strong>Name:</strong> {/* formData.name */}</p>
          <p><strong>Email:</strong> {/* formData.email */}</p>
          <p><strong>Phone:</strong> {/* formData.phone */}</p>
        </div>
        <div>
          <p>
            <strong>Address:</strong><br />
            {/* formData.street */}<br />
            {/* formData.city */}, {/* formData.state */} {/* formData.zip */}
          </p>
        </div>
      </div>

      {/* Step Navigation Buttons */}
      <div>
        <button 
          // TODO: Wire up onClick={handlePrev} and disabled={currentStep === 1}
        >
          Previous
        </button>
        
        {/* TODO: If currentStep < totalSteps render Next button with onClick={handleNext},
                  otherwise render Submit button with onClick={handleSubmit} */}
        <button>Next</button>
      </div>
    </div>
  );
};

export default P9_MultiStepForm;

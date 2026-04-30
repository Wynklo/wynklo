export const initContactForm = () => {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('.form-submit');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        service: formData.get('service'),
        message: formData.get('message')
      };
      
      // Use relative URL in production, localhost in development
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/contact'
        : '/api/contact';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show success message
        showMessage('Message sent successfully! We\'ll be in touch soon.', 'success');
        contactForm.reset();
      } else {
        showMessage('Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again.', 'error');
    } finally {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
};

function showMessage(message, type) {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `contact-message contact-message--${type}`;
  messageEl.textContent = message;
  
  // Style the message
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  if (type === 'success') {
    messageEl.style.background = 'var(--color-yellow)';
    messageEl.style.color = 'var(--color-bg)';
  } else {
    messageEl.style.background = '#ff4444';
    messageEl.style.color = 'white';
  }
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(messageEl);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    messageEl.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      document.body.removeChild(messageEl);
      document.head.removeChild(style);
    }, 300);
  }, 5000);
}

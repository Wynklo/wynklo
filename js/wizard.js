// ========================================
// Wynklo — Multi-Step Wizard Logic
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.wizard-step-content');
  const indicators = document.querySelectorAll('.step-indicator');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  
  const platformCards = document.querySelectorAll('.platform-card');
  const businessCards = document.querySelectorAll('.business-card');
  const dynamicFeatures = document.getElementById('dynamic-features');

  const aiLoading = document.getElementById('ai-loading');
  const interactiveMockup = document.getElementById('interactive-mockup');
  
  const devicePhone = document.getElementById('device-phone');
  const deviceMac = document.getElementById('device-mac');

  let currentStep = 1;
  const totalSteps = 5;
  
  // State
  let selectedPlatform = null;
  let selectedBusiness = null;
  let mockupTimeout = null;

  const businessData = {
    food: {
      name: "Food & Restaurant",
      hero: "🍔 Weekly Specials",
      action: "Order Delivery",
      appFeatures: ["FaceID/Biometric Login", "Live GPS Delivery Tracking", "One-Tap Reordering", "Apple Pay / Google Pay", "Push Notification Offers", "QR Code Table Ordering", "Loyalty Points Wallet", "In-App Chat with Driver", "Interactive Menu Configurator", "AR Food Preview"],
      webFeatures: ["SEO Optimized Menu Pages", "Online Catering Forms", "Table Reservation Calendar", "Admin Analytics Dashboard", "Multi-Location Support", "Kitchen Display System Sync", "Customer Reviews Management", "Dynamic Pricing & Specials", "Newsletter Integration", "Mobile-Responsive Grid"]
    },
    salon: {
      name: "Salon & Beauty",
      hero: "💇 Trending Styles",
      action: "Book Appointment",
      appFeatures: ["Push Reminders for Appointments", "Virtual Hair Try-On (AR)", "Staff Selection & Tipping", "Before/After Photo Gallery", "Membership Subscriptions", "In-App Product Purchases", "Waitlist Management", "Geolocation Check-In", "Apple Wallet Integration", "Client History Wallet"],
      webFeatures: ["SEO Local Business Profile", "Web Booking Widget", "Service Catalogue & Pricing", "Staff Roster Dashboard", "Gift Card Purchasing", "Email Marketing Automation", "POS System Integration", "Customer Feedback Portal", "Inventory Management Admin", "Multi-Language Support"]
    },
    ecommerce: {
      name: "E-Commerce",
      hero: "🛍️ Summer Collection",
      action: "Add to Cart",
      appFeatures: ["One-Tap Checkout", "Barcode/QR Scanner", "Push Notification Sales", "AR Product Placement", "Wishlist Sharing", "Biometric Authentication", "In-App Customer Support Chat", "Voice Search", "Offline Saved Items", "Social Media Login"],
      webFeatures: ["Advanced Product Filtering", "Abandoned Cart Recovery", "Stripe/PayPal Integration", "SEO Product Schemas", "Admin Order Dashboard", "Inventory Sync", "Bulk Discount Engine", "Multi-Currency Support", "Customer Reviews & Ratings", "Mega-Menu Navigation"]
    },
    gym: {
      name: "Gym & Fitness",
      hero: "🏋️ Today's Workout",
      action: "Join Class",
      appFeatures: ["Apple Health/Google Fit Sync", "Barcode Entry Scanner", "Live Video Classes", "Push Notification Reminders", "Workout Progress Tracker", "Trainer Messaging", "In-App Nutrition Log", "Class Waitlists", "Wearable Device Integration", "Digital Membership Card"],
      webFeatures: ["Member Portal Login", "Class Schedule Calendar", "Online Merchandise Store", "Lead Capture Landing Pages", "Trainer Biographies", "Blog & Fitness Articles", "Billing & Invoice Management", "Admin KPI Dashboard", "Video Library CMS", "Waiver & Contract Signing"]
    },
    education: {
      name: "Education",
      hero: "📚 My Courses",
      action: "Start Lesson",
      appFeatures: ["Offline Video Downloading", "Interactive Quizzes", "Push Notification Deadlines", "In-App Discussion Forums", "Gamification Badges", "Audio-Only Mode", "Study Timers", "Progress Widgets", "AR Learning Modules", "Flashcards System"],
      webFeatures: ["SCORM Compliant Video Player", "Webinar & Zoom Integration", "Instructor Dashboard", "Student Progress Analytics", "Certificate Generation", "Subscription Billing Engine", "Peer-to-Peer Grading", "Resource Library CMS", "SEO Course Pages", "Multi-Tier Access Control"]
    },
    realestate: {
      name: "Real Estate",
      hero: "🏠 Featured Properties",
      action: "Schedule Tour",
      appFeatures: ["Map-Based Property Search", "GPS Location Alerts", "3D Virtual Tours (VR)", "Push Notification Price Drops", "In-App Mortgage Calculator", "Save to Favorites", "Direct Agent Chat", "Photo Gallery Swipe", "Open House Check-In", "Document E-Signing"],
      webFeatures: ["MLS Database Integration", "Advanced SEO Filtering", "Agent CRM Dashboard", "Automated Email Drip Campaigns", "Neighborhood Demographics Data", "High-Res Image Optimization", "Lead Generation Forms", "Interactive Floor Plans", "Property Comparison Tool", "Blog & Market Reports"]
    },
    portfolio: {
      name: "Portfolio/Agency",
      hero: "💼 Recent Work",
      action: "Get a Quote",
      appFeatures: ["Push Notification Updates", "Client Project Portal", "In-App Invoice Payment", "Direct Messaging", "Interactive Case Studies", "Design Approval Swipe", "AR Portfolio Viewer", "Team Directory", "Live Project Status", "Offline Access"],
      webFeatures: ["High-Performance Animations", "SEO Optimized Case Studies", "Interactive Contact Forms", "CMS for Blog/Insights", "Client Testimonial Sliders", "Video Backgrounds", "Lead Funnel Analytics", "Accessibility (WCAG) Compliance", "Dark/Light Mode Toggle", "Custom CMS Dashboard"]
    },
    clinic: {
      name: "Clinic",
      hero: "🏥 Available Doctors",
      action: "Book Consultation",
      appFeatures: ["HIPAA Compliant Video Chat", "FaceID Medical Record Access", "Prescription Refill Requests", "Push Notification Pill Reminders", "Symptom Checker", "Vitals Tracking Sync", "Digital ID Card", "Apple Wallet Integration", "In-App Lab Results", "Emergency SOS Button"],
      webFeatures: ["Patient Portal Login", "Doctor Availability Calendar", "Online Intake Forms", "Insurance Verification API", "SEO Clinic Services", "Billing & Invoice Management", "Telehealth Waiting Room", "Admin Patient CRM", "Multi-Clinic Management", "Health Blog CMS"]
    },
    events: {
      name: "Events",
      hero: "🎉 Upcoming Shows",
      action: "Buy Tickets",
      appFeatures: ["QR Code Ticket Wallet", "Live Event Push Notifications", "Interactive Venue Map", "Offline Ticket Access", "In-App Drink Ordering", "Friend Finder via GPS", "Artist Lineup Schedules", "Apple Pay Fast Checkout", "Photo Booth Filters", "Event Chat Rooms"],
      webFeatures: ["Interactive Seating Charts", "High-Volume Traffic Handling", "Stripe Checkout Integration", "Sponsor Advertisement Banners", "Event Analytics Dashboard", "Multi-Tier Ticket Pricing", "SEO Event Pages", "Affiliate Tracking Links", "Newsletter Waitlists", "Dynamic Schedule CMS"]
    }
  };

  // ── Step 1 Interactions ──
  platformCards.forEach(card => {
    card.addEventListener('click', () => {
      platformCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPlatform = card.dataset.platform;
      checkValidation();
    });
  });

  businessCards.forEach(card => {
    card.addEventListener('click', () => {
      businessCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedBusiness = card.dataset.business;
      checkValidation();
    });
  });

  // ── Input Listeners ──
  const formInputs = document.querySelectorAll('.wizard-input');
  formInputs.forEach(input => {
    input.addEventListener('input', checkValidation);
  });

  // ── Navigation Logic ──
  function updateUI() {
    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    indicators.forEach((indicator, index) => {
      const stepNum = index + 1;
      indicator.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        indicator.classList.add('active');
      } else if (stepNum < currentStep) {
        indicator.classList.add('completed');
      }
    });

    if (currentStep === 1) {
      btnPrev.style.visibility = 'hidden';
    } else {
      btnPrev.style.visibility = 'visible';
    }

    if (currentStep === totalSteps) {
      btnNext.textContent = "Submit Request";
    } else {
      btnNext.textContent = "Next Step";
    }

    // Dynamic triggers
    if (currentStep === 3) populateFeatures();
    if (currentStep === 4) triggerAIPreview();
    else {
      // Reset Step 4 if navigating away
      if (mockupTimeout) clearTimeout(mockupTimeout);
      aiLoading.style.display = 'flex';
      interactiveMockup.style.display = 'none';
    }

    checkValidation();
  }

  function checkValidation() {
    let isValid = true;

    if (currentStep === 1) {
      if (!selectedPlatform || !selectedBusiness) isValid = false;
    } 
    else if (currentStep === 2) {
      const bName = document.getElementById('businessName').value.trim();
      const loc = document.getElementById('location').value.trim();
      if (!bName || !loc) isValid = false;
    }
    else if (currentStep === 5) {
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      if (!name || !email) isValid = false;
    }

    btnNext.disabled = !isValid;
  }

  function populateFeatures() {
    if (!selectedBusiness) return;
    const data = businessData[selectedBusiness];
    dynamicFeatures.innerHTML = '';
    
    let featuresToShow = [];
    if (selectedPlatform === 'app') featuresToShow = data.appFeatures;
    else if (selectedPlatform === 'web') featuresToShow = data.webFeatures;
    else if (selectedPlatform === 'both') featuresToShow = [...data.appFeatures, ...data.webFeatures];

    // Remove duplicates if any
    featuresToShow = [...new Set(featuresToShow)];
    
    featuresToShow.forEach((feat, index) => {
      const id = `feat-${index}`;
      const item = document.createElement('label');
      item.className = 'feature-item';
      item.setAttribute('for', id);
      
      item.innerHTML = `
        <input type="checkbox" id="${id}" class="feature-checkbox" value="${feat}" checked />
        <span class="feature-name">${feat}</span>
      `;
      dynamicFeatures.appendChild(item);
    });
  }

  function triggerAIPreview() {
    if (!selectedBusiness) return;
    const data = businessData[selectedBusiness];
    
    // Device Visibility
    devicePhone.style.display = (selectedPlatform === 'app' || selectedPlatform === 'both') ? 'flex' : 'none';
    deviceMac.style.display = (selectedPlatform === 'web' || selectedPlatform === 'both') ? 'flex' : 'none';

    // Configure Both Mockups
    document.querySelectorAll('.mockup-title').forEach(el => el.textContent = data.name);
    document.querySelectorAll('.mockup-hero').forEach(el => el.textContent = data.hero);
    document.querySelectorAll('.mockup-action-btn').forEach(el => el.textContent = data.action);

    // Get currently checked features from Step 3
    const checkedFeatures = Array.from(document.querySelectorAll('.feature-checkbox:checked')).map(cb => cb.value);
    const displayFeatures = checkedFeatures.length > 0 ? checkedFeatures : [...(data.appFeatures || []), ...(data.webFeatures || [])];
    
    // Populate Features Tab
    document.querySelectorAll('.mockup-features-list').forEach(list => {
      list.innerHTML = '';
      displayFeatures.forEach(feat => {
        const item = document.createElement('div');
        item.className = 'mockup-list-item';
        item.style.background = 'rgba(255,255,255,0.02)';
        item.style.padding = '10px';
        item.style.borderRadius = '8px';
        item.innerHTML = `<span style="margin-right: 10px; color: var(--color-yellow);">✓</span> <span style="font-size: 0.85rem;">${feat}</span>`;
        list.appendChild(item);
      });
    });

    // Populate Home Tab with a few feature cards to look "real"
    document.querySelectorAll('.mockup-home-list').forEach(list => {
      list.innerHTML = '';
      const homeFeatures = displayFeatures.slice(0, 3); // Take top 3
      homeFeatures.forEach(feat => {
        const item = document.createElement('div');
        item.className = 'mockup-list-item';
        item.style.background = 'rgba(255,255,255,0.03)';
        item.style.padding = '12px';
        item.style.borderRadius = '10px';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        
        item.innerHTML = `
          <div style="font-size: 1.2rem; margin-right: 15px; background: rgba(253, 208, 17, 0.1); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 6px;">✨</div>
          <div class="mockup-item-text" style="flex: 1;">
            <div style="font-family: var(--font-heading); font-size: 0.85rem; margin-bottom: 4px;">${feat}</div>
            <div class="mockup-line short" style="height: 4px; opacity: 0.5;"></div>
          </div>
        `;
        list.appendChild(item);
      });
    });

    // Reset mockups to Home view
    document.querySelectorAll('.mockup-nav-item').forEach(n => {
      n.classList.remove('active');
      if(n.dataset.target === 'mockup-view-home') n.classList.add('active');
    });
    
    document.querySelectorAll('.mockup-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.mockup-view-home').forEach(v => v.classList.add('active'));

    // Loading Animation
    btnNext.disabled = true; // Disable next while loading
    mockupTimeout = setTimeout(() => {
      aiLoading.style.display = 'none';
      interactiveMockup.style.display = 'flex';
      btnNext.disabled = false;
    }, 2500);
  }

  // ── Mockup Interactions ──
  function showToast(device, message) {
    const toast = document.querySelector(`#device-${device} .mockup-toast`);
    if(toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }
  }

  document.querySelectorAll('.mockup-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const device = e.target.closest('.phone-mockup') ? 'phone' : 'mac';
      const originalText = btn.textContent;
      
      // Simulate Processing State
      btn.classList.add('loading');
      btn.textContent = 'Processing...';
      
      setTimeout(() => {
        btn.classList.remove('loading');
        btn.textContent = '✅ Success';
        showToast(device, originalText + ' Completed!');
        
        // Revert back
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }, 800);
    });
  });

  // Toggle Switches Interaction
  document.querySelectorAll('.mockup-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      toggle.classList.toggle('active');
      const device = toggle.closest('.phone-mockup') ? 'phone' : 'mac';
      const state = toggle.classList.contains('active') ? 'Enabled' : 'Disabled';
      showToast(device, `Setting ${state}`);
    });
  });

  document.querySelectorAll('.mockup-nav-item').forEach(nav => {
    nav.addEventListener('click', (e) => {
      const device = nav.dataset.device;
      const targetClass = nav.dataset.target; // e.g. mockup-view-home
      
      // Update nav styling for THIS device
      const container = document.getElementById(`device-${device}`);
      container.querySelectorAll('.mockup-nav-item').forEach(n => n.classList.remove('active'));
      nav.classList.add('active');
      
      // Switch view for THIS device
      container.querySelectorAll('.mockup-view').forEach(v => v.classList.remove('active'));
      const targetView = container.querySelector(`.${targetClass}`);
      if (targetView) targetView.classList.add('active');
      
      // Show toast
      const tabNames = {
        'mockup-view-home': 'Home',
        'mockup-view-features': 'Features',
        'mockup-view-settings': 'Settings/Admin'
      };
      showToast(device, tabNames[targetClass] + ' Tab Selected');
    });
  });

  // ── Button Listeners ──
  btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateUI();
    }
  });

  btnNext.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateUI();
    } else if (currentStep === totalSteps) {
      submitForm();
    }
  });

  function submitForm() {
    btnNext.textContent = "Submitting...";
    btnNext.disabled = true;
    
    // Gather Data Payload
    const checkedFeatures = Array.from(document.querySelectorAll('.feature-checkbox:checked')).map(cb => cb.value);
    
    const payload = {
      platform: selectedPlatform,
      businessCategory: selectedBusiness,
      businessName: document.getElementById('businessName').value.trim(),
      location: document.getElementById('location').value.trim(),
      selectedFeatures: checkedFeatures,
      specificRequirements: document.getElementById('specificRequirements').value.trim(),
      contact: {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        phone: document.getElementById('contactPhone').value.trim()
      }
    };

    console.log("🚀 Project Submission Payload:", payload);
    
    setTimeout(() => {
      alert("Thank you! Your project request has been submitted successfully.");
      window.location.href = "/";
    }, 1500);
  }

  // Init
  updateUI();
});

// Modern JavaScript for VIB Music

class VibMusic {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupFormValidation();
    this.setupImageLazyLoading();
    this.setupAnimations();
  }

  // Mobile Menu Toggle
  setupMobileMenu() {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (navbarToggle && navbarMenu) {
      navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        
        // Update ARIA attributes
        const isExpanded = navbarMenu.classList.contains('active');
        navbarToggle.setAttribute('aria-expanded', isExpanded);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
          navbarToggle.classList.remove('active');
          navbarMenu.classList.remove('active');
          navbarToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Close menu when pressing Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
          navbarToggle.classList.remove('active');
          navbarMenu.classList.remove('active');
          navbarToggle.setAttribute('aria-expanded', 'false');
          navbarToggle.focus();
        }
      });
    }
  }

  // Smooth Scrolling for Anchor Links
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Form Validation
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Real-time validation
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          if (input.classList.contains('invalid')) {
            this.validateField(input);
          }
        });
      });

      // Form submission
      form.addEventListener('submit', (e) => {
        let isValid = true;
        
        inputs.forEach(input => {
          if (!this.validateField(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          const firstInvalid = form.querySelector('.invalid');
          if (firstInvalid) {
            firstInvalid.focus();
          }
        }
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Remove previous validation state
    field.classList.remove('valid', 'invalid');
    this.removeValidationMessage(field);

    // Required field check
    if (field.required && !value) {
      isValid = false;
      message = 'Este campo é obrigatório';
    }
    // Email validation
    else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Por favor, insira um email válido';
      }
    }
    // Phone validation
    else if (field.type === 'tel' && value) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
        message = 'Por favor, insira um número de telefone válido';
      }
    }
    // File validation
    else if (field.type === 'file' && field.files.length > 0) {
      const file = field.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (file.size > maxSize) {
        isValid = false;
        message = 'O arquivo deve ter menos de 10MB';
      }
      
      // Check file type for specific inputs
      if (field.accept) {
        const acceptedTypes = field.accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!acceptedTypes.some(type => 
          fileType.match(type.replace('*', '.*')) || type === fileExtension
        )) {
          isValid = false;
          message = 'Tipo de arquivo não suportado';
        }
      }
    }

    // Apply validation state
    if (isValid) {
      field.classList.add('valid');
    } else {
      field.classList.add('invalid');
      this.showValidationMessage(field, message);
    }

    return isValid;
  }

  showValidationMessage(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-message';
    errorElement.textContent = message;
    
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      formGroup.appendChild(errorElement);
    }
  }

  removeValidationMessage(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      const existingMessage = formGroup.querySelector('.validation-message');
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  }

  // Lazy Loading for Images
  setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src], img.lazy');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // Animation on Scroll
  setupAnimations() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      const animatedElements = document.querySelectorAll('.artist-card, .track-item, .hero-content, .category-card, .playlist-card');
      animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        animationObserver.observe(el);
      });
    }
    
    // Setup category favorites
    this.setupCategoryFavorites();
  }
  
  setupCategoryFavorites() {
    const favoriteButtons = document.querySelectorAll('.category-favorite');
    
    favoriteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        button.classList.toggle('favorited');
        
        const categoryId = button.dataset.category;
        const isFavorited = button.classList.contains('favorited');
        
        // Update button text and icon
        const svg = button.querySelector('svg path');
        if (isFavorited) {
          svg.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
        }
        
        // Store in localStorage
        const favorites = JSON.parse(localStorage.getItem('categoryFavorites') || '[]');
        if (isFavorited) {
          if (!favorites.includes(categoryId)) {
            favorites.push(categoryId);
          }
        } else {
          const index = favorites.indexOf(categoryId);
          if (index > -1) {
            favorites.splice(index, 1);
          }
        }
        localStorage.setItem('categoryFavorites', JSON.stringify(favorites));
      });
      
      // Load favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('categoryFavorites') || '[]');
      const categoryId = button.dataset.category;
      if (favorites.includes(categoryId)) {
        button.classList.add('favorited');
      }
    });
  }

  // Utility method for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new VibMusic();
});

// Add CSS for animations and validation
const style = document.createElement('style');
style.textContent = `
  .validation-message {
    color: var(--accent-primary);
    font-size: 1.4rem;
    margin-top: var(--space-xs);
    display: block;
  }
  
  .form-group input.invalid,
  .form-group select.invalid,
  .form-group textarea.invalid {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(225, 125, 24, 0.2);
  }
  
  .form-group input.valid,
  .form-group select.valid,
  .form-group textarea.valid {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  }
  
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
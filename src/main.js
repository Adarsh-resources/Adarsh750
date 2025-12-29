import './style.css';
import { ThreeScene } from './three-scene.js';
import { Animations } from './animations.js';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

// Initialize the application
class App {
  constructor() {
    this.init();
  }

  init() {
    // Initialize Three.js scene
    this.threeScene = new ThreeScene();
    
    // Initialize GSAP animations
    this.animations = new Animations();
    
    // Initialize form handling
    this.initContactForm();
    
    console.log('🚀 Portfolio initialized successfully!');
  }

  initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
          this.showNotification('Please fill in all fields', 'error');
          return;
        }
        
        // Simulate form submission
        this.showNotification('Message sent successfully!', 'success');
        form.reset();
        
        // In a real application, you would send this to a server
        console.log('Form submitted:', { name, email, message });
      });
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 1rem 2rem;
      background: ${type === 'success' ? '#55efc4' : type === 'error' ? '#ff7675' : '#74b9ff'};
      color: #0a0a0f;
      border-radius: 10px;
      font-weight: 500;
      z-index: 10000;
      transform: translateY(100px);
      opacity: 0;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    gsap.to(notification, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out'
    });
    
    // Remove after delay
    setTimeout(() => {
      gsap.to(notification, {
        y: 100,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          notification.remove();
        }
      });
    }, 3000);
  }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

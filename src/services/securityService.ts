
/**
 * Security Service for Energy Palace Website
 * Implements various security measures and validation functions
 */

interface SecurityConfig {
  enableCSP: boolean;
  enableXSSProtection: boolean;
  maxRequestsPerMinute: number;
  sessionTimeout: number;
}

interface ValidationRules {
  email: RegExp;
  phone: RegExp;
  name: RegExp;
}

class SecurityService {
  private config: SecurityConfig = {
    enableCSP: true,
    enableXSSProtection: true,
    maxRequestsPerMinute: 60,
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  };

  private validationRules: ValidationRules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    name: /^[a-zA-Z\s'-]{2,50}$/
  };

  private requestCounts: Map<string, { count: number; timestamp: number }> = new Map();

  /**
   * Input Sanitization
   */
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  sanitizeEmail(email: string): string {
    return this.sanitizeInput(email).toLowerCase();
  }

  sanitizePhoneNumber(phone: string): string {
    return this.sanitizeInput(phone).replace(/[^\d\+\-\(\)\s]/g, '');
  }

  /**
   * Input Validation
   */
  validateEmail(email: string): boolean {
    const sanitized = this.sanitizeEmail(email);
    return this.validationRules.email.test(sanitized) && sanitized.length <= 254;
  }

  validatePhoneNumber(phone: string): boolean {
    const sanitized = this.sanitizePhoneNumber(phone);
    return this.validationRules.phone.test(sanitized);
  }

  validateName(name: string): boolean {
    const sanitized = this.sanitizeInput(name);
    return this.validationRules.name.test(sanitized);
  }

  validateDate(date: string): boolean {
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dateObj instanceof Date && 
           !isNaN(dateObj.getTime()) && 
           dateObj >= today &&
           dateObj <= new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000); // Max 1 year in future
  }

  validateTime(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Rate Limiting
   */
  checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    // Clean old entries
    for (const [key, data] of this.requestCounts.entries()) {
      if (data.timestamp < windowStart) {
        this.requestCounts.delete(key);
      }
    }

    const current = this.requestCounts.get(identifier);
    
    if (!current || current.timestamp < windowStart) {
      this.requestCounts.set(identifier, { count: 1, timestamp: now });
      return true;
    }

    if (current.count >= this.config.maxRequestsPerMinute) {
      return false;
    }

    current.count++;
    return true;
  }

  /**
   * Form Data Validation and Sanitization
   */
  validateAndSanitizeOrderData(data: any): { isValid: boolean; sanitized?: any; errors?: string[] } {
    const errors: string[] = [];
    
    if (!this.validateName(data.customerName)) {
      errors.push('Invalid customer name');
    }
    
    if (!this.validateEmail(data.customerEmail)) {
      errors.push('Invalid email address');
    }
    
    if (!this.validatePhoneNumber(data.customerPhone)) {
      errors.push('Invalid phone number');
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      errors.push('No items in order');
    }

    if (typeof data.total !== 'number' || data.total <= 0) {
      errors.push('Invalid order total');
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      sanitized: {
        customerName: this.sanitizeInput(data.customerName),
        customerEmail: this.sanitizeEmail(data.customerEmail),
        customerPhone: this.sanitizePhoneNumber(data.customerPhone),
        items: data.items.map((item: any) => ({
          id: this.sanitizeInput(item.id),
          name: this.sanitizeInput(item.name),
          quantity: Math.max(1, parseInt(item.quantity) || 1),
          price: Math.max(0, parseFloat(item.price) || 0)
        })),
        total: Math.max(0, parseFloat(data.total) || 0),
        notes: this.sanitizeInput(data.notes || ''),
        timestamp: new Date().toISOString()
      }
    };
  }

  validateAndSanitizeReservationData(data: any): { isValid: boolean; sanitized?: any; errors?: string[] } {
    const errors: string[] = [];
    
    if (!this.validateName(data.name)) {
      errors.push('Invalid name');
    }
    
    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email address');
    }
    
    if (!this.validatePhoneNumber(data.phone)) {
      errors.push('Invalid phone number');
    }

    if (!this.validateDate(data.date)) {
      errors.push('Invalid reservation date');
    }

    if (!this.validateTime(data.time)) {
      errors.push('Invalid reservation time');
    }

    if (!data.guests || parseInt(data.guests) < 1 || parseInt(data.guests) > 20) {
      errors.push('Invalid number of guests');
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      sanitized: {
        name: this.sanitizeInput(data.name),
        email: this.sanitizeEmail(data.email),
        phone: this.sanitizePhoneNumber(data.phone),
        date: data.date,
        time: data.time,
        guests: Math.max(1, Math.min(20, parseInt(data.guests))),
        occasion: this.sanitizeInput(data.occasion || ''),
        specialRequests: this.sanitizeInput(data.specialRequests || '').substring(0, 500),
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Content Security Policy Headers
   */
  getCSPHeaders(): Record<string, string> {
    if (!this.config.enableCSP) return {};

    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://apis.google.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://sheets.googleapis.com",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'"
      ].join('; ')
    };
  }

  /**
   * Generate session token (for future use)
   */
  generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash sensitive data (for future use)
   */
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Log security events
   */
  logSecurityEvent(event: string, details: any): void {
    console.warn('Security Event:', {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  /**
   * Initialize security measures
   */
  initialize(): void {
    // Set security headers if possible
    const headers = this.getCSPHeaders();
    
    // Add additional security measures
    if (this.config.enableXSSProtection) {
      // Monitor for potential XSS attempts
      this.monitorForXSS();
    }

    console.log('Security service initialized');
  }

  private monitorForXSS(): void {
    // Basic XSS monitoring
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (message.includes('script') || message.includes('javascript:')) {
        this.logSecurityEvent('Potential XSS detected', { message });
      }
      originalConsoleError.apply(console, args);
    };
  }
}

// Create and export singleton instance
export const securityService = new SecurityService();

// Initialize on import
securityService.initialize();

export default securityService;

"document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinksElements = document.querySelectorAll('.nav-link[href^="#"]');
    navLinksElements.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });
    
    // Theme card interactions
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('click', function() {
            const theme = this.dataset.theme;
            console.log('Selected theme:', theme);
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form .form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            
            // Add loading state
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Starting Trial...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert('Thank you! We\\'ll contact you soon to set up your free trial.');
                
                // Reset form
                this.reset();
                
                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.theme-card, .pricing-card, .contact-feature');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Pricing card hover effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('featured')) {
                this.style.transform = 'translateY(-4px) scale(1.05)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Theme preview hover effects
    themeCards.forEach(card => {
        const preview = card.querySelector('.theme-preview');
        
        if (preview) {
            card.addEventListener('mouseenter', function() {
                preview.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                preview.style.transform = 'scale(1)';
            });
        }
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
    
    // Performance optimization: Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add CSS for ripple effect and mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-links.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            border-radius: 0 0 0.75rem 0.75rem;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});

```html:views/index.ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RestaurantBuilder - Create Beautiful Restaurant Websites in Minutes</title>
    <meta name="description" content="Build stunning restaurant websites with our easy-to-use platform. Choose from professional themes, manage menus, and get online in minutes.">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/mobile.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <h1>RestaurantBuilder</h1>
            </div>
            <div class="nav-links">
                <a href="#themes" class="nav-link">Themes</a>
                <a href="#pricing" class="nav-link">Pricing</a>
                <a href="#contact" class="nav-link">Get Started</a>
                <a href="/auth/google" class="btn btn-primary">Sign In</a>
            </div>
            <div class="nav-mobile">
                <button class="mobile-menu-btn" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Create Stunning Restaurant Websites in Minutes</h1>
                <p class="hero-subtitle">
                    Professional themes, easy menu management, and everything you need to get your restaurant online. 
                    No coding required.
                </p>
                <div class="hero-cta">
                    <a href="/auth/google" class="btn btn-primary">Start Free Trial</a>
                    <a href="#themes" class="btn btn-secondary">View Themes</a>
                </div>
            </div>
            <div class="hero-image">
                <img src="/placeholder.svg?height=500&width=600" alt="Restaurant website preview" loading="lazy">
            </div>
        </div>
    </section>

    <!-- Themes Section -->
    <section id="themes" class="themes-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Choose Your Perfect Theme</h2>
                <p class="section-subtitle">
                    Professional designs crafted specifically for restaurants, cafes, and food businesses. 
                    Each theme is fully customizable and mobile-responsive.
                </p>
            </div>

            <!-- Cozy & Casual -->
            <div class="theme-category">
                <h3 class="category-title">Cozy & Casual</h3>
                <div class="themes-grid">
                    <div class="theme-card" data-theme="cafe">
                        <div class="theme-preview">
                            <div class="preview-header cozy-header">
                                <div class="preview-nav">
                                    <div class="preview-logo">Cozy Cafe</div>
                                    <div class="preview-menu">
                                        <span>Menu</span>
                                        <span>About</span>
                                        <span>Contact</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-content cozy-content">
                                <h4>Welcome to Our Cozy Corner</h4>
                                <p>{'Artisan coffee & homemade pastries in a warm, inviting atmosphere.'}</p>
                                <div class="preview-menu-section">
                                    <h5>Coffee & Drinks</h5>
                                    <div class="menu-items">
                                        <div class="menu-item">
                                            <span>Cappuccino</span>
                                            <span>$4.50</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Latte</span>
                                            <span>$4.75</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Americano</span>
                                            <span>$3.50</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-info">
                            <h4>Cozy Cafe</h4>
                            <p>Perfect for cafes, coffee shops, and casual dining establishments. Features warm colors and friendly typography.</p>
                            <div class="theme-features">
                                <span class="feature">Warm Colors</span>
                                <span class="feature">Gallery Grid</span>
                                <span class="feature">Menu Categories</span>
                                <span class="feature">Social Links</span>
                            </div>
                        </div>
                    </div>

                    <div class="theme-card" data-theme="family">
                        <div class="theme-preview">
                            <div class="preview-header family-header">
                                <div class="preview-nav">
                                    <div class="preview-logo">Family Diner</div>
                                    <div class="preview-menu">
                                        <span>Menu</span>
                                        <span>About</span>
                                        <span>Contact</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-content family-content">
                                <h4>Family Recipes, Made with Love</h4>
                                <p>{'Comfort food and family favorites in a welcoming environment.'}</p>
                                <div class="preview-menu-section">
                                    <h5>Main Dishes</h5>
                                    <div class="menu-items">
                                        <div class="menu-item">
                                            <span>Classic Burger</span>
                                            <span>$12.99</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Fish & Chips</span>
                                            <span>$14.50</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Chicken Sandwich</span>
                                            <span>$11.75</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-info">
                            <h4>Family Diner</h4>
                            <p>Ideal for family restaurants and diners. Features comfortable layouts and approachable design elements.</p>
                            <div class="theme-features">
                                <span class="feature">Comfort Colors</span>
                                <span class="feature">Large Images</span>
                                <span class="feature">Easy Navigation</span>
                                <span class="feature">Contact Info</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fine Dining -->
            <div class="theme-category">
                <h3 class="category-title">Fine Dining & Upscale</h3>
                <div class="themes-grid">
                    <div class="theme-card" data-theme="luxury">
                        <div class="theme-preview">
                            <div class="preview-header luxury-header">
                                <div class="preview-nav">
                                    <div class="preview-logo">Le Luxe</div>
                                    <div class="preview-menu">
                                        <span>Menu</span>
                                        <span>Reservations</span>
                                        <span>Events</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-content luxury-content">
                                <h4>Exquisite Culinary Experience</h4>
                                <p>{'Fine dining with exceptional service and attention to detail.'}</p>
                                <div class="preview-menu-section">
                                    <h5>Chef\\'s Selection</h5>
                                    <div class="menu-items">
                                        <div class="menu-item">
                                            <span>Wagyu Beef</span>
                                            <span>$85</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Lobster Thermidor</span>
                                            <span>$65</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Truffle Risotto</span>
                                            <span>$45</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-info">
                            <h4>Luxury Restaurant</h4>
                            <p>Sophisticated design for upscale restaurants and fine dining establishments. Features elegant typography and premium aesthetics.</p>
                            <div class="theme-features">
                                <span class="feature">Dark Theme</span>
                                <span class="feature">Gold Accents</span>
                                <span class="feature">Elegant Fonts</span>
                                <span class="feature">Reservation System</span>
                            </div>
                        </div>
                    </div>

                    <div class="theme-card" data-theme="modern">
                        <div class="theme-preview">
                            <div class="preview-header modern-header">
                                <div class="preview-nav">
                                    <div class="preview-logo">Modern Bistro</div>
                                    <div class="preview-menu">
                                        <span>Menu</span>
                                        <span>Wine</span>
                                        <span>Contact</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-content modern-content">
                                <h4>Contemporary Cuisine</h4>
                                <p>{'Modern flavors meet classic techniques in our innovative kitchen.'}</p>
                                <div class="preview-menu-section">
                                    <h5>Signature Dishes</h5>
                                    <div class="menu-items">
                                        <div class="menu-item">
                                            <span>Duck Confit</span>
                                            <span>$28</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Seared Scallops</span>
                                            <span>$32</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Beef Tenderloin</span>
                                            <span>$38</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-info">
                            <h4>Modern Bistro</h4>
                            <p>Clean, contemporary design perfect for modern restaurants and bistros. Features minimalist aesthetics and bold typography.</p>
                            <div class="theme-features">
                                <span class="feature">Minimalist</span>
                                <span class="feature">Clean Lines</span>
                                <span class="feature">Bold Typography</span>
                                <span class="feature">Wine List</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fast Food & Quick Service -->
            <div class="theme-category">
                <h3 class="category-title">Fast Food & Quick Service</h3>
                <div class="themes-grid">
                    <div class="theme-card" data-theme="bold">
                        <div class="theme-preview">
                            <div class="preview-header bold-header">
                                <div class="preview-nav">
                                    <div class="preview-logo">Burger Palace</div>
                                    <div class="preview-menu">
                                        <span>Menu</span>
                                        <span>Order</span>
                                        <span>Locations</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-content bold-content">
                                <h4>Fast, Fresh, Delicious</h4>
                                <p>{'Quick service without compromising on quality or taste.'}</p>
                                <div class="preview-menu-section">
                                    <h5>Burgers & Fries</h5>
                                    <div class="menu-items">
                                        <div class="menu-item">
                                            <span>Big Palace Burger</span>
                                            <span>$8.99</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Crispy Chicken</span>
                                            <span>$7.50</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Loaded Fries</span>
                                            <span>$5.25</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-info">
                            <h4>Bold Fast Food</h4>
                            <p>High-energy design for fast food restaurants and quick service establishments. Features bright colors and attention-grabbing elements.</p>
                            <div class="theme-features">
                                <span class="feature">Bright Colors</span>
                                <span class="feature">Bold Design</span>
                                <span class="feature">Quick Order</span>
                                <span class="feature">Location Finder</span>
                            </div>
                        </div>
                    </div>

                    <div class="theme-card" data-theme="street">
                        <div class="theme-preview">
                            <div class="preview-header street-header">
                                <div class="preview-nav">
                                    <div class="preview-logo">Street Eats</div>
                                    <div class="preview-menu">
                                        <span>Menu</span>
                                        <span>Truck</span>
                                        <span>Events</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-content street-content">
                                <h4>Authentic Street Food</h4>
                                <p>{'Bold flavors and authentic recipes from around the world.'}</p>
                                <div class="preview-menu-section">
                                    <h5>Street Favorites</h5>
                                    <div class="menu-items">
                                        <div class="menu-item">
                                            <span>Korean Tacos</span>
                                            <span>$9.00</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Banh Mi</span>
                                            <span>$7.50</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Loaded Nachos</span>
                                            <span>$8.25</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-info">
                            <h4>Street Food</h4>
                            <p>Perfect for food trucks, street food vendors, and casual eateries. Features vibrant colors and urban-inspired design.</p>
                            <div class="theme-features">
                                <span class="feature">Urban Style</span>
                                <span class="feature">Food Truck</span>
                                <span class="feature">Event Calendar</span>
                                <span class="feature">Social Media</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Specialty & Niche -->
            <div class="theme-category">
                <h3 class="category-title">Specialty & Niche</h3>
                <div class="themes-grid">
                    <div class="theme-card" data-theme="organic">
                        <div class="theme-preview">
                            <div class="preview-header organic-header">
                                <div class="preview-nav">
                                    <div class="preview-logo">Green Garden</div>
                                    <div class="preview-menu">
                                        <span>Menu</span>
                                        <span>Farm</span>
                                        <span>Sustainability</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-content organic-content">
                                <h4>Farm-to-Table Fresh</h4>
                                <p>{'Organic ingredients sourced directly from local farms.'}</p>
                                <div class="preview-menu-section">
                                    <h5>Seasonal Menu</h5>
                                    <div class="menu-items">
                                        <div class="menu-item">
                                            <span>Harvest Salad</span>
                                            <span>$14</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Quinoa Bowl</span>
                                            <span>$16</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Green Smoothie</span>
                                            <span>$8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-info">
                            <h4>Organic & Healthy</h4>
                            <p>Designed for health-focused restaurants, organic cafes, and farm-to-table establishments. Features natural colors and clean design.</p>
                            <div class="theme-features">
                                <span class="feature">Natural Colors</span>
                                <span class="feature">Sustainability</span>
                                <span class="feature">Seasonal Menu</span>
                                <span class="feature">Farm Info</span>
                            </div>
                        </div>
                    </div>

                    <div class="theme-card" data-theme="traditional">
                        <div class="theme-preview">
                            <div class="preview-header traditional-header">
                                <div class="preview-nav">
                                    <div class="preview-logo">Nonna\\'s Kitchen</div>
                                    <div class="preview-menu">
                                        <span>Menu</span>
                                        <span>Story</span>
                                        <span>Catering</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-content traditional-content">
                                <h4>Authentic Italian Cuisine</h4>
                                <p>{'Traditional recipes passed down through generations.'}</p>
                                <div class="preview-menu-section">
                                    <h5>Pasta & Pizza</h5>
                                    <div class="menu-items">
                                        <div class="menu-item">
                                            <span>Spaghetti Carbonara</span>
                                            <span>$18</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Margherita Pizza</span>
                                            <span>$16</span>
                                        </div>
                                        <div class="menu-item">
                                            <span>Lasagna</span>
                                            <span>$20</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-info">
                            <h4>Traditional Italian</h4>
                            <p>Classic design for traditional restaurants and ethnic cuisines. Features warm colors and family-oriented messaging.</p>
                            <div class="theme-features">
                                <span class="feature">Classic Design</span>
                                <span class="feature">Family Story</span>
                                <span class="feature">Catering Menu</span>
                                <span class="feature">Traditional Colors</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Simple, Transparent Pricing</h2>
                <p class="section-subtitle">
                    Choose the plan that works best for your restaurant. All plans include hosting, 
                    SSL certificate, and 24/7 support.
                </p>
            </div>
            
            <div class="pricing-grid">
                <div class="pricing-card">
                    <div class="pricing-header">
                        <h3>Starter</h3>
                        <div class="price">
                            <span class="currency">$</span>
                            <span class="amount">19</span>
                            <span class="period">/month</span>
                        </div>
                    </div>
                    <div class="pricing-features">
                        <div class="feature">✓ Professional website</div>
                        <div class="feature">✓ Mobile responsive design</div>
                        <div class="feature">✓ Menu management</div>
                        <div class="feature">✓ Contact forms</div>
                        <div class="feature">✓ Basic analytics</div>
                        <div class="feature">✓ SSL certificate</div>
                    </div>
                    <a href="/auth/google" class="btn btn-outline btn-full">Start Free Trial</a>
                </div>

                <div class="pricing-card featured">
                    <div class="pricing-badge">Most Popular</div>
                    <div class="pricing-header">
                        <h3>Professional</h3>
                        <div class="price">
                            <span class="currency">$</span>
                            <span class="amount">39</span>
                            <span class="period">/month</span>
                        </div>
                    </div>
                    <div class="pricing-features">
                        <div class="feature">✓ Everything in Starter</div>
                        <div class="feature">✓ Online ordering system</div>
                        <div class="feature">✓ Reservation system</div>
                        <div class="feature">✓ Photo gallery</div>
                        <div class="feature">✓ Social media integration</div>
                        <div class="feature">✓ Advanced analytics</div>
                        <div class="feature">✓ Custom domain</div>
                    </div>
                    <a href="/auth/google" class="btn btn-primary btn-full">Start Free Trial</a>
                </div>

                <div class="pricing-card">
                    <div class="pricing-header">
                        <h3>Enterprise</h3>
                        <div class="price">
                            <span class="currency">$</span>
                            <span class="amount">79</span>
                            <span class="period">/month</span>
                        </div>
                    </div>
                    <div class="pricing-features">
                        <div class="feature">✓ Everything in Professional</div>
                        <div class="feature">✓ Multiple locations</div>
                        <div class="feature">✓ Staff management</div>
                        <div class="feature">✓ Inventory tracking</div>
                        <div class="feature">✓ Custom integrations</div>
                        <div class="feature">✓ Priority support</div>
                        <div class="feature">✓ White-label options</div>
                    </div>
                    <a href="/auth/google" class="btn btn-outline btn-full">Start Free Trial</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
        <div class="container">
            <div class="contact-content">
                <div class="contact-info">
                    <h2>Ready to Get Started?</h2>
                    <p>
                        Join thousands of restaurants already using RestaurantBuilder to create 
                        beautiful websites and grow their business online.
                    </p>
                    
                    <div class="contact-features">
                        <div class="contact-feature">
                            <div class="feature-icon">🚀</div>
                            <div class="feature-text">
                                <h4>Quick Setup</h4>
                                <p>Get your website live in under 30 minutes with our intuitive builder.</p>
                            </div>
                        </div>
                        
                        <div class="contact-feature">
                            <div class="feature-icon">📱</div>
                            <div class="feature-text">
                                <h4>Mobile Optimized</h4>
                                <p>All themes are fully responsive and look great on any device.</p>
                            </div>
                        </div>
                        
                        <div class="contact-feature">
                            <div class="feature-icon">🎨</div>
                            <div class="feature-text">
                                <h4>Easy Customization</h4>
                                <p>Customize colors, fonts, and layouts without any coding knowledge.</p>
                            </div>
                        </div>
                        
                        <div class="contact-feature">
                            <div class="feature-icon">💬</div>
                            <div class="feature-text">
                                <h4>24/7 Support</h4>
                                <p>Our team is here to help you succeed with dedicated support.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="contact-form">
                    <form class="form">
                        <div class="form-group">
                            <input type="text" placeholder="Restaurant Name" required>
                        </div>
                        <div class="form-group">
                            <input type="email" placeholder="Email Address" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" placeholder="Phone Number">
                        </div>
                        <div class="form-group">
                            <select required>
                                <option value="">Select Business Type</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="cafe">Cafe</option>
                                <option value="fastfood">Fast Food</option>
                                <option value="foodtruck">Food Truck</option>
                                <option value="bakery">Bakery</option>
                                <option value="bar">Bar/Pub</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Start Free Trial</button>
                        <p style="text-align: center; margin-top: var(--space-4); color: var(--gray-600); font-size: 0.875rem;">
                            No credit card required • 14-day free trial
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>RestaurantBuilder</h3>
                    <p>
                        The easiest way to create professional restaurant websites. 
                        Trusted by thousands of restaurants worldwide.
                    </p>
                </div>
                
                <div class="footer-column">
                    <h4>Product</h4>
                    <a href="#themes">Themes</a>
                    <a href="#pricing">Pricing</a>
                    <a href="/auth/google">Sign Up</a>
                    <a href="/dashboard">Dashboard</a>
                </div>
                
                <div class="footer-column">
                    <h4>Support</h4>
                    <a href="#contact">Contact Us</a>
                    <a href="#">Help Center</a>
                    <a href="#">Documentation</a>
                    <a href="#">Status</a>
                </div>
                
                <div class="footer-column">
                    <h4>Company</h4>
                    <a href="#">About</a>
                    <a href="#">Blog</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 RestaurantBuilder. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="/js/main.js"></script>
</body>
</html>

// Main JavaScript for API Marketplace

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    init3DEffects();
    initCardInteractions();
    initFilterButtons();
    initFilterToggle();
    initServiceFilterToggle();
    initCopyButtons();
    initChart();
    initAnimations();
    initTabView();
    initMobileNav();
    initDropdownNav();
    initDashboardSidebar();
});

// Dark Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const html = document.documentElement;
    const body = document.body;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    if (body) {
        body.setAttribute('data-theme', savedTheme);
    }
    
    // Update toggle state
    function updateToggleState(theme) {
        const toggles = [themeToggle, themeToggleMobile].filter(Boolean);
        toggles.forEach(toggle => {
            const icon = toggle.querySelector('.theme-toggle-icon');
            if (icon) {
                if (theme === 'dark') {
                    toggle.classList.add('active');
                    icon.textContent = '☀️';
                } else {
                    toggle.classList.remove('active');
                    icon.textContent = '🌙';
                }
            }
        });
    }
    
    updateToggleState(savedTheme);
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        if (body) {
            body.setAttribute('data-theme', newTheme);
        }
        localStorage.setItem('theme', newTheme);
        updateToggleState(newTheme);
    }
    
    // Add event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
}

// 3D Card Effects
function init3DEffects() {
    const cards = document.querySelectorAll('.card-3d, .api-card-3d');

    cards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            const inner = card.querySelector('.card-inner, .api-card-inner');
            if (inner) {
                inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            }
        });

        card.addEventListener('mouseleave', function () {
            const inner = card.querySelector('.card-inner, .api-card-inner');
            if (inner) {
                inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            }
        });
    });
}

// Card Interactions
function initCardInteractions() {
    const cards = document.querySelectorAll('.feature-card, .dashboard-stat-card, .dashboard-action-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// Filter Buttons
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'ripple 0.6s ease-out';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Filter Toggle (Mobile)
function initFilterToggle() {
    const filterToggle = document.getElementById('filterToggle');
    const filterContainer = document.getElementById('filterContainer');
    const filterToggleIcon = document.getElementById('filterToggleIcon');

    if (!filterToggle || !filterContainer) return;

    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth < 768;
    }

    // Toggle filter visibility
    function toggleFilter() {
        if (isMobile()) {
            const isOpen = !filterContainer.classList.contains('hidden');

            if (isOpen) {
                filterContainer.classList.add('hidden');
                if (filterToggleIcon) {
                    filterToggleIcon.style.transform = 'rotate(0deg)';
                }
            } else {
                filterContainer.classList.remove('hidden');
                if (filterToggleIcon) {
                    filterToggleIcon.style.transform = 'rotate(180deg)';
                }
            }
        }
    }

    // Handle window resize - ensure desktop always shows filters
    function handleResize() {
        if (!isMobile()) {
            // On desktop, ensure filters are visible (md:block class handles this)
            filterContainer.classList.remove('hidden');
            if (filterToggleIcon) {
                filterToggleIcon.style.transform = 'rotate(180deg)';
            }
        }
    }

    // Initial setup - filters hidden on mobile by default (handled by Tailwind classes)
    if (isMobile() && filterToggleIcon) {
        filterToggleIcon.style.transform = 'rotate(0deg)';
    }

    // Toggle button click
    filterToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleFilter();
    });

    // Close filter when clicking outside (mobile only)
    document.addEventListener('click', function (e) {
        if (isMobile()) {
            if (filterContainer && !filterContainer.contains(e.target) && !filterToggle.contains(e.target)) {
                if (!filterContainer.classList.contains('hidden')) {
                    filterContainer.classList.add('hidden');
                    if (filterToggleIcon) {
                        filterToggleIcon.style.transform = 'rotate(0deg)';
                    }
                }
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);
}

// Service Filter Toggle (Mobile)
function initServiceFilterToggle() {
    const serviceFilterToggle = document.getElementById('serviceFilterToggle');
    const serviceFilterContainer = document.getElementById('serviceFilterContainer');
    const serviceFilterToggleIcon = document.getElementById('serviceFilterToggleIcon');

    if (!serviceFilterToggle || !serviceFilterContainer) return;

    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth < 768;
    }

    // Toggle filter visibility
    function toggleFilter() {
        if (isMobile()) {
            const isOpen = !serviceFilterContainer.classList.contains('hidden');

            if (isOpen) {
                serviceFilterContainer.classList.add('hidden');
                if (serviceFilterToggleIcon) {
                    serviceFilterToggleIcon.style.transform = 'rotate(0deg)';
                }
            } else {
                serviceFilterContainer.classList.remove('hidden');
                if (serviceFilterToggleIcon) {
                    serviceFilterToggleIcon.style.transform = 'rotate(180deg)';
                }
            }
        }
    }

    // Handle window resize - ensure desktop always shows filters
    function handleResize() {
        if (!isMobile()) {
            // On desktop, ensure filters are visible (md:block class handles this)
            serviceFilterContainer.classList.remove('hidden');
            if (serviceFilterToggleIcon) {
                serviceFilterToggleIcon.style.transform = 'rotate(180deg)';
            }
        }
    }

    // Initial setup - filters hidden on mobile by default (handled by Tailwind classes)
    if (isMobile() && serviceFilterToggleIcon) {
        serviceFilterToggleIcon.style.transform = 'rotate(0deg)';
    }

    // Toggle button click
    serviceFilterToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleFilter();
    });

    // Close filter when clicking outside (mobile only)
    document.addEventListener('click', function (e) {
        if (isMobile()) {
            if (serviceFilterContainer && !serviceFilterContainer.contains(e.target) && !serviceFilterToggle.contains(e.target)) {
                if (!serviceFilterContainer.classList.contains('hidden')) {
                    serviceFilterContainer.classList.add('hidden');
                    if (serviceFilterToggleIcon) {
                        serviceFilterToggleIcon.style.transform = 'rotate(0deg)';
                    }
                }
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);
}

// Copy to Clipboard
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('code');

            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.background = 'rgba(16, 185, 129, 0.3)';
                    this.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                    this.style.color = '#10b981';

                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = 'rgba(59, 130, 246, 0.2)';
                        this.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                        this.style.color = '#60a5fa';
                    }, 2000);
                });
            }
        });
    });
}

// Chart Initialization (Simple Canvas Chart)
function initChart() {
    const canvas = document.getElementById('usageChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Sample data
    const data = [120, 190, 300, 250, 180, 290, 350, 280, 320, 400, 380, 450];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const maxValue = Math.max(...data);
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);

    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        ctx.lineTo(x, y);
    });

    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw points
    ctx.fillStyle = '#10b981';
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#10b981';
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';

    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        ctx.fillText(labels[index], x, canvas.height - padding + 20);
    });
}

// Initialize Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.card-3d, .api-card-3d, .feature-card, .details-section-card, .dashboard-stat-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const toggleButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeButton = document.getElementById('mobileMenuClose');

    if (!toggleButton || !mobileMenu) return;

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        toggleButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.add('hidden');
        toggleButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    toggleButton.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    if (closeButton) {
        closeButton.addEventListener('click', function (e) {
            e.stopPropagation();
            closeMenu();
        });
    }

    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 900 && !mobileMenu.classList.contains('hidden')) {
            closeMenu();
        }
    });

    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Don't close menu if clicking on a dropdown parent link
            if (!link.classList.contains('has-dropdown')) {
                closeMenu();
            }
        });
    });
}

// Dropdown Navigation Functionality
function initDropdownNav() {
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    let isMobile = window.innerWidth <= 899;
    let dropdownTimeout = null;

    if (dropdownItems.length === 0) return;

    dropdownItems.forEach(item => {
        item.classList.remove('active');
    });

    // Click functionality (desktop & mobile)
    dropdownItems.forEach(item => {
        const dropdownLink = item.querySelector('.nav-link.has-dropdown');
        const dropdownMenu = item.querySelector('.nav-dropdown');

        if (dropdownLink && dropdownMenu) {
            dropdownLink.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                item.classList.toggle('active');
            });
        }
    });

    // Hover functionality (desktop only)
    if (!isMobile) {
        dropdownItems.forEach(item => {
            let hoverTimeout = null;

            item.addEventListener('mouseenter', function () {
                clearTimeout(hoverTimeout);
                clearTimeout(dropdownTimeout);
                item.classList.add('active');
            });

            item.addEventListener('mouseleave', function () {
                hoverTimeout = setTimeout(() => {
                    item.classList.remove('active');
                }, 150);
            });
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-item-dropdown')) {
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        const newIsMobile = window.innerWidth <= 899;
        if (newIsMobile !== isMobile) {
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
            isMobile = newIsMobile;
        }
    });

    // Active link detection (mark as active but don't auto-open dropdown)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');

            // Mark parent link as active for styling, but don't auto-open dropdown
            const dropdownItem = link.closest('.nav-item-dropdown');
            if (dropdownItem) {
                const parentLink = dropdownItem.querySelector('.nav-link.has-dropdown');
                if (parentLink) {
                    parentLink.classList.add('active');
                    // Removed auto-opening dropdown on page load
                    // Dropdown will only open on click/hover
                }
            }
        }
    });
}


// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


// Search functionality (if search input exists)
const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
if (searchInput) {
    searchInput.addEventListener('focus', function () {
        this.style.borderColor = '#818cf8';
        this.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
    });

    searchInput.addEventListener('blur', function () {
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        this.style.boxShadow = 'none';
    });
}

// Tab View Functionality
function initTabView() {
    // Get tab buttons (only buttons with data-tab attribute, not anchor links)
    const allTabElements = document.querySelectorAll('.tab-btn, .tab-menu-item');
    const tabButtons = Array.from(allTabElements).filter(el => {
        // Only include buttons with data-tab attribute (exclude anchor tags)
        return el.hasAttribute('data-tab') && el.tagName === 'BUTTON';
    });
    const tabContents = document.querySelectorAll('.tab-content');
    const tabMenuToggle = document.getElementById('tabMenuToggle');
    const mobileTabMenu = document.getElementById('mobileTabMenu');
    const activeTabName = document.getElementById('activeTabName');
    const toggleIcon = document.getElementById('toggleIcon');
    const hamburgerIcon = document.getElementById('hamburgerIcon');

    // Check if tab view elements exist
    if (tabButtons.length === 0 || tabContents.length === 0) {
        return; // Tab view not on this page
    }

    // Dynamically get tab names from DOM
    const tabNames = {};
    tabButtons.forEach(btn => {
        const tabId = btn.getAttribute('data-tab');
        if (tabId) {
            // Get text content from button (for mobile menu items, get the span text)
            const textElement = btn.querySelector('span:last-child') || btn;
            const tabText = textElement.textContent.trim();
            tabNames[tabId] = tabText;
        }
    });

    // Function to switch tabs
    function switchTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        const selectedTab = document.getElementById(`tab-${tabId}`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Add active class to clicked button
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            }
        });

        // Keep menu button text as "Menu" since it now contains all navigation
        // The activeTabName will remain as "Menu" for the hamburger menu

        // Close mobile menu if open
        if (mobileTabMenu && !mobileTabMenu.classList.contains('hidden')) {
            if (tabMenuToggle && toggleIcon) {
                mobileTabMenu.classList.add('hidden');
                tabMenuToggle.classList.remove('active');
                tabMenuToggle.setAttribute('aria-expanded', 'false');
                toggleIcon.style.transform = 'rotate(0deg)';
                // Reset hamburger icon
                if (hamburgerIcon) {
                    const lines = hamburgerIcon.querySelectorAll('span');
                    if (lines.length === 3) {
                        lines[0].style.transform = 'rotate(0deg) translateY(0)';
                        lines[0].style.opacity = '1';
                        lines[1].style.opacity = '1';
                        lines[2].style.transform = 'rotate(0deg) translateY(0)';
                        lines[2].style.opacity = '1';
                    }
                }
            }
        }
    }

    // Add click event listeners to tab buttons (only buttons, not anchor tags)
    tabButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                switchTab(tabId);
            }
        });
    });

    // Also add listeners to tab-menu-item buttons in mobile menu
    if (mobileTabMenu) {
        const mobileTabButtons = mobileTabMenu.querySelectorAll('button.tab-menu-item[data-tab]');
        mobileTabButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                if (tabId) {
                    switchTab(tabId);
                }
            });
        });
    }

    // Mobile menu toggle
    if (tabMenuToggle && mobileTabMenu) {
        function openTabMenu() {
            mobileTabMenu.classList.remove('hidden');
            tabMenuToggle.classList.add('active');
            tabMenuToggle.setAttribute('aria-expanded', 'true');
            if (toggleIcon) {
                toggleIcon.style.transform = 'rotate(180deg)';
            }
            // Animate hamburger to X
            if (hamburgerIcon) {
                const lines = hamburgerIcon.querySelectorAll('span');
                if (lines.length === 3) {
                    lines[0].style.transform = 'rotate(45deg) translateY(0.375rem)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translateY(-0.375rem)';
                }
            }
        }

        function closeTabMenu() {
            mobileTabMenu.classList.add('hidden');
            tabMenuToggle.classList.remove('active');
            tabMenuToggle.setAttribute('aria-expanded', 'false');
            if (toggleIcon) {
                toggleIcon.style.transform = 'rotate(0deg)';
            }
            // Reset hamburger icon
            if (hamburgerIcon) {
                const lines = hamburgerIcon.querySelectorAll('span');
                if (lines.length === 3) {
                    lines[0].style.transform = 'rotate(0deg) translateY(0)';
                    lines[0].style.opacity = '1';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'rotate(0deg) translateY(0)';
                    lines[2].style.opacity = '1';
                }
            }
        }

        function toggleTabMenu() {
            const isOpen = !mobileTabMenu.classList.contains('hidden');
            if (isOpen) {
                closeTabMenu();
            } else {
                openTabMenu();
            }
        }

        // Initial state - icon should point down
        if (toggleIcon) {
            toggleIcon.style.transform = 'rotate(0deg)';
        }
        // Initial state - hamburger icon
        if (hamburgerIcon) {
            const lines = hamburgerIcon.querySelectorAll('span');
            if (lines.length === 3) {
                lines[0].style.transform = 'rotate(0deg) translateY(0)';
                lines[0].style.opacity = '1';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'rotate(0deg) translateY(0)';
                lines[2].style.opacity = '1';
            }
        }

        tabMenuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleTabMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (mobileTabMenu && !mobileTabMenu.contains(e.target) && !tabMenuToggle.contains(e.target)) {
                if (!mobileTabMenu.classList.contains('hidden')) {
                    closeTabMenu();
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !mobileTabMenu.classList.contains('hidden')) {
                closeTabMenu();
            }
        });

        // Prevent menu from closing when clicking inside it (except for navigation links)
        if (mobileTabMenu) {
            mobileTabMenu.addEventListener('click', function (e) {
                // If clicking on a navigation link (anchor tag), close the menu
                const link = e.target.closest('a');
                if (link) {
                    closeTabMenu();
                } else {
                    // For tab buttons, let the switchTab function handle closing
                    e.stopPropagation();
                }
            });
        }

        // Close menu when navigation links are clicked
        if (mobileTabMenu) {
            const navLinks = mobileTabMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function () {
                    closeTabMenu();
                });
            });
        }

        // Note: Menu closing is handled in switchTab function, no need to duplicate here
    }

    // Set initial active tab (only buttons, not anchor tags)
    const initialTab = document.querySelector('.tab-btn.active') || document.querySelector('button.tab-menu-item.active[data-tab]');
    if (initialTab && initialTab.tagName === 'BUTTON') {
        const initialTabId = initialTab.getAttribute('data-tab');
        if (initialTabId) {
            switchTab(initialTabId);
        }
    } else if (tabButtons.length > 0) {
        // Default to first tab if no active tab found
        const firstTab = tabButtons[0];
        const firstTabId = firstTab.getAttribute('data-tab');
        if (firstTabId) {
            switchTab(firstTabId);
        }
    }
}

// Dashboard Sidebar Toggle
function initDashboardSidebar() {
    const sidebar = document.getElementById('dashboardSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (!sidebar) return; // Sidebar not on this page

    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add('show');
            sidebar.classList.remove('-translate-x-full');
            if (sidebarOverlay) {
                sidebarOverlay.classList.add('show');
            }
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('show');
            sidebar.classList.add('-translate-x-full');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('show');
            }
            document.body.style.overflow = '';
        }
    }

    function toggleSidebar() {
        const isOpen = sidebar.classList.contains('show');
        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // Toggle button (mobile)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Close button (mobile)
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function (e) {
            e.stopPropagation();
            closeSidebar();
        });
    }

    // Overlay click to close (mobile)
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function () {
            closeSidebar();
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            closeSidebar();
        }
    });

    // Handle window resize - auto-close on mobile when resizing to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024) {
            // On desktop, ensure sidebar is visible (handled by CSS)
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('show');
            }
            document.body.style.overflow = '';
        } else {
            // On mobile, ensure sidebar is closed by default
            if (sidebar.classList.contains('show')) {
                closeSidebar();
            }
        }
    });

    // Close sidebar when clicking on nav items (mobile only)
    if (window.innerWidth < 1024) {
        const navItems = sidebar.querySelectorAll('.dashboard-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function () {
                // Only close if it's not a placeholder link
                if (this.getAttribute('href') === '#') {
                    // Prevent default and show a message or do nothing
                    // For now, just close the sidebar
                    setTimeout(() => {
                        closeSidebar();
                    }, 300);
                } else {
                    closeSidebar();
                }
            });
        });
    }
}

// Header JavaScript Functions
document.addEventListener('DOMContentLoaded', function() {

    // Search functionality
    const searchIcon = document.querySelector('.fas.fa-search');
    if (searchIcon) {
        searchIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            showSearchModal();
        });
    }

    // Cart icon click handler
    const cartIcon = document.querySelector('.fas.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/cart';
        });
    }

    // Header visibility on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.navbar');

    if (header) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
                header.style.transition = 'transform 0.3s ease-in-out';
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
                header.style.transition = 'transform 0.3s ease-in-out';
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    // Initialize header components
    initializeHeaderButtons();
    highlightCurrentPage();
});

// Initialize header buttons visibility
function initializeHeaderButtons() {
    // Ensure login/signup buttons are visible
    const loginBtn = document.querySelector('a[href="/login"]');
    const signupBtn = document.querySelector('a[href="/join"]');

    if (loginBtn) {
        loginBtn.style.display = 'inline-block';
        loginBtn.style.visibility = 'visible';
        console.log('Login button found and made visible');
    } else {
        console.warn('Login button not found');
    }

    if (signupBtn) {
        signupBtn.style.display = 'inline-block';
        signupBtn.style.visibility = 'visible';
        console.log('Signup button found and made visible');
    } else {
        console.warn('Signup button not found');
    }

    // Ensure the right side container is visible
    const rightContainer = document.querySelector('.d-flex.align-items-center');
    if (rightContainer) {
        rightContainer.style.display = 'flex';
        rightContainer.style.visibility = 'visible';
        console.log('Right container found and made visible');
    }
}

// Search modal function
function showSearchModal() {
    const searchTerm = prompt('검색어를 입력하세요:');
    if (searchTerm && searchTerm.trim() !== '') {
        window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
}

// Header effects: Underline and active link styling
document.addEventListener("DOMContentLoaded", () => {
    const mainMenuContainer = document.querySelector('.main-menu-container');
    const subMenuPanel = document.querySelector('.sub-menu-panel');
    const horizontalUnderline = document.getElementById('horizontal-underline');
    const mainMenuItems = document.querySelectorAll('.main-menu > li > a');
    let activeLink = null;
    let hidePanelTimeout;

    // Function to move the underline to the target element
    function moveUnderline(target) {
        if (!target || !horizontalUnderline) return;

        const targetRect = target.getBoundingClientRect();
        const menuRect = target.closest('.main-menu').getBoundingClientRect();

        const newLeft = targetRect.left - menuRect.left;
        const newWidth = targetRect.width;
        const newTop = targetRect.bottom - menuRect.top - 5; // Position it just below the main menu item

        horizontalUnderline.style.left = `${newLeft}px`;
        horizontalUnderline.style.width = `${newWidth}px`;
        horizontalUnderline.style.opacity = '1';
        horizontalUnderline.style.top = `${newTop}px`;
    }

    // Function to set the visual style for the active link
    function setActiveStyles(target) {
        // First, reset styles of the *previously* active link if it exists
        if (activeLink && activeLink !== target) {
            activeLink.style.color = '';
            activeLink.style.fontWeight = '';
        }

        // Apply styles to the new active target
        if (target) {
            target.style.color = '#ff6b6b';
            target.style.fontWeight = 'bold';
            moveUnderline(target);
        }
    }

    // Function to show the sub-menu panel
    function showSubMenuPanel() {
        clearTimeout(hidePanelTimeout);
        if (subMenuPanel && mainMenuContainer) {
            const mainMenuBottom = document.querySelector('.main-menu').getBoundingClientRect().bottom;
            const mainMenuContainerTop = mainMenuContainer.getBoundingClientRect().top;
            subMenuPanel.style.top = `${mainMenuBottom - mainMenuContainerTop}px`;
            const panelContentHeight = subMenuPanel.scrollHeight;
            subMenuPanel.style.maxHeight = `${panelContentHeight}px`;
            subMenuPanel.style.opacity = '1';
            subMenuPanel.style.visibility = 'visible';
        }
    }

    // Function to hide the sub-menu panel with a delay
    function hideSubMenuPanel() {
        if (subMenuPanel) {
            hidePanelTimeout = setTimeout(() => {
                subMenuPanel.style.maxHeight = '0';
                subMenuPanel.style.opacity = '0';
                subMenuPanel.style.visibility = 'hidden';
                if (activeLink) {
                    setActiveStyles(activeLink); // Return underline to active link
                }
            }, 200); // 200ms delay
        }
    }

    // Initialize the menu state on page load
    function initialize() {
        const currentPath = window.location.pathname;
        let foundActive = false;

        // Determine the active link based on the current URL
        mainMenuItems.forEach(link => {
            try {
                if (new URL(link.href).pathname === currentPath) {
                    activeLink = link;
                    foundActive = true;
                }
            } catch (e) {
                // In case of invalid href, just ignore
            }
        });

        // If no specific page is matched, default to the first menu item
        if (!foundActive && mainMenuItems.length > 0) {
            activeLink = mainMenuItems[0];
        }

        // Apply the active styles
        if (activeLink) {
            // Use a small timeout to ensure the layout is fully calculated
            setTimeout(() => setActiveStyles(activeLink), 100);
        }

        // Add event listeners for showing/hiding the panel
        if (mainMenuContainer && subMenuPanel) {
            mainMenuContainer.addEventListener('mouseenter', showSubMenuPanel);
            mainMenuContainer.addEventListener('mouseleave', hideSubMenuPanel);
            subMenuPanel.addEventListener('mouseenter', showSubMenuPanel); // Keep panel open when mouse is over it
            subMenuPanel.addEventListener('mouseleave', hideSubMenuPanel); // Hide when mouse leaves panel
        }

        // Add click and mouseover listeners for main menu items
        mainMenuItems.forEach(item => {
            item.addEventListener("click", (e) => {
                activeLink = e.currentTarget;
                setActiveStyles(activeLink);
            });
            item.addEventListener("mouseover", (e) => {
                moveUnderline(e.currentTarget);
            });
        });

        // Add mouseover and mouseout listeners for sub-menu items
        const subMenuItems = document.querySelectorAll('.sub-menu li a');
        subMenuItems.forEach(item => {
            item.addEventListener("mouseover", (e) => {
                moveUnderline(e.currentTarget);
                e.currentTarget.style.color = '#ff6b6b'; // Change color on hover
            });
            item.addEventListener("mouseout", (e) => {
                e.currentTarget.style.color = ''; // Reset color on mouseout
                if (activeLink) {
                    moveUnderline(activeLink); // Return underline to active link
                }
            });
        });
    }

    initialize();
});

// Debug function to check header elements
function debugHeader() {
    console.log('=== Header Debug Info ===');
    console.log('Login button:', document.querySelector('a[href="/login"]'));
    console.log('Signup button:', document.querySelector('a[href="/join"]'));
    console.log('Right container:', document.querySelector('.d-flex.align-items-center'));
    console.log('All buttons:', document.querySelectorAll('.btn'));
    console.log('Navbar:', document.querySelector('.navbar'));
}

// Call debug function after page load
window.addEventListener('load', function() {
    setTimeout(debugHeader, 1000); // Wait 1 second after page load
});






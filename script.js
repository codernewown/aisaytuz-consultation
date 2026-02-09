// Lead Generation Landing Page Script
// Mobile-first optimized

// Configuration
const CONFIG = {
    telegramChannel: 'https://t.me/aisaytuz',
    countdown: {
        hours: 5,
        minutes: 15,
        seconds: 25
    }
};

// DOM Elements
const elements = {
    openFormBtn: document.getElementById('openFormBtn'),
    formModal: document.getElementById('formModal'),
    closeFormModal: document.getElementById('closeFormModal'),
    leadForm: document.getElementById('leadForm'),
    successModal: document.getElementById('successModal'),
    telegramBtn: document.getElementById('telegramBtn'),
    hoursEl: document.getElementById('hours'),
    minutesEl: document.getElementById('minutes'),
    secondsEl: document.getElementById('seconds'),
    userName: document.getElementById('userName'),
    userPhone: document.getElementById('userPhone')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    initCountdown();
    initFormModal();
    initForm();
    initPhoneMask();
    initAnimations();

    // Set Telegram channel link
    if (elements.telegramBtn) {
        elements.telegramBtn.href = CONFIG.telegramChannel;
    }
});

// Animations on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Form Modal
function initFormModal() {
    const { openFormBtn, formModal, closeFormModal } = elements;

    if (!openFormBtn || !formModal) return;

    // Open form modal
    openFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(formModal);
    });

    // Close form modal
    if (closeFormModal) {
        closeFormModal.addEventListener('click', () => {
            closeModal(formModal);
        });
    }

    // Close on outside click
    formModal.addEventListener('click', (e) => {
        if (e.target === formModal || e.target.classList.contains('modal-backdrop')) {
            closeModal(formModal);
        }
    });

    // Check for success modal close as well
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal || e.target.classList.contains('modal-backdrop')) {
                closeModal(successModal);
            }
        });
    }
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}


// Countdown Timer
function initCountdown() {
    // Reset timer on every page load to specific duration as requested
    const now = new Date().getTime();
    const duration = (CONFIG.countdown.hours * 60 * 60 * 1000) +
        (CONFIG.countdown.minutes * 60 * 1000) +
        (CONFIG.countdown.seconds * 1000);

    // Always start fresh from the config time when page is refreshed
    let endTime = now + duration;

    // Store for persistence during same session if needed, but logic requests specific start time on refresh
    // We will just run the countdown from the calculated endTime

    function updateCountdown() {
        const currentTime = new Date().getTime();
        const distance = endTime - currentTime;

        if (distance < 0) {
            // Restart if finished
            endTime = new Date().getTime() + duration;
            return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elements.hoursEl) elements.hoursEl.textContent = String(hours).padStart(2, '0');
        if (elements.minutesEl) elements.minutesEl.textContent = String(minutes).padStart(2, '0');
        if (elements.secondsEl) elements.secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Phone Input Mask
function initPhoneMask() {
    const phoneInput = elements.userPhone;
    if (!phoneInput) return;

    const prefix = '+998 ';

    phoneInput.addEventListener('focus', function () {
        if (!this.value) {
            this.value = prefix;
        }
    });

    phoneInput.addEventListener('input', function (e) {
        const value = this.value.replace(/\D/g, ''); // Remove non-digits
        const numberValue = value.startsWith('998') ? value.slice(3) : value;

        let formatted = prefix;

        if (numberValue.length > 0) formatted += numberValue.substring(0, 2) + ' ';
        if (numberValue.length > 2) formatted += numberValue.substring(2, 5) + ' ';
        if (numberValue.length > 5) formatted += numberValue.substring(5, 7) + ' ';
        if (numberValue.length > 7) formatted += numberValue.substring(7, 9);

        // Prevent deleting prefix
        if (this.value.length < prefix.length) {
            this.value = prefix;
        } else {
            this.value = formatted.trim();
        }
    });
}

// Form Handling
function initForm() {
    const { leadForm } = elements;
    if (!leadForm) return;

    leadForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nameInput = elements.userName;
        const phoneInput = elements.userPhone;
        const submitBtn = this.querySelector('.submit-btn');

        // Reset validation
        nameInput.classList.remove('error');
        phoneInput.classList.remove('error');

        // Validate Name
        if (nameInput.value.trim().length < 2) {
            nameInput.classList.add('error');
            nameInput.focus();
            return;
        }

        // Validate Phone (simple length check for +998 XX XXX XX XX format)
        if (phoneInput.value.length < 17) {
            phoneInput.classList.add('error');
            phoneInput.focus();
            return;
        }

        // Loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.classList.add('loading');
        // submitBtn.disabled = true;

        const leadData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            date: new Date().toLocaleString(),
            source: 'instagram_landing'
        };

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Save to local storage (mock backend)
            saveLead(leadData);

            // Success
            closeModal(elements.formModal);
            setTimeout(() => {
                openModal(elements.successModal);
            }, 300);

            // Reset
            leadForm.reset();
        } catch (error) {
            console.error(error);
            alert('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
        } finally {
            submitBtn.classList.remove('loading');
            // submitBtn.disabled = false;
        }
    });
}

function saveLead(data) {
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    leads.push(data);
    localStorage.setItem('leads', JSON.stringify(leads));
    console.log('Lead Saved:', data);
}

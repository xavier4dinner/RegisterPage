let getUserRegister = '';
let getRegisterPassword = '';
let getRole = '';
let identificationCard = null;
let userName = '';

const validation = {
    name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/
    },
    getUserRegister: {
        required: true,
        minLength: 3,
        pattern: /^[a-zA-Z0-9_]+$/
    },
    getRegisterPassword: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    },
    getRole: {
        required: true
    },
    identificationCard: {
        required: true,
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    }
};

function checkPasswordStrength(password) {
    console.log('Checking password:', password);
    
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    console.log('Requirements check:', {
        hasLength,
        hasUppercase,
        hasLowercase,
        hasNumber
    });

    const lengthReq = document.getElementById('length-req');
    const uppercaseReq = document.getElementById('uppercase-req');
    const lowercaseReq = document.getElementById('lowercase-req');
    const numberReq = document.getElementById('number-req');

    if (lengthReq) {
        lengthReq.className = hasLength ? 'requirement valid' : 'requirement invalid';
        console.log('Updated length requirement:', hasLength);
    } else {
        console.error('Length requirement element not found');
    }

    if (uppercaseReq) {
        uppercaseReq.className = hasUppercase ? 'requirement valid' : 'requirement invalid';
        console.log('Updated uppercase requirement:', hasUppercase);
    } else {
        console.error('Uppercase requirement element not found');
    }

    if (lowercaseReq) {
        lowercaseReq.className = hasLowercase ? 'requirement valid' : 'requirement invalid';
        console.log('Updated lowercase requirement:', hasLowercase);
    } else {
        console.error('Lowercase requirement element not found');
    }

    if (numberReq) {
        numberReq.className = hasNumber ? 'requirement valid' : 'requirement invalid';
        console.log('Updated number requirement:', hasNumber);
    } else {
        console.error('Number requirement element not found');
    }

    return hasLength && hasUppercase && hasLowercase && hasNumber;
}

function validateField(fieldName, value) {
    const rules = validation[fieldName];
    const errorElement = document.getElementById(`${fieldName === 'getUserRegister' ? 'username' : fieldName === 'getRegisterPassword' ? 'password' : fieldName === 'getRole' ? 'role' : fieldName === 'identificationCard' ? 'file' : fieldName}-error`);
    const inputElement = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    
    let isValid = true;
    let errorMessage = '';

    if (rules.required && (!value || value.trim() === '')) {
        isValid = false;
        errorMessage = `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
    } else if (value) {
        if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Must be at least ${rules.minLength} characters`;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            if (fieldName === 'name') {
                errorMessage = 'Name can only contain letters and spaces';
            } else if (fieldName === 'getUserRegister') {
                errorMessage = 'Username can only contain letters, numbers, and underscores';
            } else if (fieldName === 'getRegisterPassword') {
                errorMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
            }
        }
    }

    if (inputElement) {
        inputElement.classList.toggle('error', !isValid);
    }
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }

    return isValid;
}
function handleFileUpload() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');

    if (uploadBtn && fileInput) {            
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const errorElement = document.getElementById('file-error');
            
            if (file) {
                const rules = {
                    maxSize: 10 * 1024 * 1024,
                    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
                };
                let isValid = true;
                let errorMessage = '';

                if (file.size > rules.maxSize) {
                    isValid = false;
                    errorMessage = 'File size must be less than 10MB';
                } else if (!rules.allowedTypes.includes(file.type)) {
                    isValid = false;
                    errorMessage = 'Only PDF, JPG, JPEG, and PNG files are allowed';
                }

                if (isValid) {
                    identificationCard = file;

                    uploadBtn.innerHTML = `
                        <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        ${file.name}
                    `;
                    uploadBtn.style.backgroundColor = '#dcfce7';
                    uploadBtn.style.borderColor = '#16a34a';
                    uploadBtn.style.color = '#166534';
                    
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                } else {
                    if (errorElement) {
                        errorElement.textContent = errorMessage;
                    }
                    event.target.value = '';
                }
            }
        });
    }
}


function setupInputValidation() {
    const nameInput = document.getElementById('name');
    const usernameInput = document.getElementById('getUserRegister');
    const passwordInput = document.getElementById('getRegisterPassword');
    const roleSelect = document.getElementById('getRole');

    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            userName = e.target.value;
            validateField('name', e.target.value);
        });
    }

    if (usernameInput) {
        usernameInput.addEventListener('input', function(e) {
            getUserRegister = e.target.value;
            validateField('getUserRegister', e.target.value);
        });
    }

    if (passwordInput) {
        console.log('Password input found, adding event listener');
        passwordInput.addEventListener('input', function(e) {
            console.log('Password input event triggered with value:', e.target.value);
            getRegisterPassword = e.target.value;
            checkPasswordStrength(e.target.value);
            validateField('getRegisterPassword', e.target.value);
        });
    } else {
        console.error('Password input not found!');
    }

    if (roleSelect) {
        roleSelect.addEventListener('change', function(e) {
            getRole = e.target.value;
            validateField('getRole', e.target.value);
        });
    }
}

async function handleFormSubmission(event) {
    event.preventDefault();

    const isNameValid = validateField('name', userName);
    const isUsernameValid = validateField('getUserRegister', getUserRegister);
    const isPasswordValid = validateField('getRegisterPassword', getRegisterPassword);
    const isRoleValid = validateField('getRole', getRole);
    const isFileValid = identificationCard !== null;

    if (!isNameValid || !isUsernameValid || !isPasswordValid || !isRoleValid || !isFileValid) {
        alert('Please fill in all fields correctly');
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');

    if (submitBtn && submitText && submitLoading) {
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline-block';
    }

    try {
        // ito  yung no file 
        const userData = {
            name: userName,
            username: getUserRegister,
            password: getRegisterPassword,
            role: getRole
        };

        const userResponse = await fetch('http://localhost:3000/save-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!userResponse.ok) {
            const error = await userResponse.json();
            throw new Error(error.message || 'User registration failed');
        }

        // 2. ito yung upload
        const fileData = new FormData();
        fileData.append('file', identificationCard);

        const fileResponse = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: fileData
        });

        if (!fileResponse.ok) {
            const error = await fileResponse.json();
            throw new Error(error.message || 'File upload failed');
        }

        const successMessage = document.getElementById('success-message');
        const registerForm = document.getElementById('registerForm');
        if (successMessage && registerForm) {
            successMessage.style.display = 'block';
            registerForm.style.display = 'none';
        }
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 3000);

    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
    } finally {
        if (submitBtn && submitText && submitLoading) {
            submitBtn.disabled = false;
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
        }
    }
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

function initializeApp() {
    console.log('Initializing application...');
    
    setupInputValidation();
    handleFileUpload();
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleFormSubmission);
        console.log('Form submission handler added');
    } else {
        console.error('Register form not found!');
    }
    
    checkPasswordStrength('');
    
    console.log('Application initialized successfully');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function getRegistrationData() {
    return {
        name: userName,
        getUserRegister: getUserRegister,
        getRegisterPassword: getRegisterPassword,
        getRole: getRole,
        identificationCard: identificationCard
    };
}

window.goBack = goBack;
window.getRegistrationData = getRegistrationData;
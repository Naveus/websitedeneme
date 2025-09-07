// DOM Elements
const backBtn = document.querySelector('.back-btn');
const rejectBtn = document.querySelector('.reject-btn');
const submitBtn = document.querySelector('.submit-btn');
const siteTypeSelect = document.getElementById('siteType');
const budgetSelect = document.getElementById('budget');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const textArea = document.getElementById('details');

// Price calculation
let basePrice = 2000;

function calculatePrice() {
    let price = basePrice;
    
    // Site type multipliers
    const siteTypeMultipliers = {
        'basit': 1.0,
        'eticaret': 2.5,
        'kurumsal': 2.0,
        'portfolio': 1.2,
        'diger': 1.5
    };
    
    // Service additions
    const serviceAdditions = {
        'tasarim': 500,
        'gelistirme': 1500,
        'icerik': 300,
        'seo': 400,
        'bakim': 200
    };
    
    // Apply site type multiplier
    if (siteTypeSelect.value && siteTypeMultipliers[siteTypeSelect.value]) {
        price *= siteTypeMultipliers[siteTypeSelect.value];
    }
    
    // Add selected services
    checkboxes.forEach(checkbox => {
        if (checkbox.checked && serviceAdditions[checkbox.value]) {
            price += serviceAdditions[checkbox.value];
        }
    });
    
    return price;
}

function updatePriceDisplay() {
    const price = calculatePrice();
    const formattedPrice = price.toLocaleString('tr-TR');
    submitBtn.innerHTML = `Teklif ver (${formattedPrice} TL)`;
}

// Event Listeners
backBtn.addEventListener('click', () => {
    backBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        backBtn.style.transform = 'scale(1)';
        showMessage('Geri gidiliyor...', 'info');
    }, 150);
});

rejectBtn.addEventListener('click', () => {
    if (confirm('Bu teklifi reddetmek istediğinizden emin misiniz?')) {
        showMessage('Teklif reddedildi!', 'error');
        resetForm();
    }
});

submitBtn.addEventListener('click', () => {
    if (validateForm()) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Gönderildi!';
            submitBtn.style.background = '#229954';
            showMessage('Teklifiniz başarıyla gönderildi!', 'success');
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.background = '#27ae60';
                updatePriceDisplay();
            }, 3000);
        }, 2000);
    } else {
        showMessage('Lütfen tüm gerekli alanları doldurun!', 'warning');
    }
});

// Form validation
function validateForm() {
    const requiredFields = [siteTypeSelect, budgetSelect, textArea];
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#27ae60';
        }
    });
    
    return isValid;
}

// Reset form
function resetForm() {
    siteTypeSelect.value = '';
    document.getElementById('expertise').value = 'yok';
    document.getElementById('businessType').value = '';
    budgetSelect.value = '';
    textArea.value = '';
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    updatePriceDisplay();
}

// Message system
function showMessage(text, type) {
    // Remove existing message
    const existingMsg = document.querySelector('.message-popup');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create message
    const message = document.createElement('div');
    message.className = `message-popup message-${type}`;
    message.innerHTML = `
        <i class="fas ${getMessageIcon(type)}"></i>
        <span>${text}</span>
    `;
    
    // Add styles
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.7rem;
        z-index: 1000;
        animation: slideInFromRight 0.3s ease-out;
        border-left: 4px solid ${getMessageColor(type)};
        color: ${getMessageColor(type)};
        font-weight: 500;
    `;
    
    document.body.appendChild(message);
    
    // Auto remove
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'slideOutToRight 0.3s ease-in';
            setTimeout(() => message.remove(), 300);
        }
    }, 4000);
}

function getMessageIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getMessageColor(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    return colors[type] || colors.info;
}

// Real-time price updates
siteTypeSelect.addEventListener('change', updatePriceDisplay);
budgetSelect.addEventListener('change', updatePriceDisplay);
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updatePriceDisplay);
});

// Hover effects for question blocks
document.querySelectorAll('.question-block').forEach(block => {
    block.addEventListener('mouseenter', () => {
        block.style.transform = 'translateX(12px)';
        block.style.boxShadow = '0 8px 25px rgba(39, 174, 96, 0.15)';
    });
    
    block.addEventListener('mouseleave', () => {
        block.style.transform = 'translateX(8px)';
        block.style.boxShadow = '0 5px 20px rgba(39, 174, 96, 0.1)';
    });
});

// Add animation styles
const animationStyles = `
    @keyframes slideInFromRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutToRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updatePriceDisplay();
    showMessage('Sayfa yüklendi! Form doldurarak teklif alabilirsiniz.', 'success');
});
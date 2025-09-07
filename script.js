// DOM Elements
const backButton = document.querySelector('.back-button');
const btnSecondary = document.querySelector('.btn-secondary');
const btnPrimary = document.querySelector('.btn-primary');
const formGroups = document.querySelectorAll('.form-group');
const userAvatar = document.querySelector('.user-avatar');
const serviceForm = document.getElementById('serviceForm');

// Animation delays for form groups
formGroups.forEach((group, index) => {
    group.style.animationDelay = `${index * 0.1}s`;
});

// Back button functionality
backButton.addEventListener('click', () => {
    backButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        backButton.style.transform = 'scale(1)';
        showNotification('Geri gidiliyor...', 'info');
    }, 150);
});

// Secondary button (Reddet) functionality
btnSecondary.addEventListener('click', () => {
    showConfirmDialog(
        'Bu teklifi reddetmek istediğinizden emin misiniz?',
        () => {
            showNotification('Teklif reddedildi!', 'error');
            serviceForm.reset();
        }
    );
});

// Primary button (Teklif ver) functionality
btnPrimary.addEventListener('click', () => {
    if (!validateForm()) {
        showNotification('Lütfen tüm gerekli alanları doldurun!', 'warning');
        return;
    }
    
    const formData = getFormData();
    
    btnPrimary.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Teklif hazırlanıyor...';
    btnPrimary.disabled = true;
    
    setTimeout(() => {
        btnPrimary.innerHTML = '<i class="fas fa-check"></i> Teklif Gönderildi!';
        btnPrimary.style.background = '#27ae60';
        showNotification('Teklifiniz başarıyla gönderildi!', 'success');
        
        setTimeout(() => {
            btnPrimary.innerHTML = 'Teklif ver (Hesaplanıyor...)';
            btnPrimary.disabled = false;
            btnPrimary.style.background = '#2ecc71';
            updatePriceEstimate(formData);
        }, 3000);
    }, 2000);
});

// User avatar click functionality
userAvatar.addEventListener('click', () => {
    userAvatar.style.transform = 'scale(1.1) rotate(5deg)';
    setTimeout(() => {
        userAvatar.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
    showNotification('Kullanıcı profili!', 'info');
});

// Form validation function
function validateForm() {
    const requiredFields = serviceForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#2ecc71';
        }
    });
    
    return isValid;
}

// Get form data function
function getFormData() {
    const formData = new FormData(serviceForm);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    const checkboxes = serviceForm.querySelectorAll('input[type="checkbox"]:checked');
    const services = [];
    checkboxes.forEach(checkbox => {
        services.push(checkbox.value);
    });
    data.services = services;
    
    return data;
}

// Update price estimate based on form data
function updatePriceEstimate(data) {
    let basePrice = 2000;
    
    const priceModifiers = {
        siteType: {
            'basit-icerik': 1.0,
            'e-ticaret': 2.5,
            'kurumsal': 2.0,
            'portfolio': 1.2,
            'diger': 1.5
        },
        services: {
            'tasarim': 500,
            'gelistirme': 1500,
            'icerik': 300,
            'seo': 400,
            'bakim': 200
        }
    };
    
    if (data.siteType && priceModifiers.siteType[data.siteType]) {
        basePrice *= priceModifiers.siteType[data.siteType];
    }
    
    if (data.services && Array.isArray(data.services)) {
        data.services.forEach(service => {
            if (priceModifiers.services[service]) {
                basePrice += priceModifiers.services[service];
            }
        });
    }
    
    const formattedPrice = basePrice.toLocaleString('tr-TR');
    btnPrimary.innerHTML = `Teklif ver (${formattedPrice} TL)`;
}

// Real-time form updates
serviceForm.addEventListener('change', () => {
    const formData = getFormData();
    updatePriceEstimate(formData);
});

// Notification system
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Confirm dialog
function showConfirmDialog(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = `
        <div class="dialog">
            <div class="dialog-content">
                <h3>Onay</h3>
                <p>${message}</p>
                <div class="dialog-buttons">
                    <button class="btn-dialog-cancel">İptal</button>
                    <button class="btn-dialog-confirm">Evet</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.querySelector('.btn-dialog-cancel').addEventListener('click', () => {
        overlay.remove();
    });
    
    overlay.querySelector('.btn-dialog-confirm').addEventListener('click', () => {
        onConfirm();
        overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Add hover effects to form groups
formGroups.forEach(group => {
    group.addEventListener('mouseenter', () => {
        group.style.transform = 'translateX(5px)';
        group.style.boxShadow = '0 4px 15px rgba(46, 204, 113, 0.1)';
    });
    
    group.addEventListener('mouseleave', () => {
        group.style.transform = 'translateX(0)';
        group.style.boxShadow = 'none';
    });
});

// Add notification and dialog styles
const additionalStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    min-width: 300px;
}

.notification-success {
    border-left: 4px solid #2ecc71;
    color: #27ae60;
}

.notification-error {
    border-left: 4px solid #e74c3c;
    color: #c0392b;
}

.notification-warning {
    border-left: 4px solid #f39c12;
    color: #d68910;
}

.notification-info {
    border-left: 4px solid #3498db;
    color: #2980b9;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: auto;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.notification-close:hover {
    opacity: 1;
}

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    animation: fadeIn 0.2s ease-out;
}

.dialog {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    animation: scaleIn 0.2s ease-out;
}

.dialog h3 {
    margin-bottom: 1rem;
    color: #333;
}

.dialog p {
    margin-bottom: 2rem;
    color: #666;
    line-height: 1.5;
}

.dialog-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn-dialog-cancel,
.btn-dialog-confirm {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}

.btn-dialog-cancel {
    background: #f8f9fa;
    color: #666;
}

.btn-dialog-cancel:hover {
    background: #e9ecef;
}

.btn-dialog-confirm {
    background: #e74c3c;
    color: white;
}

.btn-dialog-confirm:hover {
    background: #c0392b;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.9);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    showNotification('Sayfa yüklendi! Form doldurarak teklif alabilirsiniz.', 'success');
    updatePriceEstimate({});
});

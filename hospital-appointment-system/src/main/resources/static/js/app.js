/**
 * PulseCare Healthcare Platform - Modern Client Interactivity & Design System Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initGlobalSearch();
    initPasswordToggles();
    initToasts();
});

// 1. Theme Management (Dark / Light Mode)
function initTheme() {
    const savedTheme = localStorage.getItem('pulsecare-theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcons(savedTheme);

    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('pulsecare-theme', target);
            updateThemeToggleIcons(target);
            showToast('Theme updated to ' + target.toUpperCase() + ' mode', 'info');
        });
    });
}

function updateThemeToggleIcons(theme) {
    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');
    if (theme === 'dark') {
        sunIcons.forEach(i => i.style.display = 'inline-block');
        moonIcons.forEach(i => i.style.display = 'none');
    } else {
        sunIcons.forEach(i => i.style.display = 'none');
        moonIcons.forEach(i => i.style.display = 'inline-block');
    }
}

// 2. Mobile Navigation & Sidebar Toggle
function initMobileNav() {
    const mobileBtn = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

// 3. Global Omnisearch (Ctrl+K)
function initGlobalSearch() {
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('omniSearchInput');
    const searchResults = document.getElementById('omniSearchResults');

    if (!searchModal) return;

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
        if (e.key === 'Escape' && searchModal.classList.contains('open')) {
            closeSearchModal();
        }
    });

    document.querySelectorAll('.open-search-trigger').forEach(btn => {
        btn.addEventListener('click', openSearchModal);
    });

    document.querySelectorAll('.close-search-trigger').forEach(btn => {
        btn.addEventListener('click', closeSearchModal);
    });

    function openSearchModal() {
        searchModal.classList.add('open');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 50);
        }
    }

    function closeSearchModal() {
        searchModal.classList.remove('open');
    }

    let debounceTimer;
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.trim();
            if (query.length < 2) {
                searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">Type at least 2 characters to search doctors, appointments, or departments...</div>';
                return;
            }

            debounceTimer = setTimeout(() => {
                fetch('/api/search?q=' + encodeURIComponent(query))
                    .then(res => res.json())
                    .then(data => {
                        let html = '';
                        if (data.doctors && data.doctors.length > 0) {
                            html += '<div style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--muted); margin: 10px 0 6px;">Doctors</div>';
                            data.doctors.forEach(doc => {
                                html += `<a href="${doc.url}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 6px; text-decoration: none;">
                                    <div>
                                        <div style="font-weight: 600; color: var(--text);">${doc.name}</div>
                                        <div style="font-size: 0.82rem; color: var(--muted);">${doc.specialization}</div>
                                    </div>
                                    <span class="btn btn-sm btn-outline-primary">View Profile</span>
                                </a>`;
                            });
                        }

                        if (data.appointments && data.appointments.length > 0) {
                            html += '<div style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--muted); margin: 14px 0 6px;">Appointments</div>';
                            data.appointments.forEach(apt => {
                                html += `<a href="${apt.url}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 6px; text-decoration: none;">
                                    <div>
                                        <div style="font-weight: 600; color: var(--text);">${apt.reference} — ${apt.patient}</div>
                                        <div style="font-size: 0.82rem; color: var(--muted);">Doctor: ${apt.doctor} • Date: ${apt.date}</div>
                                    </div>
                                    <span class="badge badge-${apt.status.toLowerCase()}">${apt.status}</span>
                                </a>`;
                            });
                        }

                        if (!html) {
                            html = '<div style="padding: 24px; text-align: center; color: var(--muted);">No matching clinical records or doctors found.</div>';
                        }
                        searchResults.innerHTML = html;
                    })
                    .catch(() => {
                        searchResults.innerHTML = '<div style="padding: 20px; color: var(--danger);">Error searching records.</div>';
                    });
            }, 250);
        });
    }
}

// 4. Password Visibility Toggles
function initPasswordToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
                } else {
                    input.type = 'password';
                    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
                }
            }
        });
    });
}

// 5. Toast Notifications
function initToasts() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        <div style="flex-shrink: 0;">${iconSvg}</div>
        <div style="flex: 1; font-size: 0.9rem; font-weight: 500; color: var(--text);">${message}</div>
        <button style="background: none; border: none; cursor: pointer; color: var(--muted); padding: 4px;" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

// 6. Generic Confirmation Modal
function confirmAction(message, onConfirm) {
    let backdrop = document.getElementById('genericConfirmModal');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'genericConfirmModal';
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="modal-dialog" style="max-width: 440px;">
                <div class="modal-header">
                    <h3 style="font-size: 1.15rem; color: var(--text);">Confirmation</h3>
                    <button type="button" class="btn-icon" style="background:none; border:none; cursor:pointer;" onclick="this.closest('.modal-backdrop').classList.remove('open')">✕</button>
                </div>
                <div class="modal-body" id="genericConfirmMsg" style="color: var(--text); font-size: 0.95rem;">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="this.closest('.modal-backdrop').classList.remove('open')">Cancel</button>
                    <button type="button" class="btn btn-danger" id="genericConfirmBtn">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);
    }

    document.getElementById('genericConfirmMsg').innerText = message;
    const confirmBtn = document.getElementById('genericConfirmBtn');
    
    // Replace listener cleanly
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.addEventListener('click', () => {
        backdrop.classList.remove('open');
        if (typeof onConfirm === 'function') onConfirm();
    });

    backdrop.classList.add('open');
}

/**
 * NexHR - Enterprise Employee Management Dashboard JavaScript
 * Handles Theme Switching, Collapsible Sidebar, Global Search, Modals, CSV Export & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initGlobalSearch();
  initNotifications();
  initModals();
  initEmployeeTableFilters();
  initToasts();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode with Persistence)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('nexhr_theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('nexhr_theme', newTheme);
    });
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon(false);
  }
}

function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById('themeIcon');
  if (!themeIcon) return;
  if (isDark) {
    // Sun icon for switching back to light
    themeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    // Moon icon for switching to dark
    themeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

/* ==========================================================================
   2. Collapsible Sidebar & Mobile Navigation
   ========================================================================== */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('sidebarOverlay');

  if (!sidebar) return;

  // Restore desktop collapsed state
  if (localStorage.getItem('nexhr_sidebar_collapsed') === 'true' && window.innerWidth > 900) {
    sidebar.classList.add('collapsed');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('nexhr_sidebar_collapsed', sidebar.classList.contains('collapsed'));
    });
  }

  if (mobileMenuBtn && overlay) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
  }
}

/* ==========================================================================
   3. Global Search (Feature C)
   ========================================================================== */
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('globalSearchResults');

  if (!searchInput || !dropdown) return;

  // Shortcut key Ctrl+K or / to focus search
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length < 1) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      return;
    }

    const matches = [];

    // Search in table rows or data attributes
    const rows = document.querySelectorAll('.employee-table-row, [data-emp-card]');
    rows.forEach(row => {
      const name = (row.dataset.name || '').toLowerCase();
      const code = (row.dataset.code || '').toLowerCase();
      const email = (row.dataset.email || '').toLowerCase();
      const dept = (row.dataset.dept || '').toLowerCase();
      const desig = (row.dataset.desig || '').toLowerCase();

      if (name.includes(query) || code.includes(query) || email.includes(query) || dept.includes(query) || desig.includes(query)) {
        matches.push({
          type: 'employee',
          title: row.dataset.name,
          subtitle: `${row.dataset.code || 'EMP'} • ${row.dataset.desig || 'Staff'} • ${row.dataset.dept || 'General'}`,
          action: () => handleProfileClick(row)
        });
      }
    });

    // Also search department cards if on departments page or common departments
    const depts = [
      { name: 'Engineering & IT', code: 'ENG', head: 'Alexander Pierce' },
      { name: 'Human Resources', code: 'HR', head: 'Sarah Jenkins' },
      { name: 'Finance & Accounts', code: 'FIN', head: 'David Vance' },
      { name: 'Product & Design', code: 'PRD', head: 'Emily Watson' },
      { name: 'Marketing & Sales', code: 'MKT', head: 'Carlos Rivera' },
      { name: 'Operations', code: 'OPS', head: 'Priya Patel' }
    ];

    depts.forEach(d => {
      if (d.name.toLowerCase().includes(query) || d.code.toLowerCase().includes(query)) {
        matches.push({
          type: 'department',
          title: `${d.name} (${d.code})`,
          subtitle: `Head: ${d.head} • Department`,
          url: '/departments'
        });
      }
    });

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No matching employees or departments found for "${escapeHtml(query)}"
        </div>
      `;
    } else {
      dropdown.innerHTML = matches.slice(0, 6).map((item, index) => `
        <div class="search-item" data-index="${index}" style="cursor: pointer;">
          <div>
            <div style="font-weight: 600; font-size: 0.88rem; color: var(--text-main);">${escapeHtml(item.title)}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(item.subtitle)}</div>
          </div>
          <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: var(--secondary-light); color: var(--secondary);">${item.type}</span>
        </div>
      `).join('');

      dropdown.querySelectorAll('.search-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-index'), 10);
          const item = matches[idx];
          dropdown.classList.remove('active');
          if (item.action) {
            item.action();
          } else if (item.url) {
            window.location.href = item.url;
          }
        });
      });
    }

    dropdown.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. Notifications (Feature D)
   ========================================================================== */
function initNotifications() {
  const notifBtn = document.getElementById('notificationsBtn');
  const dropdown = document.getElementById('notificationsDropdown');

  if (!notifBtn || !dropdown) return;

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

/* ==========================================================================
   5. Modals (Profile, Department, Confirmations)
   ========================================================================== */
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => closeModal(modal));
    }
  });
}

function openModal(modalEl) {
  if (modalEl) {
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalEl) {
  if (modalEl) {
    modalEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* Feature A: Employee Profile Modal Handlers */
function handleProfileClick(el) {
  const emp = {
    id: el.dataset.id,
    name: el.dataset.name,
    code: el.dataset.code,
    email: el.dataset.email,
    phone: el.dataset.phone,
    salary: el.dataset.salary,
    salaryFormatted: el.dataset.salaryFormatted,
    dept: el.dataset.dept,
    designation: el.dataset.desig,
    joiningDate: el.dataset.joiningDate,
    status: el.dataset.status,
    gender: el.dataset.gender,
    dateOfBirth: el.dataset.dob,
    address: el.dataset.address,
    initials: el.dataset.initials
  };
  showEmployeeProfileModal(emp);
}

function showEmployeeProfileModal(emp) {
  const modal = document.getElementById('employeeProfileModal');
  if (!modal) return;

  const initials = emp.initials || (emp.name ? emp.name.substring(0, 2).toUpperCase() : 'EM');
  const avatarEl = document.getElementById('modalProfileAvatar');
  if (avatarEl) avatarEl.textContent = initials;

  const setText = (id, val) => {
    const item = document.getElementById(id);
    if (item) item.textContent = val || '—';
  };

  setText('modalProfileName', emp.name);
  setText('modalProfileCode', emp.code || `EMP-${emp.id}`);
  setText('modalProfileDept', emp.dept || 'General');
  setText('modalProfileDesig', emp.designation || 'Staff');
  setText('modalProfileStatus', emp.status || 'Active');
  setText('modalProfileEmail', emp.email);
  setText('modalProfilePhone', emp.phone);
  setText('modalProfileSalary', emp.salaryFormatted || (emp.salary ? `$${Number(emp.salary).toLocaleString()}` : '—'));
  setText('modalProfileJoiningDate', emp.joiningDate || '2023-01-01');
  setText('modalProfileGender', emp.gender || 'Not specified');
  setText('modalProfileDob', emp.dateOfBirth || '—');
  setText('modalProfileAddress', emp.address || 'Corporate HQ');

  const editBtn = document.getElementById('modalProfileEditBtn');
  if (editBtn) {
    editBtn.href = `/employees/edit/${emp.id}`;
  }

  openModal(modal);
}

/* Feature 9: Delete Confirmation Handlers */
function handleDeleteEmpClick(btn) {
  confirmDeleteEmployee(btn.dataset.id, btn.dataset.name);
}

function confirmDeleteEmployee(id, name) {
  const modal = document.getElementById('deleteConfirmModal');
  if (!modal) {
    if (confirm(`Are you sure you want to delete employee "${name}"?`)) {
      window.location.href = `/employees/delete/${id}`;
    }
    return;
  }

  const nameEl = document.getElementById('deleteEmpName');
  if (nameEl) nameEl.textContent = name;

  const confirmBtn = document.getElementById('confirmDeleteBtn');
  if (confirmBtn) {
    confirmBtn.href = `/employees/delete/${id}`;
  }

  openModal(modal);
}

function handleDeleteDeptClick(btn) {
  confirmDeleteDepartment(btn.dataset.id, btn.dataset.name);
}

function confirmDeleteDepartment(id, name) {
  const modal = document.getElementById('deleteDeptModal');
  if (!modal) {
    if (confirm(`Are you sure you want to delete department "${name}"?`)) {
      window.location.href = `/departments/delete/${id}`;
    }
    return;
  }

  const nameEl = document.getElementById('deleteDeptName');
  if (nameEl) nameEl.textContent = name;

  const confirmBtn = document.getElementById('confirmDeleteDeptBtn');
  if (confirmBtn) {
    confirmBtn.href = `/departments/delete/${id}`;
  }

  openModal(modal);
}

function handleEditDeptClick(btn) {
  const form = document.getElementById('editDeptForm');
  if (form) {
    form.action = '/departments/update/' + btn.dataset.id;
  }
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  setVal('editDeptName', btn.dataset.name);
  setVal('editDeptCode', btn.dataset.code);
  setVal('editDeptHead', btn.dataset.head);
  setVal('editDeptLocation', btn.dataset.location);
  setVal('editDeptDesc', btn.dataset.desc);

  openModal(document.getElementById('editDeptModal'));
}

/* ==========================================================================
   6. Employee Table Live Search, Filtering, and CSV Export
   ========================================================================== */
function initEmployeeTableFilters() {
  const searchInput = document.getElementById('tableSearchInput');
  const deptSelect = document.getElementById('tableDeptFilter');
  const statusSelect = document.getElementById('tableStatusFilter');
  const clearBtn = document.getElementById('clearFiltersBtn');
  const exportBtn = document.getElementById('exportCsvBtn');

  if (!searchInput && !deptSelect && !statusSelect) return;

  function applyClientFiltering() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const deptId = deptSelect ? deptSelect.value : '';
    const status = statusSelect ? statusSelect.value : '';

    const rows = document.querySelectorAll('.employee-table-row');
    let visibleCount = 0;

    rows.forEach(row => {
      const name = (row.dataset.name || '').toLowerCase();
      const email = (row.dataset.email || '').toLowerCase();
      const code = (row.dataset.code || '').toLowerCase();
      const rowDept = row.dataset.deptId || '';
      const rowStatus = (row.dataset.status || '').toLowerCase();
      const desig = (row.dataset.desig || '').toLowerCase();

      const matchesQuery = !query || name.includes(query) || email.includes(query) || code.includes(query) || desig.includes(query);
      const matchesDept = !deptId || rowDept === deptId;
      const matchesStatus = !status || status === 'all' || rowStatus === status.toLowerCase();

      if (matchesQuery && matchesDept && matchesStatus) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    const emptyState = document.getElementById('tableEmptyState');
    if (emptyState) {
      emptyState.style.display = (visibleCount === 0 && rows.length > 0) ? 'block' : 'none';
    }

    const countDisplay = document.getElementById('filteredResultsCount');
    if (countDisplay) {
      countDisplay.textContent = visibleCount;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyClientFiltering);
  }
  if (deptSelect) {
    deptSelect.addEventListener('change', applyClientFiltering);
  }
  if (statusSelect) {
    statusSelect.addEventListener('change', applyClientFiltering);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (deptSelect) deptSelect.value = '';
      if (statusSelect) statusSelect.value = 'ALL';
      applyClientFiltering();
      showToast('Filters cleared', 'info');
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      exportEmployeesToCSV();
    });
  }
}

function exportEmployeesToCSV() {
  const query = document.getElementById('tableSearchInput')?.value || '';
  const deptId = document.getElementById('tableDeptFilter')?.value || '';
  const status = document.getElementById('tableStatusFilter')?.value || '';

  const url = `/employees/export/csv?search=${encodeURIComponent(query)}&departmentId=${encodeURIComponent(deptId)}&status=${encodeURIComponent(status)}`;
  window.location.href = url;
  showToast('Exporting employee records to CSV...', 'success');
}

/* ==========================================================================
   7. Toast Notifications
   ========================================================================== */
function initToasts() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('saved')) {
    showToast('Employee created successfully!', 'success');
  } else if (urlParams.has('updated')) {
    showToast('Employee record updated successfully!', 'success');
  } else if (urlParams.has('deleted')) {
    showToast('Employee removed successfully!', 'success');
  }
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    min-width: 280px;
    padding: 14px 18px;
    border-radius: var(--radius-md);
    background: var(--card-bg);
    color: var(--text-main);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--card-border);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.88rem;
    font-weight: 600;
    pointer-events: auto;
    animation: fadeInDown 0.3s ease;
  `;

  let icon = `
    <span style="color: var(--secondary); display: flex;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
    </span>
  `;

  if (type === 'success') {
    toast.style.borderLeft = '4px solid var(--success)';
    icon = `
      <span style="color: var(--success); display: flex;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </span>
    `;
  } else if (type === 'danger') {
    toast.style.borderLeft = '4px solid var(--danger)';
    icon = `
      <span style="color: var(--danger); display: flex;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      </span>
    `;
  }

  toast.innerHTML = `
    ${icon}
    <div style="flex: 1;">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#33;');
}

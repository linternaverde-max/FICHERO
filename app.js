// ==========================================
// DENTALCARE - CORE APPLICATION LOGIC
// ==========================================

// Global State
let patients = [];
let currentPatientId = null;
let activeTab = 'dashboard-tab';
let appointmentFilter = 'all';

// Mock Data (Loaded on first visit if localStorage is empty)
const getMockPatients = () => {
    const today = new Date();
    const formatDate = (offsetDays) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offsetDays);
        return d.toISOString().split('T')[0];
    };

    return [
        {
            id: "pat-1",
            name: "María Constanza Delgado",
            age: 28,
            sex: "Femenino",
            phone: "5543219876",
            address: "Av. de los Insurgentes Sur 1450, Col. Actipan, CDMX",
            allergies: "Penicilina",
            scheduledConsultations: 8,
            oralProblem: "Gingivitis crónica generalizada asociada a placa dentobacteriana. Caries de segundo grado en órganos dentarios 36 y 47. Sensibilidad dental moderada en cuadrante superior derecho.",
            progressPct: 60,
            progressDesc: "Se completó la profilaxis ultrasónica profunda. Se realizaron las resinas estéticas en 36 y 47. Pendiente inicio de tratamiento de ortodoncia preventiva. Encías muestran franca mejoría, disminución del sangrado al sondeo del 80% al 15%.",
            appointments: [
                { id: "appt-1-1", date: formatDate(-10), time: "10:00", status: "attended" },
                { id: "appt-1-2", date: formatDate(-5), time: "16:30", status: "attended" },
                { id: "appt-1-3", date: formatDate(0), time: "11:00", status: "pending" }, // Today
                { id: "appt-1-4", date: formatDate(7), time: "09:30", status: "pending" }
            ],
            consultations: [
                {
                    id: "cons-1-1",
                    date: formatDate(-10),
                    treatment: "Diagnóstico inicial, radiografía periapical completa y profilaxis con ultrasonido. Curetaje cerrado en cuadrante inferior izquierdo.",
                    prescription: "Clorhexidina al 0.12% (colutorio) cada 12 horas por 10 días.",
                    progressPct: 20,
                    progressDesc: "Fase diagnóstica concluida. Limpieza dental inicial efectuada. Gingivitis activa."
                },
                {
                    id: "cons-1-2",
                    date: formatDate(-5),
                    treatment: "Obturación con resina de fotocurado en órganos dentarios 36 y 47. Pulido de restauraciones.",
                    prescription: "Ibuprofeno 400mg cada 8 horas por 3 días (solo en caso de dolor o molestia).",
                    progressPct: 60,
                    progressDesc: "Caries eliminadas satisfactoriamente. Excelente adaptación de resinas. Encías con menor inflamación."
                }
            ]
        },
        {
            id: "pat-2",
            name: "Carlos Eduardo Mendoza",
            age: 42,
            sex: "Masculino",
            phone: "5512345678",
            address: "Calle Pino Suárez 88, Centro Histórico, CDMX",
            allergies: "Ninguna",
            scheduledConsultations: 6,
            oralProblem: "Periodontitis moderada localizada en molar 46 con pérdida ósea horizontal del 30%. Movilidad dental grado 1 en 46. Requiere raspado y alisado radicular.",
            progressPct: 35,
            progressDesc: "Se realizó raspado y alisado radicular (curetaje) en cuadrante inferior derecho. Se instruyó técnica de cepillado Stillman modificada y uso de cepillos interproximales.",
            appointments: [
                { id: "appt-2-1", date: formatDate(-14), time: "12:00", status: "attended" },
                { id: "appt-2-2", date: formatDate(-7), time: "11:00", status: "missed" }, // Missed
                { id: "appt-2-3", date: formatDate(0), time: "15:00", status: "pending" }, // Today
                { id: "appt-2-4", date: formatDate(14), time: "16:00", status: "pending" }
            ],
            consultations: [
                {
                    id: "cons-2-1",
                    date: formatDate(-14),
                    treatment: "Sondeo periodontal completo y raspado supragingival general. Alisado radicular quadrant 4.",
                    prescription: "Amoxicilina 500mg cada 8 horas por 7 días. (Tratamiento profiláctico).",
                    progressPct: 35,
                    progressDesc: "Raspado de cuadrante 4 terminado. Movilidad bajo monitoreo."
                }
            ]
        },
        {
            id: "pat-3",
            name: "Sofía Regina Ortiz",
            age: 19,
            sex: "Femenino",
            phone: "5598765432",
            address: "Av. Coyoacán 321, Col. Del Valle, CDMX",
            allergies: "Sulfas, Aspirina",
            scheduledConsultations: 12,
            oralProblem: "Maloclusión Clase II división 1 con apiñamiento severo anterosuperior y anteroinferior. Retención de terceros molares (18, 28, 38, 48) que requieren extracción quirúrgica previo a ortodoncia.",
            progressPct: 8,
            progressDesc: "Extracción quirúrgica de terceros molares superiores (18, 28) realizada con éxito. Recuperación en curso. Pendiente programar cirugías de los inferiores.",
            appointments: [
                { id: "appt-3-1", date: formatDate(-3), time: "17:00", status: "attended" },
                { id: "appt-3-2", date: formatDate(3), time: "10:30", status: "pending" }
            ],
            consultations: [
                {
                    id: "cons-3-1",
                    date: formatDate(-3),
                    treatment: "Cirugía de terceros molares retenidos 18 y 28. Sutura con seda 3-0. Hemostasia lograda.",
                    prescription: "Ketorolaco trometamina 10mg cada 6 horas por 4 días. Paracetamol 500mg cada 8 horas.",
                    progressPct: 8,
                    progressDesc: "Fase quirúrgica 1/2 terminada. Retiro de puntos en 7 días."
                }
            ]
        },
        {
            id: "pat-4",
            name: "Roberto Alejandro Ruiz",
            age: 65,
            sex: "Masculino",
            phone: "5577665544",
            address: "Paseo de la Reforma 450, Lomas de Chapultepec, CDMX",
            allergies: "Lidocaína (Molestias locales previas)",
            scheduledConsultations: 4,
            oralProblem: "Edentulismo parcial superior. Necrosis pulpar en órgano dentario 12 con fístula activa en mucosa vestibular. Requiere tratamiento de conductos (endodoncia) y posterior rehabilitación protésica.",
            progressPct: 0,
            progressDesc: "Caso inicial presentado. Se inicia control de proceso infeccioso con medicación sistémica. Pendiente apertura de conductos dentales en la próxima cita.",
            appointments: [
                { id: "appt-4-1", date: formatDate(1), time: "13:00", status: "pending" }
            ],
            consultations: []
        }
    ];
};

// Initialize Application
const initApp = () => {
    const storedPatients = localStorage.getItem('dentalcare_patients');
    if (storedPatients) {
        patients = JSON.parse(storedPatients);
    } else {
        patients = getMockPatients();
        saveToLocalStorage();
    }
    
    setupEventListeners();
    renderDashboard();
    renderPatientsList();
    renderAppointmentsTable();
    updateGlobalStats();
    
    // Set current date badge on dashboard
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('today-date-badge').innerText = today.toLocaleDateString('es-MX', options);
};

// Save to LocalStorage
const saveToLocalStorage = () => {
    localStorage.setItem('dentalcare_patients', JSON.stringify(patients));
    updateGlobalStats();
};

// Update Global Stats in Dashboard
const updateGlobalStats = () => {
    // Total Patients
    document.getElementById('stat-total-patients').innerText = patients.length;
    
    // Appointments Today
    const todayStr = new Date().toISOString().split('T')[0];
    let todayApptsCount = 0;
    let totalPastAppts = 0;
    let attendedAppts = 0;
    
    patients.forEach(pat => {
        pat.appointments.forEach(appt => {
            if (appt.date === todayStr) {
                todayApptsCount++;
            }
            if (appt.status === 'attended') {
                attendedAppts++;
                totalPastAppts++;
            } else if (appt.status === 'missed') {
                totalPastAppts++;
            }
        });
    });
    
    document.getElementById('stat-today-appointments').innerText = todayApptsCount;
    
    // Attendance Rate
    const attendanceRate = totalPastAppts > 0 ? Math.round((attendedAppts / totalPastAppts) * 100) : 100;
    document.getElementById('stat-attendance-rate').innerText = `${attendanceRate}%`;
    
    // Allergic Patients Count
    const allergicCount = patients.filter(pat => pat.allergies && pat.allergies.toLowerCase() !== 'ninguna' && pat.allergies.trim() !== '').length;
    document.getElementById('stat-allergies').innerText = allergicCount;
};

// Navigation tabs control
const setupEventListeners = () => {
    // Tab switching
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    // Global Quick search
    document.getElementById('global-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.trim() !== '') {
            switchTab('patients-tab');
            document.getElementById('patients-search-input').value = query;
            renderPatientsList(query);
        }
    });

    // Patient search in tab
    document.getElementById('patients-search-input').addEventListener('input', (e) => {
        renderPatientsList(e.target.value);
    });

    // View all patients link in dashboard
    document.getElementById('go-to-patients').addEventListener('click', () => {
        switchTab('patients-tab');
    });

    // Calendar Filter Buttons
    document.querySelectorAll('.filter-group button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-group button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appointmentFilter = btn.getAttribute('data-filter');
            renderAppointmentsTable();
        });
    });

    // --- MODALS CLOSE ACTIONS ---
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeAllModals();
        });
    });
    
    // Close modal on click outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAllModals();
            }
        });
    });

    // --- NEW PATIENT MODAL TRIGGER ---
    document.getElementById('btn-new-patient-trigger').addEventListener('click', () => {
        openPatientModal();
    });

    // --- SAVE PATIENT SUBMIT ---
    document.getElementById('form-patient').addEventListener('submit', (e) => {
        e.preventDefault();
        savePatient();
    });

    // --- SCHEDULE APPT MODAL SUBMIT ---
    document.getElementById('form-schedule').addEventListener('submit', (e) => {
        e.preventDefault();
        saveScheduledAppointment();
    });

    // --- GENERAL SCHEDULE BUTTON IN CALENDAR TAB ---
    document.getElementById('btn-schedule-appt-general').addEventListener('click', () => {
        openScheduleModal(null);
    });

    // --- LOG CONSULTATION FORM SUBMIT ---
    document.getElementById('form-consultation').addEventListener('submit', (e) => {
        e.preventDefault();
        saveConsultation();
    });
};

const switchTab = (tabId) => {
    activeTab = tabId;
    document.querySelectorAll('.nav-btn').forEach(b => {
        if (b.getAttribute('data-tab') === tabId) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Header title update
    const titleEl = document.getElementById('page-title');
    const subtitleEl = document.getElementById('page-subtitle');
    
    if (tabId === 'dashboard-tab') {
        titleEl.innerText = "Panel de Control";
        subtitleEl.innerText = "Bienvenido de nuevo, Dra. Díaz";
        renderDashboard();
    } else if (tabId === 'patients-tab') {
        titleEl.innerText = "Directorio de Pacientes";
        subtitleEl.innerText = "Fichas clínicas e historial dental";
        renderPatientsList();
    } else if (tabId === 'calendar-tab') {
        titleEl.innerText = "Calendario de Citas";
        subtitleEl.innerText = "Seguimiento y control de visitas";
        renderAppointmentsTable();
    }
};

const closeAllModals = () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
};

// ==========================================
// RENDERING FUNCTIONS
// ==========================================

// Render Dashboard Screen
const renderDashboard = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // 1. Render today's appointments
    const todayApptsContainer = document.getElementById('dashboard-today-appointments');
    let todayAppts = [];
    
    patients.forEach(pat => {
        pat.appointments.forEach(appt => {
            if (appt.date === todayStr) {
                todayAppts.push({
                    patientId: pat.id,
                    patientName: pat.name,
                    allergies: pat.allergies,
                    ...appt
                });
            }
        });
    });
    
    // Sort appointments by time
    todayAppts.sort((a, b) => a.time.localeCompare(b.time));
    
    if (todayAppts.length === 0) {
        todayApptsContainer.innerHTML = `
            <div class="text-center py-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48" class="text-muted" style="margin: 0 auto 12px; display: block;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-muted">No hay citas programadas para hoy.</p>
            </div>
        `;
    } else {
        todayApptsContainer.innerHTML = todayAppts.map(appt => {
            const hasAllergies = appt.allergies && appt.allergies.toLowerCase() !== 'ninguna' && appt.allergies.trim() !== '';
            let statusBadge = '';
            
            if (appt.status === 'pending') statusBadge = `<span class="badge badge-info">Pendiente</span>`;
            else if (appt.status === 'attended') statusBadge = `<span class="badge badge-success">Asistida</span>`;
            else if (appt.status === 'missed') statusBadge = `<span class="badge badge-danger">No Asistida</span>`;
            
            return `
                <div class="appointment-item">
                    <div class="appt-time-card">
                        <span>${appt.time}</span>
                        <span>HRS</span>
                    </div>
                    <div class="appt-details">
                        <h4>${appt.patientName}</h4>
                        <p>${hasAllergies ? `<span class="text-danger font-semibold">⚠️ Alergia: ${appt.allergies}</span>` : 'Sin alergias conocidas'}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        ${statusBadge}
                        <button class="btn btn-secondary btn-icon-toggle" onclick="viewPatientDetail('${appt.patientId}')" title="Ver ficha del paciente">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 2. Render recent patients
    const recentPatientsContainer = document.getElementById('dashboard-recent-patients');
    
    // Simple logic: sort by patients who have the most recent appointments or just last registered (let's show last 4 registered in order)
    const recentPatients = [...patients].slice(-4).reverse();
    
    if (recentPatients.length === 0) {
        recentPatientsContainer.innerHTML = `<p class="text-muted text-center py-4">No hay pacientes registrados.</p>`;
    } else {
        recentPatientsContainer.innerHTML = recentPatients.map(pat => {
            const initials = pat.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            const hasAllergies = pat.allergies && pat.allergies.toLowerCase() !== 'ninguna' && pat.allergies.trim() !== '';
            
            return `
                <div class="recent-patient-item" onclick="viewPatientDetail('${pat.id}')" style="cursor: pointer;">
                    <div class="patient-avatar-circle ${hasAllergies ? 'allergy-alert' : ''}">
                        ${initials}
                    </div>
                    <div class="patient-item-details" style="flex-grow: 1; margin-left: 14px;">
                        <h4>${pat.name}</h4>
                        <p>${pat.sex}, ${pat.age} años - Avance: <strong>${pat.progressPct}%</strong></p>
                    </div>
                    <div class="text-primary" style="font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                        <span>Ver Ficha</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            `;
        }).join('');
    }
};

// Render Patients List in Directory
const renderPatientsList = (filterQuery = '') => {
    const listContainer = document.getElementById('patients-list-container');
    const query = filterQuery.toLowerCase().trim();
    
    let filtered = patients;
    if (query !== '') {
        filtered = patients.filter(pat => 
            pat.name.toLowerCase().includes(query) || 
            pat.allergies.toLowerCase().includes(query)
        );
    }
    
    // Sort patients alphabetically
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `<p class="text-muted text-center py-4">No se encontraron pacientes.</p>`;
        return;
    }
    
    listContainer.innerHTML = filtered.map(pat => {
        const initials = pat.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const isSelected = pat.id === currentPatientId ? 'selected' : '';
        const hasAllergies = pat.allergies && pat.allergies.toLowerCase() !== 'ninguna' && pat.allergies.trim() !== '';
        
        return `
            <div class="patient-card-item ${isSelected}" onclick="selectPatient('${pat.id}')">
                <div class="patient-avatar-circle ${hasAllergies ? 'allergy-alert' : ''}">
                    ${initials}
                </div>
                <div class="patient-card-info">
                    <h4>${pat.name}</h4>
                    <p>${pat.age} años | Avance: ${pat.progressPct}%</p>
                </div>
                ${hasAllergies ? `<span class="allergy-indicator" title="Alergia a: ${pat.allergies}"></span>` : ''}
            </div>
        `;
    }).join('');
};

// Trigger Patient Select in Directory
const selectPatient = (patientId) => {
    currentPatientId = patientId;
    
    // Update selected patient card styling in list
    document.querySelectorAll('.patient-card-item').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Re-render list to reflect selected styling (or just do DOM manipulation, rendering is safer to keep state synced)
    renderPatientsList(document.getElementById('patients-search-input').value);
    
    renderPatientDetailView(patientId);
};

// Shortcut to navigate and open patient profile directly
const viewPatientDetail = (patientId) => {
    switchTab('patients-tab');
    selectPatient(patientId);
};

// Render Patient Detail View Card (Right Panel)
const renderPatientDetailView = (patientId) => {
    const detailContainer = document.getElementById('patient-details-view');
    const pat = patients.find(p => p.id === patientId);
    
    if (!pat) {
        detailContainer.innerHTML = `
            <div class="empty-detail-state card">
                <h3>Error</h3>
                <p>No se pudo encontrar la información del paciente seleccionado.</p>
            </div>
        `;
        return;
    }
    
    // Compute Counts
    const appts = pat.appointments || [];
    const assistedCount = appts.filter(a => a.status === 'attended').length;
    const missedCount = appts.filter(a => a.status === 'missed').length;
    const pendingCount = appts.filter(a => a.status === 'pending').length;
    
    const initials = pat.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const hasAllergies = pat.allergies && pat.allergies.toLowerCase() !== 'ninguna' && pat.allergies.trim() !== '';

    // Collect all medications prescribed in consultations
    const allPrescribedMeds = pat.consultations
        .filter(c => c.prescription && c.prescription.trim() !== '')
        .map(c => `<li><strong>${c.date}</strong>: ${c.prescription}</li>`)
        .join('');

    // Sort timeline: combine appointments and consultations in a unified timeline sorted from newest to oldest
    const timelineItems = [];
    
    pat.appointments.forEach(appt => {
        timelineItems.push({
            type: 'appointment',
            date: appt.date,
            time: appt.time,
            status: appt.status,
            object: appt
        });
    });
    
    pat.consultations.forEach(cons => {
        timelineItems.push({
            type: 'consultation',
            date: cons.date,
            object: cons
        });
    });
    
    // Sort timelineItems by date descending (and then by time if applicable)
    timelineItems.sort((a, b) => {
        const dateDiff = b.date.localeCompare(a.date);
        if (dateDiff !== 0) return dateDiff;
        // If dates are equal, put consultations before appointments or sort by time
        if (a.type === 'appointment' && b.type === 'appointment') {
            return b.time.localeCompare(a.time);
        }
        return a.type === 'consultation' ? -1 : 1;
    });

    let timelineHtml = timelineItems.map(item => {
        if (item.type === 'consultation') {
            return `
                <div class="timeline-item consultation">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-title badge badge-success">Consulta Realizada</span>
                            <span class="timeline-date">${formatReadableDate(item.date)}</span>
                        </div>
                        <div class="timeline-body">
                            <p><strong>Tratamiento:</strong> ${item.object.treatment}</p>
                            <p class="pt-4" style="font-size: 0.8rem; border-top: 1px dashed var(--border); margin-top: 8px;">
                                📈 <strong>Grado de Avance:</strong> (${item.object.progressPct}%) ${item.object.progressDesc}
                            </p>
                            ${item.object.prescription ? `
                                <div class="prescription-tag">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-5.618 3.03A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span><strong>Receta:</strong> ${item.object.prescription}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        } else {
            let statusText = 'Pendiente';
            let badgeClass = 'badge-info';
            let actionsHtml = '';
            
            if (item.status === 'attended') {
                statusText = 'Asistida';
                badgeClass = 'badge-success';
            } else if (item.status === 'missed') {
                statusText = 'No Asistida';
                badgeClass = 'badge-danger';
            }
            
            // Show action toggles only if it's pending, or allows changing status
            if (item.status === 'pending') {
                actionsHtml = `
                    <div class="appt-row-actions">
                        <button class="btn-icon-toggle btn-check" title="Registrar asistencia y consulta" onclick="triggerRegisterAttendance('${pat.id}', '${item.object.id}')">
                            ✓
                        </button>
                        <button class="btn-icon-toggle btn-cancel" title="Marcar como inasistencia" onclick="markAppointmentMissed('${pat.id}', '${item.object.id}')">
                            ✗
                        </button>
                    </div>
                `;
            } else {
                // If it is attended, we show check, if missed, show cross, with option to toggle back to pending
                actionsHtml = `
                    <button class="btn-text" style="font-size: 0.75rem;" onclick="resetAppointmentStatus('${pat.id}', '${item.object.id}')">
                        Reestablecer a Pendiente
                    </button>
                `;
            }

            return `
                <div class="timeline-item appointment">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-title badge ${badgeClass}">Cita Médica (${statusText})</span>
                            <span class="timeline-date">${formatReadableDate(item.date)} a las ${item.time} hrs</span>
                        </div>
                        <div class="timeline-body justify-between items-center flex gap-4">
                            <p>Visita programada.</p>
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');

    if (timelineHtml === '') {
        timelineHtml = '<p class="text-muted text-center py-4">No hay historial médico o citas registradas para este paciente.</p>';
    }

    detailContainer.innerHTML = `
        <div class="patient-grid">
            <!-- Left Side: Profile Information & Progress -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
                <div class="card patient-profile-card">
                    <div class="patient-profile-header">
                        <div class="patient-avatar-large">
                            ${initials}
                        </div>
                        <div class="patient-meta">
                            <h2>${pat.name}</h2>
                            <div class="profile-actions">
                                <button class="btn-text" onclick="openPatientModal('${pat.id}')">Editar Datos</button>
                                <span class="text-muted" style="font-size: 0.8rem">|</span>
                                <button class="btn-text text-danger" onclick="deletePatientConfirm('${pat.id}')">Eliminar</button>
                            </div>
                        </div>
                    </div>
                    
                    ${hasAllergies ? `
                        <div class="allergy-alert-box" style="margin-bottom: 20px;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <strong>ALERGIA CONFIRMADA:</strong>
                                <p style="font-size: 0.8rem; margin-top: 2px;">${pat.allergies}</p>
                            </div>
                        </div>
                    ` : ''}

                    <div class="patient-data-list">
                        <div class="data-row">
                            <span class="data-label">Edad:</span>
                            <span class="data-value">${pat.age} años</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Sexo:</span>
                            <span class="data-value">${pat.sex}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Teléfono:</span>
                            <span class="data-value">${pat.phone}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Dirección:</span>
                            <span class="data-value">${pat.address}</span>
                        </div>
                    </div>

                    <!-- Counters for Scheduled / Attended / Missed -->
                    <div class="progress-panel">
                        <div class="progress-header">
                            <span>Progreso de Resolución</span>
                            <span>${pat.progressPct}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${pat.progressPct}%"></div>
                        </div>
                    </div>

                    <div class="treatment-counters">
                        <div class="counter-box primary">
                            <div class="counter-value">${pat.scheduledConsultations}</div>
                            <div class="counter-label">Programadas</div>
                        </div>
                        <div class="counter-box success">
                            <div class="counter-value">${assistedCount}</div>
                            <div class="counter-label">Asistidas</div>
                        </div>
                        <div class="counter-box danger">
                            <div class="counter-value">${missedCount}</div>
                            <div class="counter-label">Inasistidas</div>
                        </div>
                    </div>
                </div>

                <!-- Oral Problem Description Card -->
                <div class="card" style="padding: 24px;">
                    <div class="card-header" style="padding: 0 0 16px 0; border-bottom: 1px solid var(--border-light); margin-bottom: 16px;">
                        <h3 style="font-size: 1rem;">Problema Bucal Diagnosticado</h3>
                    </div>
                    <div class="description-block" style="margin-top: 0; background-color: var(--primary-light); border-color: var(--primary-glow);">
                        <h4 class="text-primary">📋 Diagnóstico</h4>
                        <p style="color: var(--text-main); font-weight: 500;">${pat.oralProblem}</p>
                    </div>
                </div>

                <!-- Degree of Progress Description Card -->
                <div class="card" style="padding: 24px;">
                    <div class="card-header" style="padding: 0 0 16px 0; border-bottom: 1px solid var(--border-light); margin-bottom: 16px;">
                        <h3 style="font-size: 1rem;">Grado de Avance de la Solución</h3>
                    </div>
                    <div class="description-block" style="margin-top: 0; background-color: var(--success-light); border-color: var(--success-glow);">
                        <h4 class="text-success">📈 Estado y Evolución</h4>
                        <p style="color: var(--text-main); font-weight: 500;">${pat.progressDesc || 'No se han registrado avances aún. Diagnóstico inicial.'}</p>
                    </div>
                </div>

                <!-- All Prescribed Medications Summary -->
                <div class="card" style="padding: 24px;">
                    <div class="card-header" style="padding: 0 0 16px 0; border-bottom: 1px solid var(--border-light); margin-bottom: 16px;">
                        <h3 style="font-size: 1rem;">Medicamentos Recetados (Historial)</h3>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        ${allPrescribedMeds ? `
                            <ul style="padding-left: 18px; font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px;">
                                ${allPrescribedMeds}
                            </ul>
                        ` : `<p class="text-muted" style="font-size: 0.85rem;">No se han recetado medicamentos en este tratamiento aún.</p>`}
                    </div>
                </div>
            </div>

            <!-- Right Side: Timeline of Appointments & Consultations -->
            <div class="card" style="padding: 24px;">
                <div class="card-header justify-between" style="padding: 0 0 16px 0; border-bottom: 1px solid var(--border-light); margin-bottom: 24px;">
                    <h3 style="font-size: 1rem;">Historial Clínico y Citas</h3>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary btn-outline-tab" style="padding: 6px 12px; font-size: 0.75rem;" onclick="openScheduleModal('${pat.id}')">
                            + Cita
                        </button>
                        <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="triggerRegisterAttendance('${pat.id}', null)">
                            + Consulta
                        </button>
                    </div>
                </div>
                <div class="timeline-section">
                    <div class="timeline">
                        ${timelineHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Render Appointments Table in Calendario Tab
const renderAppointmentsTable = () => {
    const tbody = document.getElementById('all-appointments-tbody');
    let list = [];
    
    patients.forEach(pat => {
        pat.appointments.forEach(appt => {
            list.push({
                patientId: pat.id,
                patientName: pat.name,
                phone: pat.phone,
                ...appt
            });
        });
    });
    
    // Sort chronologically (future first, then past)
    list.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    
    // Filter
    if (appointmentFilter === 'pending') {
        list = list.filter(a => a.status === 'pending');
    } else if (appointmentFilter === 'attended') {
        list = list.filter(a => a.status === 'attended');
    } else if (appointmentFilter === 'missed') {
        list = list.filter(a => a.status === 'missed');
    }
    
    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">No se encontraron citas en esta categoría.</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = list.map(appt => {
        let statusBadge = '';
        let actionsHtml = '';
        
        if (appt.status === 'pending') {
            statusBadge = `<span class="badge badge-info">Pendiente</span>`;
            actionsHtml = `
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-success" style="padding: 6px 12px; font-size: 0.75rem;" onclick="triggerRegisterAttendance('${appt.patientId}', '${appt.id}')">
                        ✓ Asistió
                    </button>
                    <button class="btn btn-danger" style="padding: 6px 12px; font-size: 0.75rem;" onclick="markAppointmentMissed('${appt.patientId}', '${appt.id}')">
                        ✗ Inasistencia
                    </button>
                </div>
            `;
        } else if (appt.status === 'attended') {
            statusBadge = `<span class="badge badge-success">Asistida</span>`;
            actionsHtml = `
                <button class="btn-text" style="font-size: 0.75rem;" onclick="resetAppointmentStatus('${appt.patientId}', '${appt.id}')">
                    Reestablecer a Pendiente
                </button>
            `;
        } else if (appt.status === 'missed') {
            statusBadge = `<span class="badge badge-danger">No Asistida</span>`;
            actionsHtml = `
                <button class="btn-text" style="font-size: 0.75rem;" onclick="resetAppointmentStatus('${appt.patientId}', '${appt.id}')">
                    Reestablecer a Pendiente
                </button>
            `;
        }
        
        return `
            <tr>
                <td>
                    <div style="font-weight: 600;">${formatReadableDate(appt.date)}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${appt.time} hrs</div>
                </td>
                <td>
                    <a href="#" style="color: var(--primary); font-weight: 600; text-decoration: none;" onclick="event.preventDefault(); viewPatientDetail('${appt.patientId}')">
                        ${appt.patientName}
                    </a>
                </td>
                <td>${appt.phone}</td>
                <td>${statusBadge}</td>
                <td>${actionsHtml}</td>
            </tr>
        `;
    }).join('');
};

// ==========================================
// BUSINESS LOGIC & STATE MUTATIONS
// ==========================================

// 1. CREATE / UPDATE PATIENT
const openPatientModal = (patientId = null) => {
    const modal = document.getElementById('modal-patient');
    const form = document.getElementById('form-patient');
    form.reset();
    
    if (patientId) {
        // Edit Mode
        const pat = patients.find(p => p.id === patientId);
        if (!pat) return;
        
        document.getElementById('modal-patient-title').innerText = "Editar Datos del Paciente";
        document.getElementById('patient-id-field').value = pat.id;
        document.getElementById('p-name').value = pat.name;
        document.getElementById('p-age').value = pat.age;
        document.getElementById('p-sex').value = pat.sex;
        document.getElementById('p-phone').value = pat.phone;
        document.getElementById('p-consults').value = pat.scheduledConsultations;
        document.getElementById('p-address').value = pat.address;
        document.getElementById('p-allergies').value = pat.allergies || 'Ninguna';
        document.getElementById('p-oral-problem').value = pat.oralProblem;
        document.getElementById('p-progress-desc').value = pat.progressDesc || '';
        
        document.getElementById('modal-patient-submit-btn').innerText = "Guardar Cambios";
    } else {
        // New Mode
        document.getElementById('modal-patient-title').innerText = "Registrar Nuevo Paciente";
        document.getElementById('patient-id-field').value = '';
        document.getElementById('modal-patient-submit-btn').innerText = "Guardar Paciente";
    }
    
    modal.classList.add('active');
};

const savePatient = () => {
    const id = document.getElementById('patient-id-field').value;
    const name = document.getElementById('p-name').value;
    const age = parseInt(document.getElementById('p-age').value);
    const sex = document.getElementById('p-sex').value;
    const phone = document.getElementById('p-phone').value;
    const consults = parseInt(document.getElementById('p-consults').value);
    const address = document.getElementById('p-address').value;
    const allergies = document.getElementById('p-allergies').value || 'Ninguna';
    const oralProblem = document.getElementById('p-oral-problem').value;
    const progressDesc = document.getElementById('p-progress-desc').value;
    
    if (id) {
        // Update existing patient
        const index = patients.findIndex(p => p.id === id);
        if (index !== -1) {
            patients[index] = {
                ...patients[index],
                name, age, sex, phone, address, allergies, oralProblem,
                scheduledConsultations: consults,
                progressDesc: progressDesc
            };
        }
    } else {
        // Create new patient
        const newPatient = {
            id: 'pat-' + Date.now(),
            name, age, sex, phone, address, allergies, oralProblem,
            scheduledConsultations: consults,
            progressPct: 0,
            progressDesc: progressDesc || "Diagnóstico inicial. Progreso del 0%.",
            appointments: [],
            consultations: []
        };
        patients.push(newPatient);
        currentPatientId = newPatient.id; // Auto select new patient
    }
    
    saveToLocalStorage();
    closeAllModals();
    
    // Refresh screens
    if (activeTab === 'dashboard-tab') {
        renderDashboard();
    } else if (activeTab === 'patients-tab') {
        renderPatientsList();
        if (currentPatientId) {
            renderPatientDetailView(currentPatientId);
        }
    } else {
        renderAppointmentsTable();
    }
};

// Delete Patient
const deletePatientConfirm = (patientId) => {
    const pat = patients.find(p => p.id === patientId);
    if (!pat) return;
    
    if (confirm(`¿Está seguro que desea eliminar la ficha clínica completa de ${pat.name}? Esta acción no se puede deshacer.`)) {
        patients = patients.filter(p => p.id !== patientId);
        if (currentPatientId === patientId) {
            currentPatientId = null;
        }
        
        saveToLocalStorage();
        
        // Refresh UI
        renderPatientsList();
        const detailContainer = document.getElementById('patient-details-view');
        detailContainer.innerHTML = `
            <div class="empty-detail-state card">
                <div class="empty-icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h3>Selecciona un paciente</h3>
                <p>Elige un paciente del directorio para ver su ficha dental completa, citas, consultas y avances.</p>
            </div>
        `;
        
        if (activeTab === 'dashboard-tab') {
            renderDashboard();
        }
    }
};

// 2. SCHEDULE APPOINTMENT
const openScheduleModal = (patientId = null) => {
    const modal = document.getElementById('modal-schedule');
    const form = document.getElementById('form-schedule');
    form.reset();

    // Default dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('sch-date').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('sch-time').value = "10:00";

    const selectGroup = document.getElementById('modal-schedule-patient-select-group');
    const fixedGroup = document.getElementById('modal-schedule-patient-fixed-group');

    if (patientId) {
        // Fix to patient
        const pat = patients.find(p => p.id === patientId);
        if (!pat) return;
        
        selectGroup.style.display = 'none';
        fixedGroup.style.display = 'flex';
        
        document.getElementById('sch-patient-name-fixed').value = pat.name;
        document.getElementById('sch-patient-id-fixed').value = pat.id;
        document.getElementById('sch-patient-id').required = false;
    } else {
        // Dropdown select
        selectGroup.style.display = 'flex';
        fixedGroup.style.display = 'none';
        document.getElementById('sch-patient-id').required = true;
        
        const select = document.getElementById('sch-patient-id');
        select.innerHTML = '<option value="" disabled selected>Seleccione un paciente...</option>' +
            patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }

    modal.classList.add('active');
};

const saveScheduledAppointment = () => {
    const date = document.getElementById('sch-date').value;
    const time = document.getElementById('sch-time').value;
    
    let patientId = null;
    const fixedGroupId = document.getElementById('sch-patient-id-fixed').value;
    const selectGroupId = document.getElementById('sch-patient-id').value;
    
    const fixedGroupVisible = document.getElementById('modal-schedule-patient-fixed-group').style.display === 'flex';
    
    if (fixedGroupVisible) {
        patientId = fixedGroupId;
    } else {
        patientId = selectGroupId;
    }
    
    if (!patientId) return;
    
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
        const newAppt = {
            id: 'appt-' + Date.now(),
            date,
            time,
            status: 'pending'
        };
        
        patients[patientIndex].appointments.push(newAppt);
        saveToLocalStorage();
        closeAllModals();
        
        // Refresh UI
        if (activeTab === 'dashboard-tab') {
            renderDashboard();
        } else if (activeTab === 'patients-tab') {
            renderPatientDetailView(currentPatientId);
        } else if (activeTab === 'calendar-tab') {
            renderAppointmentsTable();
        }
    }
};

// Mark appointment status to missed
const markAppointmentMissed = (patientId, appointmentId) => {
    const patIndex = patients.findIndex(p => p.id === patientId);
    if (patIndex !== -1) {
        const apptIndex = patients[patIndex].appointments.findIndex(a => a.id === appointmentId);
        if (apptIndex !== -1) {
            patients[patIndex].appointments[apptIndex].status = 'missed';
            saveToLocalStorage();
            
            // Refresh views
            if (activeTab === 'dashboard-tab') {
                renderDashboard();
            } else if (activeTab === 'patients-tab') {
                renderPatientDetailView(currentPatientId);
            } else if (activeTab === 'calendar-tab') {
                renderAppointmentsTable();
            }
        }
    }
};

// Reset appointment back to pending status
const resetAppointmentStatus = (patientId, appointmentId) => {
    const patIndex = patients.findIndex(p => p.id === patientId);
    if (patIndex !== -1) {
        const apptIndex = patients[patIndex].appointments.findIndex(a => a.id === appointmentId);
        if (apptIndex !== -1) {
            patients[patIndex].appointments[apptIndex].status = 'pending';
            saveToLocalStorage();
            
            // Refresh views
            if (activeTab === 'dashboard-tab') {
                renderDashboard();
            } else if (activeTab === 'patients-tab') {
                renderPatientDetailView(currentPatientId);
            } else if (activeTab === 'calendar-tab') {
                renderAppointmentsTable();
            }
        }
    }
};

// 3. LOG CONSULTATION
// This opens the consultation modal. It is triggered either directly or when checking/attending an appointment
const triggerRegisterAttendance = (patientId, appointmentId = null) => {
    const pat = patients.find(p => p.id === patientId);
    if (!pat) return;
    
    const modal = document.getElementById('modal-consultation');
    const form = document.getElementById('form-consultation');
    form.reset();
    
    // Populate banner & fields
    document.getElementById('c-patient-id').value = pat.id;
    document.getElementById('c-appt-id').value = appointmentId || ''; // Link to appointment if exist
    document.getElementById('c-patient-name').innerText = pat.name;
    
    const bannerAllergy = document.getElementById('c-patient-allergies-banner');
    const hasAllergies = pat.allergies && pat.allergies.toLowerCase() !== 'ninguna' && pat.allergies.trim() !== '';
    if (hasAllergies) {
        bannerAllergy.innerText = `⚠️ ALERGIA A MEDICAMENTOS: ${pat.allergies}`;
        bannerAllergy.style.display = 'block';
    } else {
        bannerAllergy.innerText = '';
        bannerAllergy.style.display = 'none';
    }
    
    // Set default date to today
    document.getElementById('c-date').value = new Date().toISOString().split('T')[0];
    
    // Set slider and its textual percent value to current patient progress
    document.getElementById('c-progress-pct').value = pat.progressPct;
    document.getElementById('c-progress-pct-val').innerText = `${pat.progressPct}%`;
    
    // Description defaults
    document.getElementById('c-progress-desc').value = pat.progressDesc || '';
    
    modal.classList.add('active');
};

const saveConsultation = () => {
    const patientId = document.getElementById('c-patient-id').value;
    const apptId = document.getElementById('c-appt-id').value;
    const date = document.getElementById('c-date').value;
    const progressPct = parseInt(document.getElementById('c-progress-pct').value);
    const treatment = document.getElementById('c-treatment').value;
    const progressDesc = document.getElementById('c-progress-desc').value;
    const prescription = document.getElementById('c-prescription').value;
    
    const patIndex = patients.findIndex(p => p.id === patientId);
    if (patIndex !== -1) {
        // 1. Create and add Consultation log
        const newConsultation = {
            id: 'cons-' + Date.now(),
            date,
            treatment,
            prescription,
            progressPct,
            progressDesc
        };
        
        patients[patIndex].consultations.push(newConsultation);
        
        // 2. Update patient profile progress & state
        patients[patIndex].progressPct = progressPct;
        patients[patIndex].progressDesc = progressDesc;
        
        // 3. If there was a scheduled appointment, mark it as 'attended'
        if (apptId) {
            const apptIndex = patients[patIndex].appointments.findIndex(a => a.id === apptId);
            if (apptIndex !== -1) {
                patients[patIndex].appointments[apptIndex].status = 'attended';
            }
        } else {
            // If no appointment was linked, check if we want to auto-create an attended appointment
            // to keep the counter consistent, or just let consultations accumulate as completed visits.
            // Let's create an attended appointment for the records if none is selected,
            // so that Citas Asistidas increments properly!
            const newAttendedAppt = {
                id: 'appt-auto-' + Date.now(),
                date,
                time: new Date().toTimeString().split(' ')[0].substring(0, 5),
                status: 'attended'
            };
            patients[patIndex].appointments.push(newAttendedAppt);
        }
        
        saveToLocalStorage();
        closeAllModals();
        
        // Refresh UI
        if (activeTab === 'dashboard-tab') {
            renderDashboard();
        } else if (activeTab === 'patients-tab') {
            renderPatientDetailView(currentPatientId);
            renderPatientsList();
        } else if (activeTab === 'calendar-tab') {
            renderAppointmentsTable();
        }
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Format Date YYYY-MM-DD into DD/MM/YYYY or readable "viernes, 26 de junio"
const formatReadableDate = (dateStr) => {
    if (!dateStr) return '';
    const dateParts = dateStr.split('-');
    if (dateParts.length !== 3) return dateStr;
    
    // Create Date using UTC/local offsets safely without timezones shifting
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-MX', options);
};

// Start application when page is ready
window.addEventListener('DOMContentLoaded', () => {
    initApp();
});

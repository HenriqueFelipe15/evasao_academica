const API_URL_STUDENTS = 'https://jsonplaceholder.typicode.com/users';

document.addEventListener('DOMContentLoaded', () => {

    async function fetchStudentData() {
        try {
            console.log('Iniciando busca de dados da API...');
            
            const response = await fetch(API_URL_STUDENTS);
            
            if (!response.ok) {
                throw new Error(`Erro na API: Status ${response.status}`);
            }

            const data = await response.json();
            
            console.log(`Dados da API recebidos: ${data.length} alunos.`);

            processData(data);
            
        } catch (error) {
            console.error('Falha ao buscar dados:', error);
            alert('Falha ao carregar dados da API. Usando dados fictícios de fallback no console.'); 
        }
    }

    function processData(apiData) {
        
        const students = apiData.map((item, index) => ({
            id: item.id,
            name: item.name, 
            course: index % 2 === 0 ? "Engenharia Civil" : "Administração",
            risk: index % 3 === 0 ? "Alto" : "Médio",
            percentage: `${90 - index * 5}%`,
            reason: index % 3 === 0 ? "Situação Financeira" : "Adaptação Acadêmica",
            mentor: index % 2 === 0 ? "Dr. Ricardo G." : "Prof. Helena S."
        }));

        const metricCard = document.querySelector('.metric-card.blue .metric-number');
        if (metricCard) {
            metricCard.textContent = students.length;
        }

        const studentListContainer = document.getElementById('student-management-list');
        if (studentListContainer) {
            renderStudentList(students, studentListContainer);
        }
        
        const dashboardListContainer = document.querySelector('.student-list:not(#student-management-list)');
        if (dashboardListContainer) {
            const highRiskStudents = students.filter(s => s.risk === 'Alto').slice(0, 2);
            renderDashboardList(highRiskStudents, dashboardListContainer);
        }

        addDashboardActionListeners();
        addStudentActionListener();
    }
    
    function renderStudentList(data, container) {
        container.innerHTML = '';
        data.forEach(student => {
            const riskClass = student.risk === 'Alto' ? 'high' : 'medium';
            const icon = student.risk === 'Alto' ? 'fas fa-exclamation-triangle' : 'fas fa-bell';
            
            const studentItemHTML = `
                <div class="student-item ${riskClass}" data-id="${student.id}">
                    <div class="student-info">
                        <strong>${student.name}</strong>
                        <small>${student.course}</small>
                        <span class="risk-level ${riskClass}">
                            <i class="${icon}"></i> Risco ${student.risk} (${student.percentage})
                        </span>
                    </div>
                    <div class="student-details" style="font-size: 0.9em; width: 30%;">
                        <p><strong>Motivo Principal:</strong> ${student.reason}</p>
                        <p><strong>Mentor Responsável:</strong> ${student.mentor}</p>
                    </div>
                    <div class="student-action-btns">
                        <button class="btn btn-contact btn-small intervention-action" data-action="intervir"><i class="fas fa-handshake"></i> Intervir</button>
                        <button class="btn btn-view btn-small intervention-action" data-action="detalhes"><i class="fas fa-user-circle"></i> Detalhes</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', studentItemHTML);
        });
    }

    function renderDashboardList(data, container) {
        container.innerHTML = '';
        data.forEach(student => {
            const riskClass = student.risk === 'Alto' ? 'high' : 'medium';
            
            const studentItemHTML = `
                <div class="student-item ${riskClass}">
                    <div class="student-info">
                        <strong>${student.name}</strong>
                        <small>${student.course} (Risco: ${student.percentage})</small>
                        <span class="risk-level ${riskClass}">Risco ${student.risk} (${student.percentage})</span>
                    </div>
                    <div class="student-action-btns">
                        <button class="btn btn-contact"><i class="fas fa-envelope"></i> Contatar</button>
                        <button class="btn btn-view"><i class="fas fa-user-circle"></i> Perfil</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', studentItemHTML);
        });
    }

    function addStudentActionListener() {
        const studentListContainer = document.getElementById('student-management-list');
        if (!studentListContainer) return;
        
        const interventionButtons = studentListContainer.querySelectorAll('.intervention-action');
        interventionButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const studentName = event.target.closest('.student-item').querySelector('strong').textContent;
                const action = button.getAttribute('data-action');
                if (action === 'intervir') {
                    alert(`[API] Ação de Intervenção para ${studentName} registrada. Encaminhando para Soluções.`);
                } else if (action === 'detalhes') {
                    alert(`[API] Visualizando detalhes de ${studentName} (API ID: ${event.target.closest('.student-item').getAttribute('data-id')}).`);
                }
            });
        });
    }

    function addDashboardActionListeners() {
        const dashboardActionButtons = document.querySelectorAll('.student-action-btns button');
        dashboardActionButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const studentItem = event.target.closest('.student-item');
                const studentName = studentItem.querySelector('strong').textContent;
                let message = '';

                if (event.target.classList.contains('btn-contact')) {
                    message = `[DASHBOARD - API] Ação: Iniciando contato proativo com ${studentName}.`;
                } else if (event.target.classList.contains('btn-view')) {
                    message = `[DASHBOARD - API] Ação: Carregando Perfil Detalhado de ${studentName}.`;
                }
                alert(message);
            });
        });

        const solutionCards = document.querySelectorAll('.solution-card');
        solutionCards.forEach(card => {
            card.addEventListener('click', () => {
                solutionCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }

    fetchStudentData(); 

    const barItems = document.querySelectorAll('.fake-chart-bar .bar-item');
    barItems.forEach((bar) => {
        const finalHeight = bar.getAttribute('data-height');
        bar.style.height = '0%';
        setTimeout(() => {
            bar.style.height = finalHeight;
        }, 50); 
    });

    const programContainer = document.getElementById('intervention-programs');
    if (programContainer) {
        programContainer.querySelectorAll('.program-action').forEach(button => {
            button.addEventListener('click', (event) => {
                const programName = event.target.closest('.solution-card').querySelector('h3').textContent;
                alert(`[SOLUÇÕES] Abrindo painel de gestão para: "${programName}".`);
            });
        });
    }

    if (document.getElementById('predictive-reports')) {
        document.querySelectorAll('.report-action, .report-action-small').forEach(button => {
            button.addEventListener('click', (event) => {
                let reportName = event.target.closest('.report-card, tr')?.querySelector('h3, td')?.textContent || 'Relatório';
                const action = button.getAttribute('data-action');
                let message = '';

                if (action === 'download') message = `[RELATÓRIOS] Iniciando download do: "${reportName}".`;
                else if (action === 'visualizar') message = `[RELATÓRIOS] Abrindo dashboard premium para: "${reportName}".`;
                else if (action === 'gerar') message = `[RELATÓRIOS] Processo de geração de: "${reportName}" iniciado.`;

                alert(message);
            });
        });
    }
});
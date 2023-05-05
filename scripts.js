const projects = [
    {
        apCode: 'AP001',
        name: 'Project 1',
        proj: 'AbCdEfGhIj',
        data: [
            { UID: 'UID1', RDID: 1, Date: '2023-05-05 10:00:00' },
            { UID: 'UID2', RDID: 2, Date: '2023-05-05 11:00:00' },
            { UID: 'UID3', RDID: 3, Date: '2023-05-05 12:00:00' },
        ]
    },
    {
        apCode: 'AP002',
        name: 'Project 2',
        proj: 'KlMnOpQrSt',
        data: [
            { UID: 'UID4', RDID: 1, Date: '2023-05-05 13:00:00' },
            { UID: 'UID5', RDID: 2, Date: '2023-05-05 14:00:00' },
            { UID: 'UID6', RDID: 3, Date: '2023-05-05 15:00:00' },
        ]
    }
];
const baseURL = "https://example.com/your-survey";

function buildURL(proj, RDID, UID) {
    return `${baseURL}?proj=${encodeURIComponent(proj)}&RDID=${encodeURIComponent(RDID)}&UID=${encodeURIComponent(UID)}`;
  }
  
function populateProjectList() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    projects.forEach((project, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${project.apCode} - ${project.name}`;
        listItem.addEventListener('click', () => openProject(index));
        projectList.appendChild(listItem);
    });
}

function openProject(index) {
    const project = projects[index];
    const rightColumn = document.querySelector('.right-column');
    
    const rowData = project.data.map(entry => {
        const status = entry.RDID === 1 ? 'Complete' : (entry.RDID === 2 ? 'Terminate' : 'Overquota');
        return `<tr>
                    <td>${entry.UID}</td>
                    <td>${status}</td>
                    <td>${entry.Date}</td>
                </tr>`;
    }).join('');

    rightColumn.innerHTML = `
        <h3>Here are your redirects</h3>
        <p>Complete: ${buildURL(project.proj, 1, '')}UID_VALUE</p>
        <p>Terminate: ${buildURL(project.proj, 2, '')}UID_VALUE</p>
        <p>Overquota: ${buildURL(project.proj, 3, '')}UID_VALUE</p>

        
        <table id="project-details">
            <thead>
                <tr>
                    <th>UID</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${rowData}
            </tbody>
        </table>
        <button id="download-table" style="float: right;">Download Table</button>
    `;

    const downloadButton = document.getElementById('download-table');
    downloadButton.addEventListener('click', (event) => {
        event.preventDefault();
        downloadTableAsExcel('project-details', `${project.name}-redirects.xlsx`);
    });
}

function downloadTableAsExcel(tableId, filename) {
    const table = document.getElementById(tableId);
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename, { bookType: 'xlsx', type: 'binary' });
}

document.addEventListener('DOMContentLoaded', () => {
    populateProjectList();
});

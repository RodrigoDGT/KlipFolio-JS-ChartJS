require.config({
    paths: {
        'bootstrap': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle'
    }
});

var env = {
    apiKey: 'pk_84030478_V1ZWU15IJR7X2H8HJS3N87LYMAZYIYZN',
    folders: 'https://api.clickup.com/api/v2/space/90130002917/folder',
    lists: 'https://api.clickup.com/api/v2/list/901300088409/task',
    idKlip: '853fea5cce8f5f6d193384267780b947834c2de9'
}

var _dateTime = {
    options: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        //hour: '2-digit',
        //minute: '2-digit'
    },
    newDate: function() {
        let date = new Date();
        return date.toLocaleDateString('pt-BR', this.options)//.split('/').reverse().join('-');
    },
    formatDate: function(dateString) {
        let date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', this.options)//.split('/').reverse().join('-');
    }
}

var projects = [];

//Serviço de requisições REST
async function serviceREST(method, url, data) {

    if (method === 'GET' && data) {
        let params = new URLSearchParams(data); //data = [[chave, valor],[chave, valor]]
        url += `?${params.toString()}`;
    }

    let head = new Headers();
    head.append('Accept', 'application/json');
    head.append('Authorization', env.apiKey);
    
    try 
    {
        return await fetch(url, {
            method: method,
            body: (method !== 'GET' && data) ? data : null,
            headers: head
            })
            .then(response => response.json());
    } 
    catch (error) 
    {
        console.error('Erro:', error);
        throw error;
    }
}


async function getFolderProjects() {
    showLoading('spinnerclickup', true)
    let url = `https://api.clickup.com/api/v2/space/90130002917/folder`;
    //let folders = null;
    try {
        await serviceREST('GET', url)
            .then(data => {
                iterableFolderProjectsToList(data);
            })
            .catch(error => { throw error; });
    } catch (error) {
        showLoading('spinnerclickup', false);
        console.error(error);
    }

}

async function getTasks(id) {
    showLoading('spinnerclickup', true);
    let url = `https://api.clickup.com/api/v2/list/${id}/task`;
    let params = [['include_closed', true], ['subtasks', true], ['order_by', 'created']];
    try {
        return await serviceREST('GET', url, params)
            .then(data => { 
                return data; 
            })
            .catch(error => { throw error; });
    } catch (error) {
        showLoading('spinnerclickup', false);
        console.error(error);
    }
}

async function iterableFolderProjectsToList(folders) {
    projects = [];
    if(folders.folders) {
        for (let folder of folders.folders) {
            let project = {
                id: folder.id,
                name: folder.name,
                lists: []
            };
            let tasksPromises = folder.lists.map(list => {
                return getTasks(list.id).then(tasks => {
                    return {
                        id: list.id,
                        name: list.name,
                        type: folder.name,
                        status: list.status,
                        start_date:  list.start_date != null ? _dateTime.formatDate(Number(list.start_date)) : '',
                        due_date: list.due_date != null ? _dateTime.formatDate(Number(list.due_date)) : '',
                        statusTasks: calculateCompletedTasksPercentage(tasks)
                    };
                });
            });
            project.lists = await Promise.all(tasksPromises);
            //project.lists = sortByDate(project.lists);
            //project.lists.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            projects.push(project);
        }
    }
    createTableBody();
}

function sortByDate(a, b) {
    let dateA = new Date(a.start_date.split('/').reverse().join('-'));
    let dateB = new Date(b.start_date.split('/').reverse().join('-'));
    return dateA - dateB;
}

function calculateCompletedTasksPercentage(tasks) {
    //const tasks = await getTasksFromList(id);
    if (tasks.tasks){
        tasks = tasks.tasks;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status.type == 'closed').length;
        const percentage = (totalTasks > 0) ? parseFloat((completedTasks / totalTasks) * 100).toFixed(0) : 0;
        return {percentage, completedTasks, totalTasks};
    }
}

// Elementos HTML e interações
function colapse() {
    require(['bootstrap'], function (bootstrap) {
        const bsCollapse = new bootstrap.Collapse('#panelsStayOpen-collapseOne', {
            toggle: false
        })
    });
}


//Insere os clientes na tabela
function createTableBody() {
    const tbody1 = document.getElementById('idTableBody1');
    const tbody2 = document.getElementById('idTableBody2');
    let line1 = 1;
    let line2 = 1;
    if (projects && projects.length > 0) {
        let lists = [...projects[0].lists, ...projects[1].lists];
        //projects.forEach((folder, i) => {//preenche a tabela
        lists.sort(sortByDate);
        //folder.lists.forEach((task, i2) => {
            lists.forEach((task, i2) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <th scope="row">${task.status.status != 'concluido' && task.status.status != 'concluido atraso' ? line1++ : line2++}</th>
            <td>${task.type}</td>
            <td>${task.name}</td>
            <td>${task.start_date}</td>
            <td>${task.due_date}</td>
            <td class="text-uppercase"><span class="badge" style="background-color: ${task.status.color}">${task.status.status}</span></td>
            <td>
                <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: ${task.statusTasks.percentage}%">${task.statusTasks.percentage}%</div>
                </div>
            <td>
            `;

            if (task.status.status !== 'concluido' && task.status.status !== 'concluido atraso')
                tbody1.appendChild(tr);
            else
                tbody2.appendChild(tr);

            });
        //});
    } else {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5">Nenhum projeto disponível</td>
      `;
      tbody1.appendChild(tr);
      tbody2.appendChild(tr);
    }
    showLoading('spinnerclickup', false);
}

function showLoading(divId, show) {
    const div = document.getElementById(divId);
    if (div)
        show ? div.style.display = '' : div.style.display = 'none';
}

function ajustarLarguraDiv() {//idSizeDiv
    let divPai = document.getElementById(env.idKlip);
    //let larguraDivPai = divPai.parentElement.clientWidth;
    let div1 = document.getElementById('idSizeDiv1');
    let div2 = document.getElementById('idSizeDiv2');
    let spin = document.getElementById('spinnerclickup');
    //div1.style.width = (larguraDivPai - 60) + 'px';
    //div2.style.width = (larguraDivPai - 60) + 'px';
    //spin.style.width = (larguraDivPai - 60) + 'px';
}
window.onresize = ajustarLarguraDiv;

function sizediv() {
    let divPai = document.getElementById(env.idKlip);
    let larguraDivPai = divPai.parentElement.clientWidth;
    let div2 = document.getElementById('idSizeDiv1');
    div2.style.width = (larguraDivPai - 60) + 'px';
}
//window.sizediv = sizediv;

window.onload = function() {
    //getFolderProjects();
    //colapse();
};

ajustarLarguraDiv()
getFolderProjects();
colapse();
//debugger;
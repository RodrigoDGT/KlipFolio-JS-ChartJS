// function importarScript(url, integrity, crossorigin, callback) {
//     var script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = url;
//     script.integrity = integrity;
//     script.crossOrigin = crossorigin;
//     document.head.appendChild(script);
// }

// function importarEstilo(url, integrity, crossorigin) {
//     var link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = url;
//     link.integrity = integrity;
//     link.crossOrigin = crossorigin;
//     document.head.appendChild(link);
// }

//importarScript('https://cdn.jsdelivr.net/npm/chart.js', '', '', function() {});
//importarScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js', 'sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL', 'anonymous', function() {});
//importarEstilo('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css', 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN', 'anonymous');

require.config({
    paths: {
        'chart': 'https://cdn.jsdelivr.net/npm/chart',
        'bootstrap': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min'
    }
});

var env = {
    urlServiceOrder: 'https://suporte.dgt.com.br/api/v1/integration/service_orders.json',
    urlPerson: 'https://suporte.dgt.com.br/api/v1/integration/customers.json',
    token: ['iliot-company-token', '1622580057mTHsCDfg6_GSeyL7bOOuZA']
}
var customersList = [];
var cidadesUnicas = [];
var customerInfo = null;
var page = {
    currentPage: 1,
    pageSize: 30
}
var chartCustomers = null;
var alertType = {
    PRIMARY: 'primary',
    DANGER: 'danger',
    WARNING: 'warning'
};
var iconType = {
    PRIMARY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-right: 10px; height: 23px;"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path></svg>',
    DANGER: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-right: 10px; height: 23px;"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
    WARNING: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-right: 10px; height: 23px;"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>'
};

function init() {
    searchCustomers();
}

function searchCustomers() {
    showLoading('idSpinnerTable', true);
    let params = [['page', page.currentPage]];
    serviceREST('GET', env.urlPerson, params, env.token)
        .then(data => {
            customersList = data;
            insertCustomersHTML(customersList, true);
            newChart();
            showLoading('idSpinnerTable', false);
            createToast('Clientes carregados com sucesso', 'Sucesso', alertType.PRIMARY);
        })
        .catch(error => {
            console.error('Erro:', error);
            showLoading('idSpinnerTable', false);
        });
}

//Retorna informações completas do cliente
function loadCustomerInfo(id) {
    showLoading('idSpinnerListInfo', true);
    let params = [['id', id]];
    serviceREST('GET', env.urlPerson, params, env.token)
        .then(data => {
            customerInfo = data[0];
            createInfoCustomerHTML();
            showLoading('idSpinnerListInfo', false);
            createToast('Informações completas do cliente', 'Informação', alertType.WARNING);
        })
        .catch(error => {
            console.error('Erro:', error);
            showLoading('idSpinnerListInfo', false);
            createToast('Não foi possível carregar as informações', 'Atenção', alertType.DANGER);
        });
}

//Serviço de requisição REST
async function serviceREST(method, url, data, headKey) {

    if (method === 'GET' && data) {
        let params = new URLSearchParams(data); //data = [[chave, valor],[chave, valor]]
        url += `?${params.toString()}`;
    }

    let head = new Headers();
    head.append('Accept', 'application/json');

    if (headKey != null)
        head.append(headKey[0], headKey[1]);
    
    try 
    {
        let data = await fetch(url, {
            method: method,
            body: (method !== 'GET' && data) ? data : null,
            headers: head
            })
            .then(response => response.json());
        return data;
    } 
    catch (error) 
    {
        console.error('Erro:', error);
        throw error;
    }
}

//Insere os clientes na tabela
function insertCustomersHTML(data, select) {
    const tbody = document.getElementById('idTableBody');

    while (tbody.firstChild){//limpa a tabela
        tbody.removeChild(tbody.firstChild);
    }

    cidadesUnicas = []; //Lista será atualizada para criar Select de cidades
    
    if (data && data.length > 0) {
      data.forEach((customer, index) => {//preenche a tabela
        const tr = document.createElement('tr');
        tr.onclick = function() {
            loadCustomerInfo(customer.id);
        };
        tr.innerHTML = `
          <th scope="row">${page.currentPage == 1 ? index + 1 : (index + 1) + (page.pageSize * page.currentPage) - page.pageSize}</th>
          <td>${customer.name}</td>
          <td class="city">${customer.city}</td>
          <td>${customer.state}</td>
          <td>${customer.extra_info}</td>
        `;
        tbody.appendChild(tr);
        if (select)
            mountListToSelect(customer.city);
      });
    } else {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5">Nenhum cliente disponível</td>
      `;
      tbody.appendChild(tr);
    }
    createSelectCityHTML(select);
}

//Monta a lista de cidades únicas
function mountListToSelect(city) {
    if (cidadesUnicas.length == 0 || cidadesUnicas.size == 0)
        cidadesUnicas = new Set();

    cidadesUnicas.add(city);
}

//Cria a Seleção de Cidades Únicas
function createSelectCityHTML(bool) {
    if (!bool) // seleção deve ser criada apenas após o GET
        return;

    const options = document.getElementById('idSelectCity');

    let list = Array.from(cidadesUnicas);
    list = list.sort((a, b) => a.localeCompare(b));

    while (options.firstChild){//limpa a tabela
        options.removeChild(options.firstChild);
    }
    options.innerHTML += '<option selected>Todas as Cidades</option>';

    list.forEach((city, i) => {
        const op = document.createElement('option');
        op.text = city;
        options.appendChild(op);
    })
    addOnClickSelector();
}

//Filtra Tabela por Cidade
function filterCustomersForCity(cityName) {
    const rows = document.querySelectorAll('#idTableBody tr');
    if (cityName !== 'Todas as Cidades') {
        rows.forEach(row => {
            const cityCell = row.querySelector('.city');
            if (cityCell.textContent === cityName) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    } else {
        rows.forEach(row => row.style.display = '');
    }
}

//Cria HTML com Info do cliente
function createInfoCustomerHTML() {
    const info = document.getElementById('infoCustomer');
    if(customerInfo){
        info.innerHTML = `
        <div class="row">
            <div class="col-6 p-0">
            <p><span class="fw-bold">Cidade: </span>${customerInfo.city}</p>
            <p><span class="fw-bold">Estado: </span>${customerInfo.state}</p>
            <p><span class="fw-bold">CNPJ: </span>${customerInfo.cnpj}</p>
            <p><span class="fw-bold">E-mail: </span>${customerInfo.email}</p>
            <p><span class="fw-bold">Telefone: </span>${customerInfo.phone1}</p>
            </div>
            <div class="col-6 p-0">
            <p><span class="fw-bold">Preventiva: </span>${customerInfo.extra_info}</p>
            <p><span class="fw-bold">Observação: </span>${customerInfo.obs}</p>
            <p><span class="fw-bold">Tipo de Cliente: </span>${customerInfo.customer_type}</p>
            <p><span class="fw-bold">Cadastro: </span>${formatDate(customerInfo.created_at)}</p>
            <p><span class="fw-bold">Atualização: </span>${formatDate(customerInfo.updated_at)}</p>
            </div>
        </div>
        `;

    } else {
        info.innerHTML = `
        <div class="row">
            <p class="text-center">Selecione uma cidade na lista</p>
        </div>
        `;
    }
}

//Função de OnClick da Seleção de Cidades
function addOnClickSelector() {
    document.getElementById("idSelectCity").addEventListener("change", function(e) {
        var selected = this.options[this.selectedIndex].value;
        filterCustomersForCity(selected);
    });
}

//Formata a data
function formatDate(dateString) {
    let date = new Date(dateString);
    let options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('pt-BR', options);
  }

//Botão Pesquisar
window.btnSearchCustomers = function() {
    searchCustomers();
}

//Paginação
window.paginator = function(event) {
    let bts = [
        document.getElementById('page1'),
        document.getElementById('page2'),
        document.getElementById('page3')
    ];
    
    switch (event.target.innerHTML) {
        case '&lt;&lt;' : page.currentPage = 1; break;
        case 'Anterior' : page.currentPage == 1 ? page.currentPage = 1 : page.currentPage--; break;
        case 'Próximo'  : page.currentPage++; break;
        default: page.currentPage = parseInt(event.target.innerText); break;
    }

    if (page.currentPage) {
        const startPage = Math.max(1, page.currentPage - 1);
        const endPage = startPage + 2;
      
        for (let i = startPage; i <= endPage; i++) {
          const index = i - startPage;
          bts[index].innerHTML = `<a class="page-link" href="#">${i}</a>`;
          if (i === page.currentPage) {
            bts[index].classList.add('active');
          } else {
            bts[index].classList.remove('active');
          }
        }
    }
    searchCustomers();
}

//chart
function newChart() {
    
    require(['chart'], function(Chart) {
        const ctx = document.getElementById('myChart');
        let [labels, data] = mountDataChart(customersList);

        if (chartCustomers == null) {
            chartCustomers = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: false,
                    data: data,
                    backgroundColor: generateGradientColors(labels.length),
                }],
                borderWidth: 1,
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Projetos por Cliente'
                    },
                    legend: {
                        display: false
                    }
                }
            }
            });
        } else {
            chartCustomers.data.labels = labels;
            chartCustomers.data.datasets[0].data = data;
            chartCustomers.data.datasets[0].backgroundColor = generateGradientColors(labels.length);
            chartCustomers.update();
        }}
    );
};

function mountDataChart(customers) {
    const cityCounts = customers.reduce((counts, { city }) => {
        counts[city] = (counts[city] || 0) + 1;
        return counts;
    }, {});

    const entries = Object.entries(cityCounts);
    entries.sort((a, b) => b[1] - a[1]);
    
    const cities = [];
    const counts = [];

    entries.forEach(([city, count]) => {
        cities.push(city);
        counts.push(count);
    });

    return [cities, counts];
}

function generateGradientColors(totalColors) {
    const colors = [];
    const increment = 100 / (totalColors - 1);
  
    for (let i = 0; i < totalColors; i++) {
      const hue = i * increment +160;
      const color = `hsl(${hue}, 100%, 45%)`;
      colors.push(color);
    }
  
    return colors;
}

function showLoading(divId, show) {
    const div = document.getElementById(divId);
    if (div)
        show ? div.style.display = '' : div.style.display = 'none';
}

function createToast(message, title, classType) {
    require(['bootstrap'], function(bootstrap) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');

        toast.classList.add('toast', `text-bg-${classType}`, 'fs-4');
        toast.style.minWidth = '550px';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.setAttribute('data-bs-autohide', 'false');

        toast.innerHTML = `
            <div class="toast-header">
                ${iconType[classType.toUpperCase()]}
                <strong class="me-auto">${title}</strong>
                <small class="text-body-secondary" id="idToastShow${toastContainer.childElementCount}">Agora mesmo</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        toastContainer.appendChild(toast);
        const bootstrapToast = new bootstrap.Toast(toast);
        bootstrapToast.show();
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
        createToastTimeMsg(`idToastShow${toastContainer.childElementCount - 1}`);

        const alertSound = document.getElementById('alertSound');
        alertSound.play();
    });
}

function createToastTimeMsg(idHTML) {
    let contador = 0;
    let intervalo = setInterval(() => {
        contador++;
        updateTimeToast(contador, idHTML, intervalo);
    }, 60000);
}

function updateTimeToast(cont, id, interval) {
    const elemento = document.getElementById(id);
    if (!elemento) {
        clearInterval(interval);
        return;
    }
    
    if (cont < 1) 
        elemento.innerText = 'Agora mesmo';
    else if (cont == 1)
        elemento.innerText = 'Há 1 minuto';
    else if (cont <= 5) 
        elemento.innerText = `Há ${cont} minutos`;
    else {
        elemento.innerText = 'Há mais de 5 minutos';
        clearInterval(interval);
    }
}



window.onload = function() {
    init();
};
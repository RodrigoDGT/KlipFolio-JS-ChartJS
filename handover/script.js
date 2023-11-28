var env = {
    klipFolio: {
        idklip: '2c646bea7a33fc98c368ac7f533cbc3b',
        idCalendarStart: '2140931a4ae021a8440fff8881b485c3c82bd623',
        idCalendarEnd: '21417a3ce5c3b924142458fd67b66861335dc935',
        idBtnCalendar: '2b05c6eccf071d8e349497c1cc901c5f1c42c4a3',
        idClientSelect: '64482cacbcae1faa77278dcaf09cdad1fcd79f3c',
        dataInicial: 'data_ha_ini',
        dataFinal: 'data_ha_fin',
        variavelCliente: 'data_ha_cliente',
    },
    bootstrap: {
        idFormCalendar: 'idFormCalendar1',
        idCalendarStart: 'dateStart1',
        idCalendarEnd: 'dateEnd1',
        idBtnCalendar: 'idBtnCalendar1',
        idClientSelect: 'idClientSelect1'
    },
}

var dateTime = {
    options: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        //hour: '2-digit',
        //minute: '2-digit'
    },
    newDate: function() {
        let date = new Date();
        return date.toLocaleDateString('pt-BR', this.options).split('/').reverse().join('-');
    },
    formatDate: function(dateString) {
        let date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', this.options).split('/').reverse().join('-');
    },
    formatDateKlip: function(dateString) {
        let dateParts = dateString.split('-');
        let date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        return date.toLocaleDateString('pt-BR', this.options);
    }
}

function init() {
    callFunc(setStartAndEndDates);
    callFunc(replicateAndSyncSelects);
}

// Btn Pesquisar chama a função
function search() {
    if(!checkFormValid())
        return false;

    changeDateKlipCalendar(env.bootstrap.idCalendarStart);
    changeDateKlipCalendar(env.bootstrap.idCalendarEnd);
    dashboard
    btnBlockRequest();
    callFunc(replicateAndSyncSelects);
    return false;
}
window.search = search;

function btnBlockRequest() {
    let btnBoots = document.getElementById(env.bootstrap.idBtnCalendar);
    let btnKlip = document.getElementById(env.klipFolio.idBtnCalendar);
    let counter = 5;

    if (!btnBoots || !btnKlip)
        return;

    btnKlip = btnKlip.querySelector('button');
    if (!btnKlip)
        return;
    btnKlip.click();
    
    // btnBoots.disabled = true;
    // btnBoots.style.cursor = 'wait';
    // btnBoots.innerHTML = `Aguarde ${counter}s`;

    // var countdown = setInterval(function() {
    //     counter--;
    //     if (counter <= 0) {
    //         clearInterval(countdown);
    //         btnBoots.disabled = false;
    //         btnBoots.style.cursor = 'pointer';
    //         btnBoots.innerHTML = 'Pesquisar';
    //     } else {
    //         btnBoots.innerHTML = `Aguarde ${counter}s`;
    //     }
    // }, 1000);
}

function setStartAndEndDates() {
    let dateStart = document.getElementById(env.bootstrap.idCalendarStart);
    let dateEnd = document.getElementById(env.bootstrap.idCalendarEnd);
  
    if (!dateStart || !dateEnd) {
      console.error('Start date or end date input not found.');
      return;
    }
  
    let today = dateTime.newDate();
    dateStart.value = today;
    dateEnd.value = today;

    changeDateKlipCalendar(env.bootstrap.idCalendarStart);
    changeDateKlipCalendar(env.bootstrap.idCalendarEnd);
}

function changeDateKlipCalendar(id) {
    //let idKlip = '';
    let variableKlip = '';

    if ( id == env.bootstrap.idCalendarStart){
        //idKlip = env.klipFolio.idCalendarStart;
        variableKlip = env.klipFolio.dataInicial;
    }
    else {
        //idKlip = env.klipFolio.idCalendarEnd;
        variableKlip = env.klipFolio.dataFinal;
    }

    let bootsInput = document.getElementById(id);
    if (!bootsInput)
        return;
    //let klip = document.getElementById(idKlip);

    //if (!klip || !bootsInput)
    //    return;
    
    
    //klip = klip.querySelector('input');
    
    //if (!klip)
    //return;

    setValueKlipVariable(variableKlip, dateTime.formatDateKlip(bootsInput.value));
    //console.log('variavel após SET',dashboard.dashboardProps.find(x => x.name == env.klipFolio.dataInicial));
    checkDateStartDateEnd();
}
window.changeDateKlipCalendar = changeDateKlipCalendar;

function checkFormValid() {
    let form = document.getElementById(env.bootstrap.idFormCalendar);
    if (!form)
        return false;
    //verificar se form é valido usando metodo form.checkValidity()
    if (!form.checkValidity())
        return false;

    return true;
}

function checkDateStartDateEnd() {
    let dateStart = document.getElementById(env.bootstrap.idCalendarStart);
    let dateEnd = document.getElementById(env.bootstrap.idCalendarEnd);

    if (!isValidDate(dateStart.value) || !isValidDate(dateEnd.value))
        return false;
    if (dateStart.value > dateEnd.value) {
        dateStart.setCustomValidity('A data inicial não pode ser superior à data final.');
        return false
      } else {
        dateStart.setCustomValidity('');
        return true;
      }
}

//Verifica se a data é valida
function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
}

//select
function replicateAndSyncSelects() {
    let sourceSelect = document.getElementById(env.klipFolio.idClientSelect);
    let targetSelect = document.getElementById(env.bootstrap.idClientSelect);

    if (!sourceSelect || !targetSelect)
        return;

    sourceSelect = sourceSelect.querySelector('select');

    if (sourceSelect.options.length == targetSelect.options.length)
        return;
  
    // Limpar o select de destino
    targetSelect.innerHTML = '';
  
    // Replicar options
    for (let i = 0; i < sourceSelect.options.length; i++) {
        let option = document.createElement('option');
        option.value = [i];
        option.text = sourceSelect.options[i].text;
        targetSelect.add(option);
    }
    if(targetSelect.options[0])
        targetSelect.options[0].selected = true;

    // Sincronizar selects
    targetSelect.addEventListener('change', function() {
        //sourceSelect.value = this.value;
        setValueKlipVariable(env.klipFolio.variavelCliente, this.options[this.value].innerText);
    });
}
window.replicateAndSyncSelects = replicateAndSyncSelects;

function callFunc(func) {
    var interval = setInterval(func, 1000);
    setTimeout(function() {
        clearInterval(interval);
    }, 5000);
}

function setValueKlipVariable(variable, value) {
    dashboard.setDashboardProp(3, variable, value, env.klipFolio.idklip);
}

init();



//debugger;
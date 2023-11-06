var env = {
    klipFolio: {
        idCalendarStart: 'f9a931be-33',
        idCalendarEnd: '0d09e944-42',
        idBtnCalendar: '18740ca0-39',
        idClientSelect: 'c099f419-19'
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
    }
}

function init() {
    setStartAndEndDates();
    callFunc(replicateAndSyncSelects);
}

// Btn Pesquisar chama a função
function search() {
    if(!checkFormValid())
        return false;

    changeDateKlipCalendar(env.bootstrap.idCalendarStart);
    changeDateKlipCalendar(env.bootstrap.idCalendarEnd);

    btnBlockRequest();
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
    
    btnBoots.disabled = true;
    btnBoots.style.cursor = 'wait';
    btnBoots.innerHTML = `Aguarde ${counter}s`;

    var countdown = setInterval(function() {
        counter--;
        if (counter <= 0) {
            clearInterval(countdown);
            btnBoots.disabled = false;
            btnBoots.style.cursor = 'pointer';
            btnBoots.innerHTML = 'Pesquisar';
        } else {
            btnBoots.innerHTML = `Aguarde ${counter}s`;
        }
    }, 1000);
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
    let idKlip = '';

    if ( id == env.bootstrap.idCalendarStart)
        idKlip = env.klipFolio.idCalendarStart;
    else
        idKlip = env.klipFolio.idCalendarEnd;

    let bootsInput = document.getElementById(id);
    let klip = document.getElementById(idKlip);

    if (!klip || !bootsInput)
        return;
    
    
    klip = klip.querySelector('input');
    
    if (!klip)
    return;

    klip.value = bootsInput.value;
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
        option.value = sourceSelect.options[i].value;
        option.text = sourceSelect.options[i].text;
        targetSelect.add(option);
    }
  
    // Sincronizar selects
    targetSelect.addEventListener('change', function() {
        sourceSelect.value = this.value;
    });
}

function callFunc(func) {
    var interval = setInterval(func, 1000);
    setTimeout(function() {
        clearInterval(interval);
    }, 50000);
}


init();



//debugger;
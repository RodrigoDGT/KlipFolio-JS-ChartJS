var env = {
    klipFolio: {
        idCalendarStart: 'f9a931be-33',
        idCalendarEnd: '0d09e944-42',
        idBtnCalendar: '18740ca0-39',
        idClientSelect: 'c099f419-19'
    },
    bootstrap: {
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
    callFunc(replicateAndSyncSelects)
}

// Btn Pesquisar chama a função
function search() {
    btnBlockRequest();
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
    btnBoots.innerHTML = `Aguarde ${counter}`;
    
    var countdown = setInterval(function() {
        counter--;
        if (counter <= 0) {
            clearInterval(countdown);
            btnBoots.disabled = false;
            btnBoots.style.cursor = 'pointer';
            btnBoots.innerHTML = 'Pesquisar';
        } else {
            btnBoots.innerHTML = `Aguarde ${counter}`;
        }
    }, 1000);
}

function setStartAndEndDates() {
    let dateStart = document.getElementById('dateStart1');
    let dateEnd = document.getElementById('dateEnd1');
  
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
}
window.changeDateKlipCalendar = changeDateKlipCalendar;

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



debugger;







{
    "type"= "input",
    "id"= "0d09e944-42",
    "displayName"= "DataFim",
    "layoutConfig"= {
       "x": 1,
       "y": 4
    },
    "renamed"= true,
    "fmtArgs"= {
       "useEOD": true
    },
    "dstContext"= {
       "id": "dst0d09e94442",
       "kid": "d5e2ca1f0396bc3eb41880711bb1bd3a"
    },
    "components"= [
       {
          "type": "calendar_display_format",
          "role": "display_format",
          "id": "93f62010-45",
          "displayName": "Display Format",
          "fmt": "dat2",
          "fmtArgs": {
             "dateInputFormat": "dd/MM/yyyy",
             "dateFormat": "custom",
             "dateFormatCustom": "dd/MM/yyyy",
             "dateInputFormatCustom": "dd/MM/yyyy",
             "resultMetadata": {
                "ignoreDateFormat": false,
                "isAggregated": false,
                "resultAutoDetectedFmt": {
                   "fmtArgs": {},
                   "defaultAggregate": "COUNT",
                   "fmt": "txt"
                },
                "formulaIsDataPointer": false,
                "suggestedName": "Unnamed 1",
                "isDSTApplied": true,
                "resultCount": 1
             }
          },
          "formulas": [
             {
                "txt": "\"\"",
                "ver": 2
             }
          ],
          "data": [
             [
                ""
             ]
          ],
          "autoFmt": false
       },
       {
          "type": "output_format",
          "role": "output_format",
          "id": "d8988e02-46",
          "displayName": "Output Format",
          "fmt": "dat2",
          "fmtArgs": {
             "dateInputFormat": "MMMM d, yyyy",
             "dateFormat": "dd/MM/yyyy",
             "dateFormatCustom": "dd/MM/yyyy",
             "useEOD": "true",
             "resultMetadata": {
                "ignoreDateFormat": false,
                "isAggregated": false,
                "resultAutoDetectedFmt": {
                   "fmtArgs": {},
                   "defaultAggregate": "COUNT",
                   "fmt": "txt"
                },
                "formulaIsDataPointer": false,
                "suggestedName": "Unnamed 1",
                "isDSTApplied": true,
                "resultCount": 1
             }
          },
          "formulas": [
             {
                "txt": "\"\"",
                "ver": 2
             }
          ],
          "data": [
             [
                ""
             ]
          ],
          "autoFmt": false
       },
       {
          "type": "calendar_display_format",
          "role": "calendar_format",
          "id": "e4ea1f59-47",
          "displayName": "Calendar Format",
          "fmt": "dat2",
          "fmtArgs": {
             "dateInputFormat": "dd/MM/yyyy",
             "dateFormat": "MMMM d, yyyy",
             "dateFormatCustom": "MMMM d, yyyy",
             "dateInputFormatCustom": "dd/MM/yyyy",
             "resultMetadata": {
                "ignoreDateFormat": false,
                "isAggregated": false,
                "resultAutoDetectedFmt": {
                   "fmtArgs": {},
                   "defaultAggregate": "COUNT",
                   "fmt": "txt"
                },
                "formulaIsDataPointer": false,
                "suggestedName": "Unnamed 1",
                "isDSTApplied": true,
                "resultCount": 1
             }
          },
          "formulas": [
             {
                "txt": "\"\"",
                "ver": 2
             }
          ],
          "data": [
             [
                ""
             ]
          ],
          "autoFmt": false
       }
    ],
    "scope"= 2,
    "propName"= "handoverDateEnd",
    "inputType"= 4,
    "inputLabel"= "Fim",
    "submitAsGroup"= "1",
    "useButton"= "18740ca0-39****"
 }
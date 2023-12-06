var DateTime = {
    options: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    },
    newDate: function() {
        let date = new Date();
        return date.toLocaleDateString('pt-BR', this.options).split('/').reverse().join('-');
    },
    formatDate: function(dateString) {
        return new Date(dateString);
    },
    formatDateKlip: function(dateString) {
        let dateParts = dateString.split('-');
        let date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        return date.toLocaleDateString('pt-BR', this.options);
    }
}

function setCheckDate() {
    var spanElements = document.getElementsByClassName('classSpan');
    for (var i = 0; i < spanElements.length; i++) {
        checkLastHourCam(spanElements[i]);
    }
}

function checkLastHourCam(element) {
    let dateNow = new Date();
    let dateCam = new Date(element.textContent);
    
    // Dividir a data e a hora
    let [date, time] = element.textContent.split(' ');
    
    // Reorganizar a data no formato MM/dd/yyyy
    let [day, month, year] = date.split('/');
    let formattedDate = `${month}/${day}/${year} ${time}`;
    
    dateCam = new Date(formattedDate);
    let dif = dateNow - dateCam;
    let difHour = dif / (1000 * 60 * 60);

    // Verificar se dataCam é 1h antes de dataNow
    if(difHour >= 6) {
        element.style.color = 'red';
    } 
    else if (difHour >= 1){
        element.style.color = 'darkorange';
    }
    else {
        element.style.color = 'black';
    }
    
}

const intervalId = setInterval(() => {
    setCheckDate()
    //clearInterval(intervalId);
}, 30000 ); //30segundos
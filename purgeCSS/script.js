//npm run build
require.config({
    paths: {
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

//Criar Modal - usar require para buscar bootstrap
function createModal() {
    require(['bootstrap'], function (bootstrap) {
        var modal = new bootstrap.Modal(document.getElementById('exampleModal'), {
            keyboard: false
        });
    });
}
createModal()








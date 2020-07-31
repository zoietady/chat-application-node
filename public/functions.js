let scoket = io();
$(() => {
    $("#send").click(() => {
        let message = { name: $('#name').val(), message: $('#message').val() };
        $('#message').val('');
        postMessage(message);
    });

    $("#clear").click(() => {
        $('#messages').empty();
    });

    getMessages();
})

scoket.on('message', addMessage);

function addMessage(message) {
    $("#messages").append(`<h4>${message.name}</h4><p>${message.message}</p>`);
}

function getMessages() {
    $.get('/messages', (data) => {
        data.forEach(addMessage);
    })
}

function postMessage(message) {
    $.post('/messages', message)
}
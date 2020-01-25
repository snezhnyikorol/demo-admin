$('.delete').click(function (event) {
    console.log($(this).parent().find('th').text());
});

$('.add-quiz').click(function (event) {
    event.preventDefault();
    openEditor();
});

function openEditor(id) {
    if (id === undefined) {
        $('#table').fadeToggle("fast", ()=> $('#editor').fadeToggle("fast"));
    } else {
        $('#table').fadeToggle("fast", ()=> $('#editor').fadeToggle("fast"));
    }
}

$('tbody tr').click(function(event) {
    if (!($(event.target).hasClass('delete')||$(event.target).parent().hasClass('delete'))) {
        openEditor($(this).find('th').text())
    }
});
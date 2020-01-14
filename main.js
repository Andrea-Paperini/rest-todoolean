$(document).ready(function() {
    var html_template = $("#todo-template").html();
    var template_function = Handlebars.compile(html_template);
    stampa_todos();
    tasto_invio();
    // Creazione di un nuovo todo (intercetto il click sul button)
    $("#new-todo").click(function() {
        // recupero il testo inserito dall'utente
        var new_todo_text = $('#new-todo-text').val().trim();
        if (new_todo_text.length > 0) {
            // eseguo un reset dell'input
            $("#new-todo-text").val('');
            crea_todo(new_todo_text);
        } else {
            alert("inserisci il testo")
        }
    });

    function stampa_todos() {
        $.ajax({
            'url': 'http://157.230.17.132:3016/todos',
            'method': 'GET',
            'success': function(data) {
                $("#todo-list").empty();
                var todos = data;
                for (var i = 0; i < todos.length; i++) {
                    var todo_corrente = todos[i];
                    var testo_todo = todo_corrente.text;
                    var id_todo = todo_corrente.id;
                    var template_data = {
                        todo_id: id_todo,
                        todo_text: testo_todo
                    }
                    var html_todo = template_function(template_data);
                    $("#todo-list").append(html_todo);
                }
            },
            'error': function() {
                alert('errore');
            }
        });
    }

    function crea_todo(parametro1) {
        // faccio una chiamata per salvare il nuovo todo
        $.ajax({
            'url': 'http://157.230.17.132:3016/todos/',
            'method': 'POST',
            'data': {
                'text': parametro1
            },
            'success': function(data) {
                stampa_todos();
            },
            'error': function() {
                alert('errore');
            }
        });
    }
    // cancellazione todo (intercetto il click sul cestino)
    $("#todo-list").on("click", ".delete-todo", function() {
        // recupero l'id dell'item da cancellare
        var todo_id = $(this).parent().attr("data-todo_id");
        // chiamata DELETE
        $.ajax({
            'url': 'http://157.230.17.132:3016/todos/' + todo_id,
            'method': 'DELETE',
            'success': function(data) {
                stampa_todos();
            },
            'error': function() {
                alert('errore');
            }
        });
    })
    // creo una funzione keypress per avviare la ricerca digitando invio
    function tasto_invio() {
        $('#new-todo-text').keypress(function(event) {
            // debugger;
            if (event.which === 13) {
                $("#new-todo").trigger("click");
            }
        });
    };
});

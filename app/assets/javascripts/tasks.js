  $(function() {

    // The taskHtml method takes in a Javascript representation
    // of the task and produces and HTML representation using 
    // li tags
    function taskHtml(task) {
      var checkedStatus = task.done ? "checked" : "";
      var liClass = task.done ? "completed" : "";
      var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' + 
      '<div class="view"><input class="toggle" type="checkbox"' + 
      " data-id='" + task.id + "'" + 
      checkedStatus + 
      '><label>' + 
        task.title + 
        '<i class=" delete-button fa fa-remove" data-id="' + task.id + '">' + 
        '</i></label></div></li>';

      return liElement;
    }

    // The toggleTask method takes in an HTML representation of an event
    // that fires from an HTML representation of the toggle checkbox
    // and performs and API request to toggle the value of the 'done' field
    function toggleTask(e) {
      var itemId = $(e.target).data("id");
      var doneValue = Boolean($(e.target).is(':checked'));
      $.post("/tasks/" + itemId, {
        _method: "PUT",
        task: {
          done: doneValue
        }
      }).success(function(data) {
        var liHtml = taskHtml(data);
        var $li = $("#listItem-" + data.id);
        $li.replaceWith(liHtml);
        $('.toggle').change(toggleTask);
      });
    }

    function removeTask(e) {
      itemId = $(e.target).data("id");
      $.post("/tasks/" + itemId, {
        _method: "DELETE"
      }).success(function(data) {
        var liHtml = taskHtml(data);
        var $li = $("#listItem-" + data.id);
        $li.remove();
      });
    };

    function updateHtml() {
      $('.toggle').change(toggleTask);
      $('.delete-button').click(removeTask);
      $('ul li').hover(function() {
        $('i', this).addClass('hover-enabled');
      }, function() {
        $('i', this).removeClass('hover-enabled');
      });
    }

    $.get("/tasks").success( function( data ) {
      var htmlString = "";
      $.each(data, function(index, task) {
        htmlString += taskHtml(task);
      });
      var ulTodos = $('.todo-list');
      ulTodos.html(htmlString);
      updateHtml();
    });

    $('#new-form').submit(function(event) {
      event.preventDefault();
      var textbox = $('.new-todo');
      var payload = {
        task: {
          title: textbox.val()
        }
      };
      $.post("/tasks", payload).success(function(data) {
        var htmlString = taskHtml(data);
        var ulTodos = $('.todo-list');
        ulTodos.append(htmlString);
        updateHtml();
        $('.new-todo').val('');
      });
    });
  });

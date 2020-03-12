let idCount = 0;
let sidebarHidden = true;
let menuSidebarHidden = true;
let pageData;
let $tree = $('#tree');
let treeData;
let menuTimer;
let $root = $('html, body');

toggleMenuSidebar();

$('.delete').click(function (event) {
    $('#deleteModal').modal('show');
    let id = $(this).parent().data('id');
    $('#deleteModal').find("[name='id']").val(id);
});

$("#deleteForm").submit(function (event) {
  event.preventDefault();
  $(`tbody tr[data-id='${this.id.value}']`).remove();
  $('#deleteModal').modal('hide');
});

$('.add-quiz').click(function (event) {
    event.preventDefault();
    $('#createModal').modal('show');
    $("#createForm [name='id']").val(`f${(+new Date).toString(16)}`);
});

$("#createForm").submit(function (event) {
  event.preventDefault();
  let data = {};
  data = {
    name: this.title.value,
    id: this.id.value,
    type: 'profile'
  };
  $('#createModal').modal('hide');
  openEditor();
  render(data);
});

function getProfile(id) {
  pageData = fetch('./assets/data.json')
    .then(responce => responce.json())
    .then((res) => {
      openEditor();
      render(res[id]);
    })
    .catch(error => console.error(error));
}

function openEditor() {
  $('#table').fadeToggle("fast", ()=> $('#editor').fadeToggle("fast"));
  toggleSidebar();
  toggleMenuSidebar();
  $('.menu').show(400);

    // else {
    //     $('#table').fadeToggle("fast", ()=> $('#editor').fadeToggle("fast"));
    //     toggleSidebar();
    //     toggleMenuSidebar();
    //     $('.menu').show(400);
    // }
}

$('tbody tr').click(function(event) {
    if (!($(event.target).hasClass('delete')||$(event.target).parent().hasClass('delete'))) {
        getProfile($(this).data('id'));
    }
});



function toggleSidebar() {
    if (sidebarHidden) {
        $('.sidebar').css({
            'left': '0',
        });
        $('.page__wrapper').css({
            'width': 'calc(100% - 300px)'
        });
        sidebarHidden = false;
    } else {
        $('.sidebar').css({
            'left': '-300px',
        });
        $('.page__wrapper').css({
            'width': '100%'
        });
        sidebarHidden = true;
    }
}

function toggleMenuSidebar() {
  if (menuSidebarHidden) {
    $('.sidebar_menu').css({
      'left': '0',
    });
    $('.page__wrapper').css({
      'width': 'calc(100% - 300px)'
    });
    menuSidebarHidden = false;
  } else {
    $('.sidebar_menu').css({
      'left': '-300px',
    });
    menuSidebarHidden = true;
  }
}

$('.menu').click(function () {
  if (!menuSidebarHidden) {
    clearTimeout(menuTimer);
    toggleMenuSidebar();
  } else {
    toggleMenuSidebar();
    menuTimer = setTimeout(toggleMenuSidebar, 15000);
  }


});

$('.sidebar__collapse').click(function () {
    $(this).parent().find('.sidebar__container').slideToggle(100);
});

function renderTree(treeSource) {
    $tree.tree({
        data: treeSource,
        autoOpen: true,
        dragAndDrop: true,
        closedIcon: $('<img src="./assets/img/expand.svg" style="transform: rotate(-90deg)"><img>'),
        openedIcon: $('<img src="./assets/img/expand.svg"><img>'),
      onCanMoveTo: processMoveTo,
      onCanMove: processMove,
        onCreateLi: function(node, $li) {
            // Append a link to the jqtree-element div.
            // The link has an url '#node-[id]' and a data property 'node-id'.
            let text = $li.find('.jqtree-element .jqtree-title').text();
            $li.find('.jqtree-element .jqtree-title').text('');
            $li.find('.jqtree-element .jqtree-title').html(`<span class="title">${text}</span>`);
            $li.find('.jqtree-element .jqtree-title').prepend(
              '<a href="#node-'+ node.id +'" class="add-sub" data-node-id="'+ node.id +'"><img class="add-sub__img" src="./assets/img/file.svg" alt=""></a>'
            );
            $li.find('.jqtree-element .jqtree-title').append(
              '<a href="#node-'+ node.id +'" class="edit" data-toggle="modal" data-target="#renameModal" data-id="'+ node.id +'"><img class="edit__img" src="./assets/img/edit.svg" alt=""></a>'
            );
            if (node.type == 'question') {
              // $li.css({'display': 'none'});
            }
        }
    });
}


$tree.on('tree.refresh', function (e) {
    treeData = JSON.parse($tree.tree('toJson'))[0];
    update(treeData);
});

$('.add-sub__img').hover(function (e) {
    let node = $tree.tree('getNodeById', $(this).parent().data('node-id'));
    if (node.type == 'stage') {
      $(this).attr('src', './assets/img/add.svg');
    }
  },
  function (e) {
    let node = $tree.tree('getNodeById', $(this).parent().data('node-id'));
    if (node.type = 'stage') {
      $(this).attr('src', './assets/img/file.svg');
    }
  });

function renderStage(stageData) {
  $('#editor').html('<p>Stage settings</p>');
}

function renderSection(categoryData) {
    $('#editor').html(
      `<form id="form">
        <div class="save-container d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">Save</button>
        </div>
        <div id="category${categoryData.id}">
            <h3 class="mt-3">${categoryData.name}</h3>
            <div class="container-sm pl-5" id="section-container">
                
            </div>
            <div class="d-flex justify-content-center mt-4">
                <button class="btn btn-primary add-question">Add question</button>
            </div>
        </div>
        <div class="submit-container d-flex justify-content-center mt-5">
            <button type="submit" class="btn btn-primary">Submit</button>
        </div>
       </form>  
    `
    );
    $('.add-question').click(function (event) {
      event.preventDefault();
      let id = categoryData.id;
      let node = $tree.tree('getNodeById', id);
      let questionId = `f${(+new Date).toString(16)}`;
      $tree.tree(
        'appendNode',
        {
          name: '',
          id: questionId,
          type: 'question',
        },
        node
      );
      renderQuestion(            {
        "type": "question",
        "name": "",
        "id": questionId,
        "isActive": false,
        "elements": []});
    });

    if (categoryData.hasOwnProperty('children')) {
      categoryData.children.forEach(el => renderQuestion(el))
    }

}

function renderQuestion(questionData) {
  $('#section-container').append(`

            <div class="question__item my-3" id="question${questionData.id}">
                <div class="custom-control custom-checkbox enable">
                    <input type="checkbox" name="enabledQuestion" class="custom-control-input" id="enable${questionData.id}" value="1">
                    <label class="custom-control-label" for="enable${questionData.id}"></label>
                </div>
                <div class="question__header form-row">
                    <div class="col-9">
                        <input type="text" name="title" class="form-control" placeholder="Title" value="${questionData.name}">
                    </div>
                    <div class="col-3">
                        <select name="type" class="custom-select">
                            <option>Choose type...</option>
                            <option value="1">Input</option>
                            <option value="2">Switch</option>
                            <option value="3">Checkbox</option>
                            <option value="4">Radio</option>
                            <option value="5">Select</option>
                            <option value="6">Multiple select</option>
                            <option value="7">Range</option>
                            <option value="8">File</option>
                        </select>            
                    </div>
                    <div class="remove" onclick="removeQuestion('${questionData.id}')">-</div>
                </div>  
                <div class="question__body mt-2 d-flex flex-column justify-content-center" id="question-container${questionData.id}">
                    <h5>Elements</h5>

                </div>
            </div>  
  
    `);
  if (questionData.hasOwnProperty('inputType')) {
    $(`#question${questionData.id}`).find(`select[name="type"] option[value=${questionData.inputType}]`).attr('selected', 'selected');
  }
  $(`#question${questionData.id}`).find(`input[name="enabledQuestion"]`).prop('checked',questionData.isActive);
  if (questionData.hasOwnProperty('elements')) {
    questionData.elements.forEach(el => renderElement(el, questionData.id));
  }
  $(`#question-container${questionData.id}`).append(`<button class="btn btn-primary add-item align-self-center mt-2" data-id="${questionData.id}">Add item</button>`);
  $('.add-item').click(function (event) {
    event.preventDefault();
    let id = $(this).data('id');
    let itemId = `f${(+new Date).toString(16)}`;
    let node = $tree.tree('getNodeById', id);
    if (node.hasOwnProperty('elements')) {
      let elements = node.elements;
      elements.push(            {
        text: "",
        value: "",
        id: itemId
      });
      $tree.tree(
        'updateNode',
        node,
        {
          elements: node.elements
        },
      )
    } else {
      $tree.tree(
        'updateNode',
        node,
        {
          elements: [{
            text: "",
            value: "",
            id: itemId
          }]
        },
      )
    }
    $(this).before(`
        <div class="question__element my-1 form-row" id="${itemId}">
            <div class="col-9">
                <input type="text" name="elText" class="form-control" placeholder="Text" value="">
            </div>
            <div class="col-3">
                <input type="text" name="elValue" class="form-control" placeholder="Value" value="">
            </div>
            <div class="remove" onclick="removeElement(${itemId})">-</div>
        </div>    
    `);
  });
}

function renderElement(elementData, parentId) {
    $(`#question-container${parentId}`).append(`
        <div class="question__element my-1 form-row" id="${elementData.id}">
            <div class="col-9">
                <input type="text" name="elText" class="form-control" placeholder="Text" value="${elementData.text}">
            </div>
            <div class="col-3">
                <input type="text" name="elValue" class="form-control" placeholder="Value" value="${elementData.value}">
            </div>
            <div class="remove" onclick="removeElement(${elementData.id})">-</div>
        </div>    
    `);
}



function render(res) {
    renderTree([res]);
    $tree.tree('selectNode', $tree.tree('getNodeById', res.children[0].children[0].id));
    treeData = JSON.parse($tree.tree('toJson'))[0];
}

function update(res) {
    $('.add-sub__img').hover(function (e) {
        let node = $tree.tree('getNodeById', $(this).parent().data('node-id'));
          if (node.type == 'stage') {
            $(this).attr('src', './assets/img/add.svg');
          }
      },
      function (e) {
        let node = $tree.tree('getNodeById', $(this).parent().data('node-id'));
        if (node.type == 'stage') {
          $(this).attr('src', './assets/img/file.svg');
        }
      });
}

$tree.on( 'click', '.add-sub',function(e) {
    // Get the id from the 'node-id' data property
    let node_id;
    if ($(e.target).hasClass('add-sub__img')) {
        node_id = $(e.target).parent().data('node-id');
    } else {
        node_id = $(e.target).data('node-id');
    }

    // Get the node from the tree
    let node = $tree.tree('getNodeById', node_id);
    console.log(node.type);
  if (node.type == 'stage') {
    $tree.tree('appendNode', {
        id: idCount++,
        name: 'newnode' + idCount,
        type: "section"
      },
      node);
    if ($tree.tree('getState').open_nodes.indexOf(node.id) == -1) {
      $tree.tree('openNode', node);
    }
  }
});

function updateTitle(id, title) {
    let node = $tree.tree('getNodeById', id);
    $tree.tree(
      'updateNode',
      node,
      {
          name: title,
      }
    );
    $(`#category${id} h3`).text(title);
}

$tree.on(
  'tree.select',
  function(event) {
    if (event.node) {
      var node = event.node;
      if (node.type == 'section') {
        renderSection(node);
      }
      if (node.type == 'stage') {
        renderStage(node);
      }
    }
  }
);

$('#renameModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget);
  let id = button.data('id');
  let modal = $(this);
  let title = button.parent().find('span').text();
  modal.find('.modal-body [name=title]').val(title);
  modal.find('.modal-body [name=id]').val(id);
});

$('#titleForm').on('submit', function (event) {
  event.preventDefault();
  updateTitle(this.id.value, this.title.value);
  $('#renameModal').modal('hide');
});

function processMove(node) {
  return node.type == 'section';
}

function processMoveTo(movedNode, targetNode, position) {
  return (targetNode.type == 'stage' && position == 'inside' && movedNode.parent.id == targetNode.id) || (targetNode.type == 'section' && position != 'inside' && movedNode.parent.id == targetNode.parent.id);
}
  // function

function removeElement(id) {
  // console.log(id);
  // $('#'+id).remove();
  $(id).remove();
}

function removeQuestion(id) {
  console.log(id);
  $('#question'+id).remove();
}



// $('#editor').html(generateProfile(pageData));







// $('#form').submit(function (e) {
//     e.preventDefault();
//     if (!sidebarHidden) {
//         toggleSidebar();
//         $('.menu').hide(400);
//         /*submit actions */
//     }
// });


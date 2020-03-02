let idCount = 0;
let pageData;
let $tree = $('#tree');
let treeData;
let $root = $('html, body');

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
        toggleSidebar();
        $('.menu').show(400);
    } else if(id == 1) {
        pageData = fetch('./assets/data.json')
          .then(responce => responce.json())
          .then((res) => {
              render(res);
          })
          .catch(error => console.error(error));
        $('#table').fadeToggle("fast", ()=> $('#editor').fadeToggle("fast"));
        toggleSidebar();
        $('.menu').show(400);
    } else {
        $('#table').fadeToggle("fast", ()=> $('#editor').fadeToggle("fast"));
        toggleSidebar();
        $('.menu').show(400);
    }
}

$('tbody tr').click(function(event) {
    if (!($(event.target).hasClass('delete')||$(event.target).parent().hasClass('delete'))) {
        openEditor($(this).find('th').text())
    }
});

let sidebarHidden = true;

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

$('.menu').click(toggleSidebar);

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

        }
    });
}

$('#tree1').on(
  'tree.click',
  function(event) {
      // The clicked node is 'event.node'
      var node = event.node;
      alert(node.name);
  }
);



$tree.on('tree.refresh', function (e) {
    treeData = JSON.parse($tree.tree('toJson'))[0];
    update(treeData);

});

$('.add-sub__img').hover(function () {
      $(this).attr('src', './assets/img/add.svg');
  },
  function () {
      $(this).attr('src', './assets/img/file.svg');
  });

function renderProfile(profileData) {
    return (`
        <form id="form">
            <input type="text" name="name" value="${profileData.name}" class="form-control mb-2" placeholder="Name">
                ${profileData.children.map(el => el.type == "category" ? renderCategory(el) : renderQuestion(el)).join('')}
                <div class="form-row mt-5">
                    <div class="col-6 d-flex justify-content-center">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                    <div class="col-6 d-flex justify-content-center">
                        <button class="btn btn-danger">Cancel</button>
                    </div>
                </div>
        </form>   
       `)
}

function renderCategory(categoryData) {
    if (categoryData.hasOwnProperty('children')) {
        return (`
        <div id="category${categoryData.id}">
            <h3 class="mt-3">${categoryData.name}</h3>
            <div class="container-sm pl-5">
                ${categoryData.children.map(el => el.type == "category" ? renderCategory(el) : renderQuestion(el)).join('')}
            </div>
            <div class="d-flex justify-content-center mt-4">
                <button class="btn btn-primary add-question" data-id="${categoryData.id}">Add question</button>
            </div>
        </div>
    `);
    }
    return (`
        <div id="category${categoryData.id}">
            <h3 class="mt-3">${categoryData.name}</h3>
            <div class="container-sm pl-5">

            </div>
            <div class="d-flex justify-content-center mt-4">
                <button class="btn btn-primary add-question" data-id="${categoryData.id}">Add question</button>
            </div>
        </div>
    `);
}

function renderQuestion(questionData) {
    if (questionData.hasOwnProperty('elements')) {
        let temp = (`
        <div>
            <div class="question__item my-3" id="question${questionData.id}">
                <div class="custom-control custom-checkbox enable">
                    <input type="checkbox" name="enabledQuestion" class="custom-control-input" id="enable1" value="1">
                    <label class="custom-control-label" for="enable1"></label>
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
                    <div class="remove">-</div>
                </div>  
                <div class="question__body mt-2 d-flex flex-column justify-content-center">
                    <h5>Elements</h5>
                    ${questionData.elements.map(el => renderElement(el, questionData.id)).join('')}
                    <button class="btn btn-primary add-item align-self-center mt-2" data-id="${questionData.id}">Add item</button>
                </div>
            </div>  
        </div>    
    `);
        let $temp = $(temp);
        $temp.find(`select[name="type"] option[value=${questionData.inputType}]`).attr('selected', 'selected');
        // $temp.find(`input[name="enabledQuestion"]`).prop('checked', questionData.isActive);
        return $temp.html();
    }
    return (`
        <div>
            <div class="question__item my-3" id="question${questionData.id}">
                <div class="custom-control custom-checkbox enable">
                    <input type="checkbox" name="enabledQuestion" class="custom-control-input" id="enable1" value="1">
                    <label class="custom-control-label" for="enable1"></label>
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
                    <div class="remove">-</div>
                </div>  
                <div class="question__body mt-2 d-flex flex-column justify-content-center">
                    <h5>Elements</h5>
                    
                    <button class="btn btn-primary add-item align-self-center mt-2" data-id="${questionData.id}">Add item</button>
                </div>
            </div>  
        </div>    
    `);
}

function renderElement(elementData, parentId) {

    return (`
        <div class="question__element my-1 form-row" data-parent="${parentId}">
            <div class="col-9">
                <input type="text" name="elText" class="form-control" placeholder="Text" value="${elementData.text}" id="${elementData.id}">
            </div>
            <div class="col-3">
                <input type="text" name="elValue" class="form-control" placeholder="Value" value="${elementData.value}" id="${elementData.id}">
            </div>
            <div class="remove">-</div>
        </div>    
    `)
}


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


function render(res) {
    renderTree([res]);
    update(res);
    treeData = JSON.parse($tree.tree('toJson'))[0];
}

function update(res) {
    $('#editor').html(renderProfile(res));
    $('.add-question').click(function (event) {
        event.preventDefault();
        let id = $(this).data('id');
        let node = $tree.tree('getNodeById', id);
        $tree.tree(
          'appendNode',
          {
              name: '',
              id: `f${(+new Date).toString(16)}`
          },
          node
        );
    });

    $('.add-item').click(function (event) {
        event.preventDefault();
        let id = $(this).data('id');
        let node = $tree.tree('getNodeById', id);
        if (node.hasOwnProperty('elements')) {
            let elements = node.elements;
            elements.push(            {
                text: "",
                value: "",
                id: `f${(+new Date).toString(16)}`
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
                      id: `f${(+new Date).toString(16)}`
                  }]
              },
            )
        }
    });

    $("[name='elValue']").change(function (event) {
        let parentNode = $tree.tree('getNodeById', $(this).parent().parent().data('parent'));
        let elements = parentNode.elements;
        elements.forEach((el) => {
           if (el.id == this.id) {
                el.value = this.value;
           }
        });
        $tree.tree(
          'updateNode',
          parentNode,
          {
              elements: elements,
          }
        );
    });

    $("[name='elText']").change(function (event) {
        let parentNode = $tree.tree('getNodeById', $(this).parent().parent().data('parent'));
        let elements = parentNode.elements;
        elements.forEach((el) => {
            if (el.id == this.id) {
                el.text = this.value;
            }
        });
        $tree.tree(
          'updateNode',
          parentNode,
          {
              elements: elements,
          }
        );
    });



    $('.add-sub__img').hover(function () {
          $(this).attr('src', './assets/img/add.svg');
      },
      function () {
          $(this).attr('src', './assets/img/file.svg');
      });
    $tree.on(
      'tree.click',
      function(event) {
          let node = event.node;
          if (node.type == 'category') {
              $root.animate({
                  scrollTop: $( `#category${node.id}` ).offset().top - 100
              }, 500);
          } else if (node.type == 'question') {
              $root.animate({
                  scrollTop: $( `#question${node.id}` ).offset().top - 100
              }, 500);
          }

      }
    );

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
    $tree.tree('appendNode', {
          id: idCount++,
          name: 'newnode' + idCount,
        type: "category"
      },
      node);
    if ($tree.tree('getState').open_nodes.indexOf(node.id) == -1) {
        $tree.tree('openNode', node);
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
}





// function






// $('#editor').html(generateProfile(pageData));







// $('#form').submit(function (e) {
//     e.preventDefault();
//     if (!sidebarHidden) {
//         toggleSidebar();
//         $('.menu').hide(400);
//         /*submit actions */
//     }
// });


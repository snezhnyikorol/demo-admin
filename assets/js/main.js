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

let sidebarHidden = true;

$('.menu').click(function () {
    if (sidebarHidden) {
        $('.sidebar').css({'left': '0'});
        sidebarHidden = false;
    } else {
        $('.sidebar').css({'left': '-500px'});
        sidebarHidden = true;
    }
});

$('.sidebar__collapse').click(function () {
    $(this).parent().find('.sidebar__container').slideToggle(100);
});



//
// let currentDroppable = null;
//
// let items = document.querySelectorAll('.sidebar__item');
// [].forEach.call(items, function(item) {
//     item.addEventListener('dragstart', function(event) {
//         event.preventDefault();
//     });
//
//     item.addEventListener('mousedown', function(event) {
//
//         let shiftX = event.clientX - event.currentTarget.getBoundingClientRect().left;
//         let shiftY = event.clientY - event.currentTarget.getBoundingClientRect().top;
//
//         event.currentTarget.style.position = 'absolute';
//         event.currentTarget.style.zIndex = 1000;
//         document.body.append(event.currentTarget);
//
//         moveAt(event.pageX, event.pageY);
//
//         function moveAt(pageX, pageY) {
//             event.currentTarget.style.left = pageX - shiftX + 'px';
//             event.currentTarget.style.top = pageY - shiftY + 'px';
//         }
//
//         function onMouseMove(event) {
//             moveAt(event.pageX, event.pageY);
//
//             event.currentTarget.hidden = true;
//             let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
//             event.currentTarget.hidden = false;
//
//             if (!elemBelow) return;
//
//             let droppableBelow = elemBelow.closest('.droppable');
//             if (currentDroppable != droppableBelow) {
//                 if (currentDroppable) { // null when we were not over a droppable before this event
//                     leaveDroppable(currentDroppable);
//                 }
//                 currentDroppable = droppableBelow;
//                 if (currentDroppable) { // null if we're not coming over a droppable now
//                     // (maybe just left the droppable)
//                     enterDroppable(currentDroppable);
//                 }
//             }
//         }
//
//         document.addEventListener('mousemove', onMouseMove);
//
//         event.currentTarget.onmouseup = function() {
//             document.removeEventListener('mousemove', onMouseMove);
//             event.currentTarget.onmouseup = null;
//         };
//
//     })
// });
//
//
// function enterDroppable(elem) {
//     elem.style.background = 'pink';
// }
//
// function leaveDroppable(elem) {
//     elem.style.background = '';
// }
var $tree = $('#tree1');

let lastId = 5;
let data = [
    {
        name: 'node1', id: 1,
        children: [
            { name: 'child1', id: 2 },
            { name: 'child2', id: 3 }
        ]
    },
    {
        name: 'node2', id: 4,
        children: [
            { name: 'child3', id: 5 }
        ]
    }
];
$tree.tree({
    data: data,
    autoOpen: true,
    dragAndDrop: true,
    closedIcon: $('<img src="./assets/img/expand.svg" style="transform: rotate(-90deg)"><img>'),
    openedIcon: $('<img src="./assets/img/expand.svg"><img>'),
    onCreateLi: function(node, $li) {
        // Append a link to the jqtree-element div.
        // The link has an url '#node-[id]' and a data property 'node-id'.
        $li.find('.jqtree-element .jqtree-title').prepend(
          '<a href="" class="edit" data-node-id="'+ node.id +'"><img class="edit__img" src="./assets/img/file.svg" alt=""></a>'
        );

    }
});

$tree.on( 'click', '.edit',function(e) {
    // Get the id from the 'node-id' data property
    let node_id;
    if ($(e.target).hasClass('edit__img')) {
        node_id = $(e.target).parent().data('node-id');
    } else {
        node_id = $(e.target).data('node-id');
    }

    // Get the node from the tree
    var node = $tree.tree('getNodeById', node_id);
    $tree.tree('appendNode', {
        id: lastId += 1,
        name: 'newnode' + lastId,
    },
      node);
    if ($tree.tree('getState').open_nodes.indexOf(node.id) == -1) {
        $tree.tree('openNode', node);
    }
});

$tree.on('tree.refresh', function (e) {
    $('.edit__img').hover(function () {
          $(this).attr('src', './assets/img/add.svg');
      },
      function () {
          $(this).attr('src', './assets/img/file.svg');
      });
});

$('.edit__img').hover(function () {
      $(this).attr('src', './assets/img/add.svg');
  },
  function () {
      $(this).attr('src', './assets/img/file.svg');
  });


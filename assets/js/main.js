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
        $('.menu').show();
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
          '<a href="#node-'+ node.id +'" class="edit" data-node-id="'+ node.id +'"><img class="edit__img" src="./assets/img/file.svg" alt=""></a>'
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


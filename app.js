// helper functions 
function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

function getCardIndex(cards, id) {
  var index = -1;
  for (var i=0; i<cards.length; i++) {
    var c = cards[i];
    if (c.id == id) {
      index = i;
    }
  }
  return index;
}

// boards = [{
//   title: "Todo",
//   cards: [{title:"groceries", id:0}, {title:"get a job", id:1}]
// }, {
//   title: "Love",
//   cards: [{title:"find love", id:0}, {title:"go on tinder", id:1}]
// }]

// var app = new Vue({
//   el: '#app',
//   data: {
//     boards: boards
//   },  
// })

// Vue.component('board', {
//   data: function () {
//     return {
//       count: 0
//     }
//   },
//   template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
// })


// APP
var app = new Vue({
  el: '#app',
  data: {
    title: "Todo",
    cards: [{title:"find love", id:0}, {title:"get a job", id:1}],
    toggleTitle: false,
    toggle: null, // toggle specific card edit
    toggleCard: false, // toggle new card add
    newCardTitle: '', 
    uidcounter: 2
  },
  methods: {
    test: function() {
      console.log("test");
    },
    editTitle: function(title) {
      this.title = title;
    },
    removeBoard: function() {

    },
    // CRUDS
    editCard: function(card) {
      // find index
      var index = getCardIndex(this.cards, card.id);

      if (index != -1) {
        this.cards[index].title = card.title;
        this.toggle = null;
      }
    },
    removeCard: function(card) {
      let index = this.cards.indexOf(card);
      this.cards.splice(index, 1);
    },
    addCard: function(newCardTitle) {
      if (!newCardTitle) 
        return

      var obj = {title: newCardTitle, id: this.uidcounter};
      this.uidcounter++;
      this.cards.push(obj);

      // clean up
      this.newCardTitle = '';
      this.toggleCard = false;
    },
    // DRAGS
    drag: function(event) {
      event.dataTransfer.setData("id", event.target.id);
    },
    drop: function(event) {
      event.preventDefault();

      // reorder cards

      // destination id (event.target.id)
      var destinationId = event.target.id;
      destinationId = parseInt(destinationId.split("-")[1]);
      var destinationIndex = getCardIndex(this.cards, destinationId);

      // dragged id (event.dataTransfer.getData("id"))
      var draggedId = event.dataTransfer.getData("id");
      draggedId = parseInt(draggedId.split("-")[1]);
      var draggedIndex = getCardIndex(this.cards, draggedId);

      // reorder draggedId ahead of destinationId in cards array
      if (destinationIndex != -1 && draggedIndex != -1) {
        var out = this.cards.splice(draggedIndex, 1)[0];
        this.cards.splice(destinationIndex, 0, out);
      }
      
    }

  }
})

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

function getIndex(arr, id) {
  var index = -1;
  for (var i=0; i<arr.length; i++) {
    var o = arr[i];
    if (o.id == id) {
      index = i;
    }
  }
  return index;
}

Vue.component('board', {
  props: ['idprop', 'titleprop', 'cardsprop', 'uidcounterprop'],
  data: function () {
    return {
      id: this.idprop,
      title: this.titleprop,
      cards: this.cardsprop,
      toggleTitle: false,
      toggle: null, // toggle specific card edit
      toggleCard: false, // toggle new card add
      newCardTitle: '', 
      uidcounter: this.uidcounterprop
    }
  },
  methods: {
    test: function() {
      console.log("test");
    },
    editTitle: function(title) {
      this.title = title;
    },
    removeBoard: function() {
      this.$parent.removeBoard(this.id);
    },
    // CRUDS
    editCard: function(card) {
      // find index
      var index = getIndex(this.cards, card.id);

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
      console.log("dragging", event.target.id);
    },
    drop: function(event) {
      event.preventDefault();

      console.log("dropping " + event.target.id);
      // reorder cards

      var destinationId = event.target.id;
      var draggedId = event.dataTransfer.getData("id");
      
      // check if both cards
      if (destinationId.startsWith("card-") && draggedId.startsWith("card-")) {
        // destination id (event.target.id)
        destinationId = parseInt(destinationId.split("-")[1]);
        var destinationIndex = getIndex(this.cards, destinationId);
  
        // dragged id (event.dataTransfer.getData("id"))
        draggedId = parseInt(draggedId.split("-")[1]);
        var draggedIndex = getIndex(this.cards, draggedId);
  
        // reorder draggedId ahead of destinationId in cards array
        if (destinationIndex != -1 && draggedIndex != -1) {
          var out = this.cards.splice(draggedIndex, 1)[0];
          this.cards.splice(destinationIndex, 0, out);
        }
      }
    }
  }, 
  template: `
    <div>
      <!-- title of board -->
      <!-- toggled view -->
      <template v-if="toggleTitle">
        <input v-model="title" type="text">
        <button v-on:click="toggleTitle = !toggleTitle">Save</button>
        <button v-on:click="toggleTitle = !toggleTitle">Back</button>
      </template>

      <!-- normal view -->
      <template v-else>
        <b>{{title}}</b>
        <button v-on:click="toggleTitle = !toggleTitle">Edit</button>
        <button v-on:click="removeBoard()">Remove</button>
      </template>      

      <ul>
        <!-- list cards -->
        <li 
          v-for="c in cards"
          v-bind:id="'card-' + c.id"
          draggable="true"
          v-on:dragstart="drag($event)"
          v-on:dragover="$event.preventDefault()"
          v-on:drop="drop($event)"
          >
          <!-- toggled view -->
          <template v-if="toggle == c.id">
            <input v-model="c.title" type="text">
            <button v-on:click="editCard(c)">Save</button>
            <button v-on:click="toggle = null">Back</button>
          </template>

          <!-- normal view -->
          <template v-else>
            {{c.title}}
            <button v-on:click="toggle = c.id">Edit</button>
            <button v-on:click="removeCard(c)">Remove</button>
          </template>
        </li>
        <!-- new card section -->
        <li>
          <!-- toggled card view -->
          <template v-if="toggleCard == true">
            <input v-model="newCardTitle" type="text">
            <button v-on:click="addCard(newCardTitle)">Save</button>
            <button v-on:click="toggleCard = !toggleCard">Back</button>
          </template>
          <!-- normal view -->
          <template v-else>
            <button v-on:click="toggleCard = true">Add Card</button>
          </template>
        </li>
      </ul>  
    </div>
  `
})

boards = [{
  id: 0,
  title: "Todo",
  cards: [{title:"groceries", id:0}, {title:"get a job", id:1}]
}, {
  id: 1,
  title: "Love",
  cards: [{title:"find love", id:0}, {title:"go on tinder", id:1}]
}]

// APP
var app = new Vue({
  el: '#app',
  data: {
    boards: boards,
    newBoard: '',
    toggle: false
  },
  methods: {
    addBoard: function(newBoard) {
      newB = {
        id: this.boards.length,
        title: newBoard,
        cards: []
      }

      boards.push(newB);
      this.newBoard = '';
      this.toggle = false;
    },
    removeBoard: function(id) {
      let index = getIndex(this.boards, id);
      this.boards.splice(index, 1);
    },
    // DRAGS
    drag: function(event) {
      console.log("dragging", event.target.id);
      event.dataTransfer.setData("id", event.target.id);
    },
    drop: function(event) {
      event.preventDefault();

      console.log("dropping " + event.target.id);
      // reorder boards

      var destinationId = event.target.id;
      var draggedId = event.dataTransfer.getData("id");
      
      // check if both boars
      if (destinationId.startsWith("board-") && draggedId.startsWith("board-")) {
        // destination id (event.target.id)
        console.log(destinationId);
        destinationId = parseInt(destinationId.split("-")[1]);
        var destinationIndex = getIndex(this.boards, destinationId);
  
        // dragged id (event.dataTransfer.getData("id"))
        draggedId = parseInt(draggedId.split("-")[1]);
        var draggedIndex = getIndex(this.boards, draggedId);
  
        // reorder draggedId ahead of destinationId in cards array
        if (destinationIndex != -1 && draggedIndex != -1) {
          var out = this.boards.splice(draggedIndex, 1)[0];
          this.boards.splice(destinationIndex, 0, out);
        }
      }
      
    }    
  }
})

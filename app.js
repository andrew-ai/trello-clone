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
    <table>
        <!-- title of board -->
        <tr>
            <!-- normal view -->
            <th v-if="!toggleTitle">
                {{title}}
                <!-- edit btn -->
                <button v-on:click="toggleTitle = !toggleTitle"><i class="fas fa-edit"></i></button>
                <!--remove btn-->
                <button v-on:click="removeBoard()"><i class="fas fa-trash"></i></button>
            </th>
    
            <!-- toggled view-->
            <th v-else>
                <input v-model="title" type="text">
                <!--save-->
                <button v-on:click="toggleTitle = !toggleTitle"><i class="fas fa-save"></button>
                <!--back-->
                <button v-on:click="toggleTitle = !toggleTitle"><i class="fas fa-arrow-left"></button>
            </th>
        </tr>
    
        <!-- list cards-->
        <tr v-for="c in cards"
            v-bind:id="'card-' + c.id"
            draggable="true"
            v-on:dragstart="drag($event)"
            v-on:dragover="$event.preventDefault()"
            v-on:drop="drop($event)">
            <td>
                <!-- normal view -->
                <template v-if="toggle != c.id">
                    {{c.title}}
                    <!--edit-->
                    <button v-on:click="toggle = c.id"><i class="fas fa-edit"></button>
                    <!--remove-->
                    <button v-on:click="removeCard(c)"><i class="fas fa-trash"></button>
                </template>
    
                <!-- toggled view -->
                <template v-else>
                    <input v-model="c.title" type="text">
                    <button v-on:click="editCard(c)"><i class="fas fa-save"></button>
                    <button v-on:click="toggle = null"><i class="fas fa-arrow-left"></button>
                </template>
            </td>
        </tr>
    
        <!-- new card row -->
        <tr><td>
            <!-- normal view -->
            <template v-if="!toggleCard">
                <button v-on:click="toggleCard = true"><i class="fas fa-plus"></button>
            </template>
            <!-- toggled view -->
            <template v-else>
                <input v-model="newCardTitle" type="text">
                <button v-on:click="addCard(newCardTitle)"><i class="fas fa-save"></button>
                <button v-on:click="toggleCard = !toggleCard"><i class="fas fa-arrow-left"></button>
            </template>
        </td></tr>
        
    </table>
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

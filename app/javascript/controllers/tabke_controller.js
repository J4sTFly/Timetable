import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'table' ]

  selectedRecords = document.querySelector('#selected_records')
  
  toggleSelection() {
    const _this = this;
    if (this.checked) {
      Array.from(document.querySelectorAll('input.'))
    } else {
      document.querySelectorAll('')
    }
  }

  select(el) {
    this.checked = "checked";
    let _selectedRecords = this.selectedRecords.value.split(',')
    if (_selectedRecords.include(el.dataset.id)) {
      
    }
  }

  deselect() {}

  toggleProlongButton() {
  }

  prolongSelected() {
  }

  new() {
  }

  create() {
  }

  updateTable() {

  }
}

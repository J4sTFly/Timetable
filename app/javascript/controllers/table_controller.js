import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'table' ]
  
  editingElement = null;
  
  toggleSelectAll(e, element) {
    const records = Array.from(document.querySelectorAll('input.record-select-checkbox'))
    if (e.target.checked) {
      records.forEach((el) => {
        el.checked = true;
      })
    } else {
      records.forEach((el) => {
        el.checked = false;
      })
    }
    this.toggleProlongBtn()
  }

  updateCompletion(e) {
    e.target.disabled = true;
    const _this = this;
    const url = e.target.dataset.url
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({record_completion: { completed: e.target.checked }})
    }).then((response) => {
      if (response.ok) {
        this.updateTotalCompleted();
      }

      e.target.disabled = false;
    })
  }

  updateTotalCompleted() {
    const completedTasksNum = Array.from(document.querySelectorAll('input[type="checkbox"].completion-checkbox:checked')).length
    document.querySelector('#completed-tasks').innerHTML = completedTasksNum
  }

  toggleProlongBtn() {
    const btn = document.getElementById('prolongBtn')
    document.querySelector('.record-select-checkbox:checked') ? btn.classList.remove('disabled') : btn.classList.add('disabled') 
  }

  prolongSelected() {
    const selectedRecords = document.querySelector('.record-select-checkbox:checked')
    const selectedRecordIds = Array.from(selectedRecords).map(el => el.dataset.id)

    fetch()
  }

  new() {
  }

  create() {
  }

  editRecord(e) {
    const element = e.target
    const initialName = element.textContent
    element.dataset.initialName = initialName

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'form-control'
    input.value = initialName

    element.textContent = ''
    element.appendChild(input)
    input.focus()
    input.select()

    input.addEventListener("keyup", (event) => {
      if (event.key === 'Enter') {
        this.saveEdit(element, input.value)
      }
    })

    input.addEventListener('blur', () => {
      this.cancelEdit(element, input.value)
    })

    element._currentInput = input;
  }

  saveEdit(element, newValue) {
    const _this = this
    const url = element.dataset['update-url']
    input.disabled = true;

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')
      },
      body: JSON.stringify({ record: { name: newValue }}).then(
        (response) => {
          if (response.ok) {
          } else {
            // TODO: show Toast with error messages
          }

          input.disabled = false;
        }
      )
    })
    
  }

  cancelEdit(element) {
    if (element._currentInput) {
      element.removeChild(element._currentInput);
      delete element._currentInput
    }

    element.textContent = element.dataset.initialName || ''
    delete element.dataset.initialName
  }

  reorder() {

  }

  _updateTable() {

  }
}

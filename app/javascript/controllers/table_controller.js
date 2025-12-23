import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'table' ]

  connect() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === "i") {
        this.new(document.querySelector('#newRecordBtn'))
      }
    })
  }

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

  new(e) {
    const _this = this
    const url = e?.target?.dataset?.url || e?.dataset?.url
    const newFormContainer = document.querySelector('div.new-form-container')

    fetch(url, {
      method: 'GET'
    }).then(response => response.text())
    .then((html) => {
      newFormContainer.innerHTML = html
      const input = newFormContainer.querySelector('input')
      input.focus()

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
          _this.cancelNew(newFormContainer)
        }
      })
      input.addEventListener('blur', (e) => _this.cancelNew(newFormContainer))

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          _this.create(input)
        }
      })
    })
  }

  cancelNew(element) {
    element.innerHTML = ''
  }

  create(input) {
    const _this = this
    input.disabled = true
    const url = input.dataset.url
    const date = document.querySelector('#start_date').value

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ record: { name: input.value, date: date } })
    }).then((response) => {
      if (response.ok) {
        html = response.text().then(html => {
          const table = document.querySelector('#tableRow')
          table.innerHTML = html
          input.disabled = false
          _this.cancelNew(input)
        })

        return null
      }
  
      return response.text()
    }).then((html) => {
      if (html) {
        const errorsContainer = document.querySelector('div.errors')
        const div = document.createElement('div');
        div.class="row"
        div.innerHTML = html;
        errorsContainer.appendChild(div);
          
        setTimeout(() => { 
          errorsContainer.removeChild(div);
        }, 5000);
      }
    }).catch((error) => {
      console.error('Error:', error)
    })
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
    const url = element.dataset.updateUrl;
    const input = element.querySelector('input');
    input.disabled = true;

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      method: 'PATCH',
      body: JSON.stringify({ record: { name: newValue } })
    })
    .then((response) => {
      if (response.ok) {
        element.dataset.initialName = input.value;
        this.cancelEdit(element);
        return null;
      } else {
        return response.text();
      }
    })
    .then((body) => {
      if (body) {
        const errorsContainer = document.querySelector('div.errors');
        if (errorsContainer) {
          const div = document.createElement('div');
          div.class="row"
          div.innerHTML = body;
          errorsContainer.appendChild(div);
          
          setTimeout(() => { 
            errorsContainer.removeChild(div);
          }, 5000);
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    })
    .finally(() => {
      input.disabled = false;
    });
  }

  cancelEdit(element) {
    if (element._currentInput) {
      element.removeChild(element._currentInput);
      delete element._currentInput
    }

    element.textContent = element.dataset.initialName || ''
    delete element.dataset.initialName
  }

  prolongSelected(e) {
    const selectedRecords = document.querySelectorAll('.record-select-checkbox:checked')
    const selectedRecordIds = Array.from(selectedRecords).map(el => el.dataset.recordId)

    const element = e.target
    const url = element.dataset.url

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ records: { ids: selectedRecordIds, date: element.dataset.date } })
    }).then((response) => {
      if (response.ok) {
        return
      } else {
        alert('An error occured')
      }
    })

    selectedRecords.map((el) => el.checked = false)
    this.toggleProlongBtn()
  }

  

  reorder() {}
}

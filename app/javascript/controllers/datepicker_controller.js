import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { filterUrl: String }
  static targets = ["tableContainer", "yearSelect", "monthSelect"]

	connect() {
		Array.from(document.querySelectorAll('select.form-select')).map((el) => { el.addEventListener('change', () => this.updateTable())})
	}

	prevMonth() {
    const yearPicker = document.querySelector('#records_date_1i')
    const monthPicker = document.querySelector('#records_date_2i')

    const year = parseInt(yearPicker.value)
    const prevMonth = parseInt(monthPicker.value) - 1
    
    if (prevMonth === 0) {
      yearPicker.value = (year - 1).toString()
      monthPicker.value = "12"
    } else {
      monthPicker.value = `${prevMonth}`
    }

    this.updateTable()
  }

  nextMonth() {
    const yearPicker = document.querySelector('#records_date_1i')
    const monthPicker = document.querySelector('#records_date_2i')
  
    const year = parseInt(yearPicker.value)
    const nextMonth = parseInt(monthPicker.value) +1

    if (nextMonth >= 13) {
      yearPicker.value = (year + 1).toString()
      monthPicker.value = "1"
    } else {
      monthPicker.value = `${nextMonth}`
    }

    this.updateTable()
  }

	updateTable() {
    this.cacheDateValues()

    const url = document.querySelector('#filter_url').value;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.text()).then((html) => {
      document.querySelector('.table-container').innerHTML = html
    })
  }

  cacheDateValues() {
    document.cookie = `year=${document.querySelector('#records_date_1i').value}`
    document.cookie = `month=${document.querySelector('#records_date_2i').value}`
  }
}
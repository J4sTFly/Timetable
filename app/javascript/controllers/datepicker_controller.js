import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { filterUrl: String }
  static targets = ["tableContainer", "year", "month"]

	connect() {
    const datePickers = document.querySelectorAll('select.form-select')
    datePickers[0].dataset.datepickerTarget = 'year'
    datePickers[1].dataset.datepickerTarget = 'month'

		Array.from(datePickers).map((el) => { el.addEventListener('change', () => this.updateTable())})
	}

	prevMonth() {
    const year = parseInt(this.yearTarget.value)
    const prevMonth = parseInt(this.monthTarget.value) - 1
    
    if (prevMonth === 0) {
      this.yearTarget.value = (year - 1).toString()
      this.monthTarget.value = "12"
    } else {
      this.monthTarget.value = `${prevMonth}`
    }

    this.updateTable()
  }

  nextMonth() {
    const year = parseInt(this.yearTarget.value)
    const nextMonth = parseInt(this.monthTarget.value) +1

    if (nextMonth >= 13) {
      this.yearTarget.value = (year + 1).toString()
      this.monthTarget.value = "1"
    } else {
      this.monthTarget.value = `${nextMonth}`
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
    document.cookie = `year=${this.yearTarget.value}`
    document.cookie = `month=${this.monthTarget.value}`
  }
}

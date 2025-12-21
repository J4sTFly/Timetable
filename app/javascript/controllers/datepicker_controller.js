import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "year", "month" ]
  connect() {
  }

  prevMonth() {
    console.log('prevMonth')
  }
  nextMonth() {
    
  }
}

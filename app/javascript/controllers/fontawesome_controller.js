import { Controller } from "@hotwired/stimulus"
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default class extends Controller {
  connect() {
    // Add icons to the library
    library.add(faBars)
    
    // Replace i tags with SVG
    dom.watch()
  }
}

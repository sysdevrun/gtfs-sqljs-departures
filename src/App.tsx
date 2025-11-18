import { DepartureBoard } from './components/DepartureBoard'
import { URLBuilder } from './components/URLBuilder'
import { parseUrlParams } from './utils/urlParams'

function App() {
  const params = new URLSearchParams(window.location.search)
  const showBuilder = params.has('builder')

  const config = parseUrlParams()

  // Show URL builder if:
  // 1. No GTFS URL or no stops are provided (default behavior)
  // 2. URL contains ?builder parameter
  if (showBuilder || !config.gtfsUrl || config.stopIds.length === 0) {
    return <URLBuilder />
  }

  return <DepartureBoard config={config} />
}

export default App

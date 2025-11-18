import { DepartureBoard } from './components/DepartureBoard'
import { HelpMessage } from './components/HelpMessage'
import { parseUrlParams } from './utils/urlParams'

function App() {
  const config = parseUrlParams()

  // Show help message if no GTFS URL or no stops are provided
  if (!config.gtfsUrl || config.stopIds.length === 0) {
    return <HelpMessage />
  }

  return <DepartureBoard config={config} />
}

export default App

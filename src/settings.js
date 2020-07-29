import React from 'react'
import ReactDOM from 'react-dom'
import TwitterKeyStore from '@/components/twitter'
import RaidsList from '@/components/raids'
import raids from '@/data/raids'

ReactDOM.render(
  <React.StrictMode>
    <TwitterKeyStore />
    <RaidsList difficulty='High Level' data={raids['high-level']}></RaidsList>
  </React.StrictMode>,
  document.getElementById('root')
);

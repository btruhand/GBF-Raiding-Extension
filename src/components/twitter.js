import React from 'react';
import PropTypes from 'prop-types';

const KeyStoreInput = React.forwardRef(({ label, name, placeholder }, ref) => {
  return (
    <label>
      {label}
      <input type="text" ref={ref} name={name} placeholder={placeholder} />
    </label>
  )
})

KeyStoreInput.displayName = 'KeyStoreInput'

KeyStoreInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.shape({ current: PropTypes.string })
}

function TwitterKeyStore() {
  const apiKey = React.useRef("")
  const secretKey = React.useRef("")
  const onSubmit = (e) => {
    chrome.storage.local.set({ twitter_api_key: apiKey.current.value, twitter_secret_key: secretKey.current.value }, () => {
      if (chrome.runtime.lastError) {
        console.error('an error happened when trying to set API keys: ' + chrome.runtime.lastError)
      } else {
        console.log(`successfully stored api key ${apiKey.current.value} and secret key ${secretKey.current.value}`)
      }
      chrome.storage.local.get(['twitter_api_key'], result => {
        if (chrome.runtime.lastError) {
          console.error('an error happened when trying to get API keys: ' + chrome.runtime.lastError)
        } else {
          console.log(`got result API key ${result['twitter_api_key']}`)
        }
      })
    })
    e.preventDefault()
  }
  return (
    <form onSubmit={onSubmit}>
      <KeyStoreInput label="API Key:" ref={apiKey} name="apikey" placeholder="API Key" />
      <KeyStoreInput label="Secret Key:" ref={secretKey} name="secretkey" placeholder="Secret API Key" />
      <input type="submit" value="Save" />
    </form>
  )
}

export default TwitterKeyStore
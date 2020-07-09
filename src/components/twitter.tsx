import React, { Ref, MutableRefObject, RefObject } from 'react';
import PropTypes from 'prop-types';
import { getCredentials, storeCredentials } from '@/lib/storage'
// import { createClient } from '@/twitter-stream'

type TwitterKeyStoreProps = {
  label: string,
  name: string,
  placeholder: string
}

const KeyStoreInput = React.forwardRef((props: TwitterKeyStoreProps, ref: MutableRefObject<HTMLInputElement>) => {
  return (
    <label>
      {props.label}
      <input type="text" ref={ref} name={props.name} placeholder={props.placeholder} />
    </label>
  )
})

KeyStoreInput.displayName = 'KeyStoreInput'

KeyStoreInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
}

function TwitterKeyStore() {
  const apiKey: MutableRefObject<HTMLInputElement> = React.useRef()
  const secretKey: MutableRefObject<HTMLInputElement> = React.useRef()
  const onSubmit = (e) => {
    storeCredentials(apiKey.current.value, secretKey.current.value).then(async () => {
      if (chrome.runtime.lastError) {
        console.error('an error happened when trying to set API keys: ' + chrome.runtime.lastError)
      } else {
        console.log(`successfully stored api key ${apiKey.current.value} and secret key ${secretKey.current.value}`)
      }
      const result = await getCredentials()
      if (chrome.runtime.lastError) {
        console.error('an error happened when trying to get API keys:', chrome.runtime.lastError)
      } else {
        console.log(`retrieved credentials ${result}`)
      }
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
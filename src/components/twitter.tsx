import React, { Ref, useRef } from 'react';
import PropTypes from 'prop-types';
import { getCredentials, storeCredentials } from '@/lib/storage'
// import { createClient } from '@/twitter-stream'

type TwitterKeyStoreProps = {
  label?: string,
  name?: string,
  placeholder?: string
}

const KeyStoreInput = React.forwardRef((props: TwitterKeyStoreProps, ref?: Ref<HTMLInputElement>) => {
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
  const apiKey = useRef<HTMLInputElement>(null)
  const secretKey = useRef<HTMLInputElement>(null)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const apiKeyValue = apiKey.current && apiKey.current.value
    const secretKeyValue = secretKey.current && secretKey.current.value
    storeCredentials(apiKeyValue as string, secretKeyValue as string).then(async () => {
      if (chrome.runtime.lastError) {
        console.error('an error happened when trying to set API keys: ' + chrome.runtime.lastError)
      } else {
        console.log(`successfully stored api key ${apiKeyValue} and secret key ${secretKeyValue}`)
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
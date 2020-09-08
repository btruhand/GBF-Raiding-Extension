import React, { Ref, useRef } from 'react';
import PropTypes, { object } from 'prop-types';
import { getCredentials, storeCredentials, get, store, isBossStored, isStored } from '@/lib/storage'
import { appTwitterInstance } from '@/lib/twitter';
import Twitter from 'twitter-lite';
import { enRaidAnnouncement, jpnRaidAnnouncement } from '@/lib/raids';
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
    const apiKeyValue = apiKey.current!.value
    const secretKeyValue = secretKey.current!.value
    appTwitterInstance(apiKeyValue, secretKeyValue).then(async ([twitter, _bearerToken]) => {
      if (await isStored('searchRegistered')) {
        return 'search has already been registered'
      } else {
        const announcementSearch = `${enRaidAnnouncement()} OR ${jpnRaidAnnouncement()}`
        return twitter.withLabs().addRules([Twitter.labsFilterStreamRule(announcementSearch)])
          .then((result: { meta?: { summary?: { created: Number } } }) => {
            const isCreated = result && result.meta && result.meta.summary && result.meta.summary.created === 1
            if (!isCreated) {
              throw new Error('unable to create search criteria')
            }
            return result
          })
          .catch(err => {
            alert('something wrong happened when testing the credentials given: ' + JSON.stringify(err))
          })
      }
    }).then(result => {
      console.log('successfully tested Twitter credentials', result)
      Promise.all([
        store('searchRegistered', true),
        storeCredentials(apiKeyValue, secretKeyValue).then(async () => {
          if (chrome.runtime.lastError) {
            console.error('an error happened when trying to set API keys: ' + chrome.runtime.lastError)
          } else {
            console.log(`successfully stored api key ${apiKeyValue} and secret key ${secretKeyValue}`)
          }
        })
      ])
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
import React, { useState, useEffect } from 'react';


function App() {
  const ROOT_URL = "http://yoshi.willandskill.eu:8999/api/v1/"
  const LOGIN_API = `${ROOT_URL}auth/api-token-auth/`
  const EVENT_LIST_API = `${ROOT_URL}events/events/` 

  const [token, setToken] = useState(null)
  const [eventList, setEventList] = useState(null)
  const [eventPageList, setEventPageList] = useState(null)

  function logIn() {
    const payload = {
      email: 'test.user@willandskill.se',
      password: 'js-lesson-10'
    }
    fetch(LOGIN_API, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      setToken(data.token)
    })
  }

  function fetchEventList() {
    fetch(EVENT_LIST_API, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setEventList(data.results)
    })
  }

  function fetchEventPages(event_slug) {
    const url = `${ROOT_URL}cms/${event_slug}/pages`
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res=>res.json())
    .then(data => {
      setEventPageList(data.results)
    })
  }

  useEffect(() => {
    if(token) {
      fetchEventList()
    }
  }, [token])

  return (
    <div className="App">
      <button onClick={logIn}>Login</button>
      {eventList && eventList.map(eventItem => {
        return (
          <div key={eventItem.id}>
            <h3>{eventItem.title}</h3>
            <p>{ eventItem.description }</p>
            <button onClick={()=>fetchEventPages(eventItem.slug)}>Get Event pages</button>
            <hr/>
          </div>
        )
      })}
      <hr/>
      <div>
        {eventPageList && eventPageList.map(pageItem => {
          return (
            <div key={pageItem.id}>
              <h5>{pageItem.title}</h5>
              <iframe src={pageItem.backgroundVideoLink} />
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;

import { useState } from "react"

export default function Notification(props) {

  const [none, setNone] = useState('block')

  setTimeout(() => setNone('none'), 5000)

  return (
    <>
      <div style={{ display: none, overflow: "hidden" }}>
        <div className='quiq_notif' >
          <p>{props.message}</p>
        </div>
      </div>
    </>
  )

}


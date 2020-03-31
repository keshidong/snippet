import { useState, useRef, useEffect } from "react"

const getCurrentTs = () => (new Date().getTime())
const useRerender = () => {
  const [, setDump] = useState(null)

  return () => {
    setDump({})
  }
}
/*
** useCountDown is react hook for countdown
** countDownSec -> total countdown in second
** return: [restCountDownSec, reStartCountDown]
*/
export default function useCountDown(countDownSec: number): [number, () => void] {
  const endTsRef = useRef(getCurrentTs())
  const rerender = useRerender()

  const startCountDown = () => {
    const startTs = getCurrentTs()
    endTsRef.current = countDownSec * 1000 + startTs
    rerender()
  }
  let restCountDownSec = Math.round((endTsRef.current - getCurrentTs()) / 1000)
  restCountDownSec = restCountDownSec < 0 ? 0 : restCountDownSec

  const rerenderRef = useRef(rerender)
  rerenderRef.current = rerender

  useEffect(() => {
    let tHandler = null
    if (restCountDownSec > 0) {
      tHandler = setTimeout(() => {
        rerenderRef.current()
      }, 1000)
    }
    return () => {
      clearTimeout(tHandler)
    }
  }, [restCountDownSec])
  return [restCountDownSec, startCountDown]
}

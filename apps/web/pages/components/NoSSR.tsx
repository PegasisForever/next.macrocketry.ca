import {PropsWithChildren, useState} from 'react'
import {useEffectOnce} from 'react-use'

export default function NoSSR(props: PropsWithChildren<{}>) {
  const [mounted, setMounted] = useState(false)

  useEffectOnce(() => setMounted(true))

  if (!mounted) return null

  return <>
    {props.children}
  </>
}
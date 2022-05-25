import {PropsWithChildren} from 'react'
import {Title} from '@mantine/core'

export default function PageTitle(props: PropsWithChildren<{ size?: number }>) {
  return <Title order={2} sx={{
    fontWeight: 400,
    fontSize: props.size ?? 80,
  }}>
    {props.children}
  </Title>
}
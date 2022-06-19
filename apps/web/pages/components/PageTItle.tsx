import {PropsWithChildren} from 'react'
import {Title} from '@mantine/core'
import {Sx} from '@mantine/styles/lib/theme/types/DefaultProps'

export default function PageTitle(props: PropsWithChildren<{ size?: number, sx?: Sx }>) {
  return <Title order={2} sx={{
    fontWeight: 400,
    fontSize: props.size ?? 80,
    ...props.sx,
  }}>
    {props.children}
  </Title>
}
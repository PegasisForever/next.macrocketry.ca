import {Box, Title} from '@mantine/core'
import {useVoidLake5Styles} from './index.page'
import {PropsWithChildren, ReactNode} from 'react'

export function VoidLake5Title(props: PropsWithChildren<{ icon: ReactNode }>) {
  const {classes, theme} = useVoidLake5Styles()

  return <Title className={classes.title} sx={{
    textAlign: 'center',
    backgroundColor: theme.colors.gray[7],
    clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
    display: 'flex',
  }}>
    <Box component={'span'} px={20} pb={2} sx={{
      backgroundColor: theme.colors.gray[1],
      color: theme.colors.gray[9],
      clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
    }}>
      {props.icon}
    </Box>
    <Box component={'span'} pl={16} pr={28} pb={2}>
      {props.children}
    </Box>
  </Title>
}
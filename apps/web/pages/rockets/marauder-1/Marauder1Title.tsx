import {Box, BoxProps, Text, Title} from '@mantine/core'
import {useMarauder1Styles} from './index.page'

export default function Marauder1Title({children, ...props}: BoxProps) {
  const {classes, theme} = useMarauder1Styles()

  return <Box {...props}>
    <Text color={theme.colors.gray[5]} className={classes.marauderFont}>
      Marauder I
    </Text>
    <Title order={1} mb={32} className={classes.title}>
      {children}
    </Title>
  </Box>
}
import {Box, Group, Text} from '@mantine/core'
import Image from 'next/image'
import sizeComparisonImage from './images/size_comparison.svg'
import Marauder1Title from './Marauder1Title'
import {Fragment} from 'react'
import {useMarauder1Styles} from './index.page'

export default function Overview() {
  const {classes, theme} = useMarauder1Styles()

  return <Box
    px={32} py={64}
    className={classes.blackSectionBackground}
    sx={{
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    }}>
    <Box sx={{
      width: '30%',
      maxWidth: '200px',
      position: 'relative',
    }}>
      <Image
        title={'Human Silhouette by Madhero88, Source: https://commons.wikimedia.org/wiki/File:SVG_Human_Silhouette.svg'}
        src={sizeComparisonImage}
        alt={'Size comparison between the rocket and a human.'}
        layout={'responsive'}
      />
    </Box>
    <Box sx={{
      width: 500,
    }}>
      <Marauder1Title>
        Overview
      </Marauder1Title>
      {
        [
          {
            name: 'Height',
            primaryUnit: '2.54m',
            secondaryUnit: '100in',
          },
          {
            name: 'Diameter',
            primaryUnit: '16cm',
            secondaryUnit: '6.3in',
          },
          {
            name: 'Wet Mass',
            primaryUnit: '33.7kg',
            secondaryUnit: '74.4lbs',
          },
          {
            name: 'Payload Mass',
            primaryUnit: '5.4kg',
            secondaryUnit: '12lbs',
          },
          {
            name: 'Motor',
            primaryUnit: 'Cesaroni 10367N1800-P',
            secondaryUnit: undefined,
          },
          {
            name: 'Total Impulse',
            primaryUnit: '10600Ns',
            secondaryUnit: undefined,
          },
          {
            name: 'Maximum Velocity',
            primaryUnit: '260m/s',
            secondaryUnit: '853ft/s',
          },
        ].map((data, i) => <Fragment key={i}>
          <Group key={i} position={'apart'}>
            <Text size={'lg'}>
              {data.name}
            </Text>
            <Text size={'lg'}>
              <span>{data.primaryUnit}</span>
              {data.secondaryUnit ? <>
                <span style={{color: theme.colors.gray[6]}}>{' / '}</span>
                <span style={{color: theme.colors.gray[6]}}>{data.secondaryUnit}</span>
              </> : null}
            </Text>
          </Group>
          <Box my={16} sx={{
            borderBottom: `1px ${theme.colors.gray[6]} solid`,
          }}/>
        </Fragment>)
      }
    </Box>
  </Box>
}
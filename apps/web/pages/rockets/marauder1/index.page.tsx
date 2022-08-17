import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {TopLevelPageProps} from '../../TopLevelPageProps'
import {Box, Button, createStyles, Group, Stack, Text, Title} from '@mantine/core'
import RightPanelContainer from '../../RightPanelContainer'
import launchSiteImage from './images/launch_site.jpg'
import Image from 'next/image'
import {IconMapPin, IconPlayerPlay} from '@tabler/icons'
import ImageGallery, {ReactImageGalleryItem} from 'react-image-gallery'
import imageA from './images/a.jpg'
import imageB from './images/b.jpg'
import imageC from './images/c.jpg'
import imageD from './images/d.jpg'
import imageE from './images/e.jpg'
import imageF from './images/f.jpg'
import imageG from './images/g.jpg'
import sizeComparisonImage from './images/size_comparison.svg'
import {Fragment, memo} from 'react'

const useStyles = createStyles(theme => ({
  marauderFont: {
    fontFamily: '"Arvo", serif',
  },
  title: {
    fontWeight: 500,
    fontSize: 48,
  },
}))

export default function Marauder1Page(props: TopLevelPageProps) {
  const {classes, theme} = useStyles()

  return <RightPanelContainer hrefIndex={2} prevHrefIndex={props.prevHrefIndex} sideBarData={props.sideBarData}>
    <Text sx={{
      position: 'absolute',
      width: '100%',
      height: '100vh',
      background: theme.black,
      color: theme.white,
    }}>
      VIDEO
    </Text>
    <Box sx={{
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto',
      color: theme.white,
    }}>
      <Box sx={{
        height: '125vh',
      }}>
        <Stack spacing={0} align={'center'} justify={'center'} sx={{
          height: '75vh',
        }}>
          <Title order={1} className={classes.marauderFont} sx={{
            fontWeight: 500,
            fontSize: 72,
          }}>
            MARAUDER I
          </Title>
          <Text>
            McMaster&apos;s First 3KM Rocket
          </Text>
        </Stack>
      </Box>
      <Box sx={{
        height: '100vh',
        position: 'relative',
        color: theme.white,
      }}>
        <Image
          style={{
            position: 'absolute',
          }}
          src={launchSiteImage}
          loading={'eager'}
          placeholder={'blur'}
          layout={'fill'}
          objectFit={'cover'}
          objectPosition={'50% 50%'}
          alt={'Marauder I standing on the launch pad.'}
        />
        <Group p={64} align={'center'} sx={{
          height: '100%',
        }}>
          <Box sx={{
            padding: 32,
            width: 470,
            backgroundColor: theme.fn.rgba(theme.black, 0.1),
            backdropFilter: 'blur(32px)',
          }}>
            <Title order={1} sx={{
              fontWeight: 500,
              fontSize: 48,
              lineHeight: 1,
            }}>
              <span className={classes.marauderFont}>
                Marauder I
              </span>
              &apos;s First Launch
            </Title>
            <Text size={'lg'} mt={24} sx={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <IconMapPin/>
              <span style={{marginLeft: 4}}>
                Launch Canada 2022, Cochrane, ON
              </span>
            </Text>
            <Text size={'lg'} mt={8}>
              After one and half year of preparation, Marauder I is finally standing on the launch pad, ready to launch.
            </Text>
            <Button
              component={'a'}
              href={'https://www.youtube.com/watch?v=SshrsCJrTgE'}
              target={'_blank'}
              rel={'noreferrer'}
              size={'lg'}
              mt={24}
              sx={{
                background: theme.white,
                color: theme.black,
                boxShadow: theme.shadows.xl,
                '&:hover': {
                  background: theme.colors.gray[1],
                },
              }}>
              <IconPlayerPlay/>
              <span style={{marginLeft: 12}}>
            Watch the Launch
          </span>
            </Button>
          </Box>
        </Group>
      </Box>

      <Box px={32} py={64} sx={{
        background: theme.colors.gray[9],
        color: theme.white,
        display:'flex',
        justifyContent:'space-evenly',
        alignItems:'center',
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
          width:500
        }}>
          <Text color={theme.colors.gray[5]} className={classes.marauderFont}>
            Marauder I
          </Text>
          <Title order={1} mb={32} className={classes.title} sx={{lineHeight: 1}}>
            Overview
          </Title>
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
            ].map((data, i) => <Fragment key={i}>
              <Group key={i} position={'apart'}>
                <Text size={'lg'}>
                  {data.name}
                </Text>
                <Text size={'lg'}>
                  <span>{data.primaryUnit}</span>
                  {data.secondaryUnit ? <>
                    <span style={{color:theme.colors.gray[6]}}>{' / '}</span>
                    <span style={{color:theme.colors.gray[6]}}>{data.secondaryUnit}</span>
                  </> : null}
                </Text>
              </Group>
              <Box my={16} sx={{
                borderBottom:`1px ${theme.colors.gray[6]} solid`
              }}/>
            </Fragment>)
          }

        </Box>
      </Box>

      <Stack align={'center'} py={32} sx={{
        background: theme.colors.gray[0],
        color: theme.black,
      }}>
        <Title order={1} mb={32} className={classes.title}>
          Gallery
        </Title>
        <Box px={32} sx={{
          width: '100%',
          maxWidth: 800,
        }}>
          <ImageGallery
            showPlayButton={false}
            showFullscreenButton={false}
            items={[
              imageA,
              imageB,
              imageC,
              imageD,
              imageE,
              imageF,
              imageG,
              launchSiteImage,
            ].map(img => ({
              original: img.src,
              thumbnail: img.blurDataURL,
              originalWidth: img.width,
              originalHeight: img.height,
            }))}
            renderItem={props => <ImageGalleryItem {...props} />}
            renderThumbInner={props => <ImageGalleryItem isThumbnail {...props} />}
          />
        </Box>
      </Stack>
    </Box>


  </RightPanelContainer>
}

const ImageGalleryItem = memo(function ImageGalleryItem(props: ReactImageGalleryItem & { isThumbnail?: boolean }) {
  const imageData = {
    src: props.original!,
    blurDataURL: props.thumbnail!,
    width: props.originalWidth!,
    height: props.originalHeight!,
  }

  return <Box>
    <Image
      src={imageData}
      placeholder={'blur'}
      layout={'responsive'}
      sizes={props.isThumbnail ? '10vw' : undefined}
    />
  </Box>
})

export const getStaticProps: GetStaticProps<Omit<TopLevelPageProps, 'prevHrefIndex'>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}
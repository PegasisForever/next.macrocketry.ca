import {GetStaticProps} from 'next'
import {getSideBarData} from './nav/sideBarDataHelper'
import RightPanelContainer from './RightPanelContainer'
import {gql, request} from 'graphql-request'
import {Anchor, Box, Group, Stack, Title, useMantineTheme} from '@mantine/core'
import {IconFileText} from '@tabler/icons'
import {getGraphQLUrl, prepareImageFromUrl, ProcessedImage} from './ssrUtils'
import Image from 'next/image'
import {PropsWithSideBar} from './contexts'

type SponsorTier = {
  name: string,
  logoHeight: number,
  sponsors?: Array<{
    url: string,
    logo: ProcessedImage,
  }>
}
type PageProp = { sponsorTiers: SponsorTier[] }

function SponsorTierComponent({tier}: { tier: SponsorTier }) {
  const theme = useMantineTheme()

  return <>
    <Title order={2} sx={{
      backgroundColor: theme.colors.gray[3],
      fontSize: 40,
      fontWeight: 400,
      padding: '4px 16px',
      borderRadius: theme.radius.md,
      width: 'calc(100% - 64px)',
      maxWidth: 600,
      textAlign: 'center',
      marginTop: 64,
    }}>
      {tier.name}
    </Title>
    <Group position={'center'} spacing={32}>
      {tier.sponsors?.map(({logo, url}, i) => {
        const width = tier.logoHeight / logo.height * logo.width * 4
        return <Box component={'a'}
                    key={i}
                    href={url}
                    target={'_blank'}
                    rel={'noreferrer'}
                    style={{width}}
                    mt={16}>
          <Image layout={'responsive'}
                 sizes={width + 'px'}
                 src={logo} placeholder={'blur'}
                 alt={''}/>
        </Box>
      })}
    </Group>
  </>
}

export default function SponsorsPage(props: PageProp) {
  const theme = useMantineTheme()

  return <RightPanelContainer hrefIndex={5}>
    <Stack py={64} align={'center'} spacing={0}>
      <Title order={2} sx={{
        backgroundColor: theme.colors.blue[6],
        color: theme.white,
        fontSize: 36,
        fontWeight: 400,
        padding: '4px 16px',
        borderRadius: theme.radius.md,
      }}>
        Sponsor US!
      </Title>
      <Anchor href={'/Sponsorship Package 2022 V1.pdf'} target={'_blank'} rel={'noreferrer'} sx={{
        fontSize: 24,
        color: theme.colors.blue[6],
        textDecoration: 'underline',
        textUnderlineOffset: 1,
        textDecorationColor: theme.colors.blue[6],
        marginTop: 4,
        '& > *': {
          verticalAlign: 'middle',
        },
        '& > span': {
          marginLeft: 4,
        },
      }}>
        <IconFileText/>
        <span>Sponsor Package</span>
      </Anchor>
      {props.sponsorTiers.map(tier => <SponsorTierComponent key={tier.name} tier={tier}/>)}
    </Stack>
  </RightPanelContainer>
}

export const getStaticProps: GetStaticProps<PropsWithSideBar<PageProp>> = async () => {
  const res = await request(getGraphQLUrl(), gql`
{
  Sponsors {
    tiers {
      name
      logoHeight
      sponsors {
        url
        logo {
          url
        }
      }
    }
  }
}
`)

  for (const tier of res.Sponsors.tiers) {
    if (tier.sponsors === undefined) continue
    for (let i = 0; i < tier.sponsors.length; i++) {
      tier.sponsors[i].logo = await prepareImageFromUrl(tier.sponsors[i].logo.url)
    }
  }

  return {
    props: {
      sideBarData: await getSideBarData(),
      sponsorTiers: res.Sponsors.tiers,
    },
  }
}
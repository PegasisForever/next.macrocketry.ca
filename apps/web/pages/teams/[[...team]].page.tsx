import {TopLevelPageProps} from '../TopLevelPageProps'
import RightPanelContainer from '../RightPanelContainer'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getSideBarData} from '../nav/sideBarDataHelper'

type PageQuery = { team: string[] | undefined }
type PageProp = TopLevelPageProps

export default function Teams(props: PageProp) {
  return <RightPanelContainer hrefIndex={1} prevHrefIndex={props.prevHrefIndex} sideBarData={props.sideBarData}>
    teams
  </RightPanelContainer>
}

export const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
  return {
    paths: [
      {
        params: {
          team: undefined,
        },
      },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Omit<PageProp, 'prevHrefIndex'>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}
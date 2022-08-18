import {TopLevelPageProps} from '../../TopLevelPageProps'
import RightPanelContainer from '../../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'

export default function VoidLake5Page(props:TopLevelPageProps){
  return <RightPanelContainer hrefIndex={3} prevHrefIndex={props.prevHrefIndex} sideBarData={props.sideBarData}>
    awa
  </RightPanelContainer>
}

export const getStaticProps: GetStaticProps<Omit<TopLevelPageProps, 'prevHrefIndex'>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}
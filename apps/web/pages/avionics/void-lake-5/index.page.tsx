import RightPanelContainer from '../../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../../contexts'
import {Box} from '@mantine/core'
import pcbSchema from './images/pcb_schema.png'
import pcbLayout from './images/pcb_layout.png'
import pcb2d from './images/pcb_2d.png'
import Image from 'next/image'
import {StaticImageData} from 'next/dist/client/image'
import {RefObject, useRef} from 'react'

export default function VoidLake5Page() {
  const scrollRoot = useRef<HTMLDivElement>(null)
  return <RightPanelContainer hrefIndex={3}>
    <Box ref={scrollRoot} sx={{
      position: 'relative',
      left: 0,
      top: 0,
      right: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>
      <ParallaxImage scrollRoot={scrollRoot} i={0} src={pcbSchema}/>
      <ParallaxImage scrollRoot={scrollRoot} i={1} src={pcbLayout}/>
      <ParallaxImage scrollRoot={scrollRoot} i={2} src={pcb2d}/>

    </Box>

  </RightPanelContainer>
}

function ParallaxImage(props:{src:StaticImageData,i:number,scrollRoot:RefObject<HTMLDivElement>}){
  return <Box sx={{
    position:'relative',
    height: '100vh',
    width: '100%',
    backfaceVisibility:'hidden',
    overflow:'hidden',
    clipPath:'inset(0 0 0 0)',
    zIndex:props.i+1,
    // backgroundAttachment:'fixed',
    // backgroundImage:`url("${props.src.src}")`,
    // backgroundSize:'contain',
  }}>
    <Box sx={{
      position: 'fixed',

      left: 0,
      top: 0,
      width: '100%',
      height: '100vh',
      pointerEvents:'none',
    }}>
      <Image
        lazyRoot={props.scrollRoot}
        src={props.src}
        placeholder={'blur'}
        layout={'responsive'}
        priority
        loading={'eager'}
      />
      {/*<img*/}
      {/*src={props.src.src}*/}
      {/*width={"100%"}/>*/}
    </Box>
  </Box>
}

export const getStaticProps: GetStaticProps<PropsWithSideBar<{}>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}
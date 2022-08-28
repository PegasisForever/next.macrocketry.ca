import {forwardRef, PropsWithChildren, ReactNode} from 'react'
import {Sx} from '@mantine/styles/lib/theme/types/DefaultProps'
import {useScrollbarWidth} from 'react-use'
import {Box} from '@mantine/core'

export const ParallaxContainer = forwardRef<HTMLDivElement, PropsWithChildren<{ sx?: Sx, innerSx?: Sx, stickBottom?: boolean, noneParallax?: ReactNode }>>(function ParallaxContainer(props, ref) {
    const sbw = useScrollbarWidth()
    return <Box ref={ref} sx={[{
        position: 'relative',
        width: '100%',
        backfaceVisibility: 'hidden',
        clipPath: 'inset(0 0 0 0)',
      }, props.sx]}>
    <Box sx={[{
        position: props.stickBottom ? 'absolute' : 'fixed',
        left: 0,
        bottom: props.stickBottom ? 0 : undefined,
        top: props.stickBottom ? undefined : 0,
        width: `calc(100% - ${props.stickBottom ? 0 : sbw}px)`,
        pointerEvents: 'none',
      }, props.innerSx]}>
    {props.children}
    </Box>
    {props.noneParallax}
    </Box>
  },
)
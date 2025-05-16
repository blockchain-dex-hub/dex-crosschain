import { atoms } from '@pancakeswap/uikit/css/atoms'
import { responsiveStyle } from '@pancakeswap/uikit/css/responsiveStyle'
import { keyframes, style } from '@vanilla-extract/css'

const promotedGradientKf = keyframes({
  '0%': {
    backgroundPosition: '50% 0%',
  },
  '50%': {
    backgroundPosition: '50% 100%',
  },
  '100%': {
    backgroundPosition: '50% 0%',
  },
})

export const promotedGradientClass = style([
  atoms({
    background: 'gradientBold',
  }),
  style({
    animation: `${promotedGradientKf} 3s ease infinite`,
    backgroundSize: '400% 400%',
  }),
])

export const modalWrapperClass = style([
  style({
    display: 'flex',
    background: 'rgba(24, 26, 32, 0.98)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)',
  }),
  responsiveStyle({
    xs: {
      width: '100%',
      marginBottom: 0,
      borderRadius: '16px',
    },
    md: {
      height: '490px',
    },
    lg: {
      width: '792px',
      borderRadius: '24px',
    },
  }),
])

export const desktopWalletSelectionClass = style([
  style({
    padding: '32px 24px',
    background: 'rgba(36, 40, 48, 0.98)',
    borderRadius: '20px',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
    transition: 'box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)',
  }),
  responsiveStyle({
    xs: {
      maxWidth: '100%',
      padding: '24px 8px',
    },
    sm: {
      maxWidth: '360px',
    },
    lg: {
      maxWidth: '408px',
    },
  }),
])

export const walletSelectWrapperClass = style([
  style({
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '0 auto',
  }),
  responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr 1fr',
      rowGap: '16px',
      columnGap: '12px',
    },
    sm: {
      rowGap: '24px',
      columnGap: '16px',
      gridTemplateColumns: '1fr 1fr',
    },
    lg: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  }),
])

export const walletIconClass = style({
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.04)',
  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
  transition: 'transform 0.18s cubic-bezier(0.4,0,0.2,1), box-shadow 0.18s cubic-bezier(0.4,0,0.2,1)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    transform: 'scale(1.08)',
    boxShadow: '0 4px 16px 0 rgba(0, 184, 255, 0.18)',
    background: 'rgba(0, 184, 255, 0.08)',
  },
})

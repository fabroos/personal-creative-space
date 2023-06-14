'use client'

import Script from 'next/script'
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { debounce } from '~/lib'

export const useIOSToolbarState = () => {
  const [isVisible, setIsVisible] = useState<boolean>()

  useEffect(() => {
    const ua = window.navigator ? window.navigator.userAgent : ''
    const iOS = ua.match(/iPad/i) || ua.match(/iPhone/i)
    const webkit = ua.match(/WebKit/i)
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i)
    const baseWindowHeight = window.innerHeight

    function handleScroll() {
      const newWindowHeight = window.innerHeight
      if (newWindowHeight - 50 > baseWindowHeight) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    // the toolbar issue only happens on iOS Safari
    if (iOSSafari) {
      if (
        'standalone' in window.navigator &&
        (window.navigator as any)['standalone']
      ) {
        // if it's iOS' standalone mode (added to home screen)
        // the toolbar is always "hidden"
        setIsVisible(false)
      } else {
        // iOS Safari
        document.addEventListener('scroll', handleScroll)

        return () => {
          document.removeEventListener('scroll', handleScroll)
        }
      }
    }
  }, [])

  return { isVisible }
}

const vwCssVar = 'vw'
const vhCssVar = 'vh'

interface Context {
  vw: number | undefined
  vh: number | undefined
  isIOSToolbarVisible: boolean | undefined
}

const RealViewportContext = createContext<Context | undefined>(undefined)

const encodeBase64 = (str: string) => {
  return typeof window !== 'undefined'
    ? window.btoa(str)
    : Buffer.from(str).toString('base64')
}

const RealViewportScript = memo(({ prefix }: { prefix: string }) => {
  const encodedScript = `data:text/javascript;base64,${encodeBase64(`(function() {
    var d = document.documentElement;
    d.style.setProperty('--${
      prefix + vwCssVar
    }', (d.clientWidth || window.innerWidth) / 100 + 'px');
    d.style.setProperty('--${
      prefix + vhCssVar
    }', (d.clientHeight || window.innerHeight) / 100 + 'px');
}())`)}`
  return (
    <Script
      key="real-viewport-script"
      strategy="beforeInteractive"
      src={encodedScript}
    />
  )
})

/**
 *  After React 18 the type React.FC does not provide a children prop anymore,
 *  therefore it is necessary to manually add the type using the helper
 *  React.PropsWithChildren or the prop 'children: React.ReactNode'
 */
type Props = {
  debounceResize?: boolean
  variablesPrefix?: string
}

const RealViewportProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  debounceResize = true,
  variablesPrefix = ''
}) => {
  const [value, setValue] = useState<Pick<Context, 'vw' | 'vh'>>({
    vw: undefined,
    vh: undefined
  })
  const { isVisible } = useIOSToolbarState()

  const handleResize = useCallback(() => {
    const vw = parseFloat((window.innerWidth * 0.01).toFixed(4))
    const vh = parseFloat((window.innerHeight * 0.01).toFixed(4))
    document.documentElement.style.setProperty(
      '--' + variablesPrefix + vwCssVar,
      `${vw}px`
    )
    document.documentElement.style.setProperty(
      '--' + variablesPrefix + vhCssVar,
      `${vh}px`
    )
    setValue({ vw, vh })
  }, [variablesPrefix])

  useEffect(() => {
    handleResize()
    const handler = debounceResize ? debounce(handleResize, 250) : handleResize
    window.addEventListener('resize', handler, { passive: true })
    window.addEventListener('orientationchange', handler, { passive: true })
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('orientationchange', handler)
    }
  }, [variablesPrefix, debounceResize, isVisible, handleResize])

  useEffect(() => {
    const timeout = window.setTimeout(handleResize, 200)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [isVisible])

  return (
    <RealViewportContext.Provider
      value={{ ...value, isIOSToolbarVisible: isVisible }}
    >
      <RealViewportScript prefix={variablesPrefix} />
      {children}
    </RealViewportContext.Provider>
  )
}

const useRealViewport = () => {
  const context = useContext(RealViewportContext)
  if (context === undefined) {
    throw new Error(
      'useRealViewport must be used below a <RealViewportProvider>'
    )
  }
  return context
}

export { RealViewportProvider, useRealViewport }

// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'

// ** Component Import
import UpgradeToProButton from './components/UpgradeToProButton'
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import TelecallerNavigation from 'src/navigation/TelecallerNavigation'
import { useCookies } from 'react-cookie'
import SalesManagerNavigation from 'src/navigation/SalesManagerNavigation'

const UserLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/components/use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // const UpgradeToProImg = () => {
  //   return (
  //     <Box sx={{ mx: 'auto' }}>
  //       <a
  //         target='_blank'
  //         rel='noreferrer'
  //         href='https://themeselection.com/products/materio-mui-react-nextjs-admin-template/'
  //       >
  //         <img width={230} alt='upgrade to premium' src={`/images/misc/upgrade-banner-${settings.mode}.png`} />
  //       </a>
  //     </Box>
  //   )
  // }
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const roleName = cookies.amr?.RoleName || "Admin";
  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={roleName==='Telecaller' ? TelecallerNavigation() : roleName==='Sales Manager' ? SalesManagerNavigation() : VerticalNavItems()} // Navigation Items
      // afterVerticalNavMenuContent={UpgradeToProImg}
      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      {children}
      <UpgradeToProButton />
    </VerticalLayout>
  )
}

export default UserLayout

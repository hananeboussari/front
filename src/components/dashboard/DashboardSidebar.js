import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Divider, Drawer, Link, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReceiptIcon from '@material-ui/icons/Receipt';
import useAuth from '../../hooks/useAuth';
import BriefcaseIcon from '../../icons/Briefcase';
import CalendarIcon from '../../icons/Calendar';
import ChartPieIcon from '../../icons/ChartPie';
import ChartSquareBarIcon from '../../icons/ChartSquareBar';
import ChatAltIcon from '../../icons/ChatAlt';
import ClipboardListIcon from '../../icons/ClipboardList';
import FolderOpenIcon from '../../icons/FolderOpen';
import MailIcon from '../../icons/Mail';
import ShareIcon from '../../icons/Share';
import ShoppingBagIcon from '../../icons/ShoppingBag';
import ShoppingCartIcon from '../../icons/ShoppingCart';
import DataBase from '../../icons/DataBase';
import UserIcon from '../../icons/User';
import UsersIcon from '../../icons/Users';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';

const sections = [
  {
    title: "Tableaux d'analyse",
    items: [
      {
        title: 'Total de voyage de sables neufs par mois',
        path: '/dashboard/distClient',
        icon: <ChartPieIcon fontSize="small" />
      },
      {
        title: 'Total des ventes par année ',
        path: '/dashboard/ventes',
        icon: <ShoppingBagIcon fontSize="small" />
      },
      {
        title: 'Nombre de tonnes de sable récupéré par client par mois',
        path: '/dashboard/recupClient',
        icon: <ChartPieIcon fontSize="small" />
      },
      {
        title: 'Récupération et revalorisation',
        path: '/dashboard/recupReva',
        icon: <ReceiptIcon fontSize="small" />
      }
    ]
  },
  {
    title: 'Détails',
    items: [
      {
        title: 'Quickbooks',
        path: '/dashboard/quickbooks',
        icon: <UsersIcon fontSize="small" />,
        children: [
          {
            title: 'Listes',
            path: '/dashboard/quickbooks'
          },
          {
            title: 'Création',
            path: '/dashboard/quickbooks/new'
          }
        ]
      },
      {
        title: "Clients Produit Minéra",
        path: '/dashboard/customerMinera',
        icon: <UsersIcon fontSize="small" />,
        children: [
          {
            title: 'Listes',
            path: '/dashboard/customerMinera'
          },
          {
            title: 'Création',
            path: '/dashboard/customerMinera/new'
          }
        ]
      },
      {
        title: "Codes d'environnement",
        path: '/dashboard/environmentCode',
        icon: <UsersIcon fontSize="small" />,
        children: [
          {
            title: 'Listes',
            path: '/dashboard/environmentCode'
          },
          {
            title: 'Création',
            path: '/dashboard/environmentCode/new'
          }
        ]
      },
      {
        title: 'Produits',
        path: '/dashboard/products',
        icon: <ShoppingCartIcon fontSize="small" />,
        children: [
          {
            title: 'Listes',
            path: '/dashboard/products'
          },
          {
            title: 'Création',
            path: '/dashboard/products/new'
          }
        ]
      },
      
      {
        title: 'Base de données',
        path: '/dashboard/mainDatabases',
        icon: <DataBase fontSize="small" />,
        children: [
          {
            title: 'Listes',
            path: '/dashboard/mainDatabases'
          },
        ]
      }
    ],
    
  }
];

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const { user } = useAuth();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: 'none',
              xs: 'flex'
            },
            justifyContent: 'center',
            p: 2
          }}
        >
          <RouterLink to="/">
            <Logo
              sx={{
                height: 40,
                width: 40
              }}
            />
          </RouterLink>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {user.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                }
              }}
              {...section}
            />
          ))}
        </Box>
        <Divider />
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 280
        }
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default DashboardSidebar;

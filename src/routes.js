import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import GuestGuard from './components/GuestGuard';
import LoadingScreen from './components/LoadingScreen';
import MainLayout from './components/MainLayout';
import QuicbookCreate from './pages/dashboard/quicbookCreate';
import ProductCreate from './pages/dashboard/ProductCreate';
import ProductEdit from './pages/dashboard/ProductEdit';
import EnvironmentCodeCreate from './pages/dashboard/EnvironmentCodeCreate';
import EnvironmentCodeEdit from './pages/dashboard/EnvironmentCodeEdit';
import CustomerMineraCreate from './pages/dashboard/CustomerMineraCreate';
import CustomerMineraEdit from './pages/dashboard/CustomerMineraEdit';
import CustomerMineraDelete from './pages/dashboard/CustomerMineraDelete';
import EnvironmentCodeDelete from './pages/dashboard/EnvironmentCodeDelete';
import ProductDelete from './pages/dashboard/ProductDelete';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// Authentication pages

const Login = Loadable(lazy(() => import('./pages/authentication/Login')));

// Dashboard pages

const ProductList = Loadable(lazy(() => import('./pages/dashboard/ProductList')));
const MainDatabaseCreate = Loadable(lazy(() => import('./pages/dashboard/MainDatabaseCreate')));
const MainDatabaseList = Loadable(lazy(() => import('./pages/dashboard/MainDatabaseList')));
const TotalSalesByYearsList = Loadable(lazy(() => import('./pages/dashboard/totalSalesByYears')));
const EnvironmentCodeList = Loadable(lazy(() => import('./pages/dashboard/EnvironmentCodeList')));
const CustomerMineraList = Loadable(lazy(() => import('./pages/dashboard/CustomerMineraList')));
const CustomerRecoveryList = Loadable(lazy(() => import('./pages/dashboard/CustomerRecoveryList')));
const CustomerTravelDistributionList = Loadable(lazy(() => import('./pages/dashboard/CustomerTravelDistributionList')));
const RecoveryAndRevaluationList = Loadable(lazy(() => import('./pages/dashboard/RecoveryAndRevaluationList')));
// Error pages

const AuthorizationRequired = Loadable(lazy(() => import('./pages/AuthorizationRequired')));
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const ServerError = Loadable(lazy(() => import('./pages/ServerError')));

// quicbook
const QuicbookList = Loadable(lazy(() => import('./pages/dashboard/quickbooks')));

const routes = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        )
      },
      {
        path: 'login-unguarded',
        element: <Login />
      },
    ]
  },
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'ventes',
        children: [
          {
            path: '/',
            element: <TotalSalesByYearsList />
          }
        ]
      },
      {
        path: 'recupClient',
        children: [
          {
            path: '/',
            element: <CustomerRecoveryList />
          }
        ]
      },
      {
        path: 'distClient',
        children: [
          {
            path: '/',
            element: <CustomerTravelDistributionList />
          }
        ]
      },
      {
        path: 'recupReva',
        children: [
          {
            path: '/',
            element: <RecoveryAndRevaluationList />
          }
        ]
      },
      {
        path: 'quickbooks',
        children: [
          {
            path: '/',
            element: <QuicbookList />
          },
          {
            path: 'new',
            element: <QuicbookCreate />
          }
        ]
      },
      {
        path: 'products',
        children: [
          {
            path: '/',
            element: <ProductList />
          },
          {
            path: 'new',
            element: <ProductCreate />
          },
          {
            path: "edit/:productNumber",
            element: <ProductEdit props={window.location.href.split('/')[6]} />
          },
          {
            path: "delete/:productNumber",
            element: <ProductDelete props={window.location.href.split('/')[6]} />
          }
        ]
      },

      {
        path: 'environmentCode',
        children: [
          {
            path: '/',
            element: <EnvironmentCodeList />
          },
          {
            path: 'new',
            element: <EnvironmentCodeCreate />
          },
          {
            path: "edit/:longCode",
            element: <EnvironmentCodeEdit props={window.location.href.split('/')[6]} />
          },
          {
            path: "delete/:longCode",
            element: <EnvironmentCodeDelete props={window.location.href.split('/')[6]} />
          }
        ]
      },
      {
        path: 'customerMinera',
        children: [
          {
            path: '/',
            element: <CustomerMineraList />
          },
          {
            path: 'new',
            element: <CustomerMineraCreate />
          },
          {
            path: "edit/:customerId",
            element: <CustomerMineraEdit props={window.location.href.split('/')[6]} />
          },
          {
            path: "delete/:customerId",
            element: <CustomerMineraDelete props={window.location.href.split('/')[6]} />
          }
        ]
      },
      {
        path: 'mainDatabases',
        children: [
          {
            path: '/',
            element: <MainDatabaseList />
          },
          {
            path: 'new',
            element: <MainDatabaseCreate />
          }
        ]
      },
    ]
  },
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '401',
        element: <AuthorizationRequired />
      },
      {
        path: '404',
        element: <NotFound />
      },
      {
        path: '500',
        element: <ServerError />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

export default routes;

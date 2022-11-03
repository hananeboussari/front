import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import UploadIcon from '../../icons/Upload';
import PlusIcon from '../../icons/Plus';
import gtm from '../../lib/gtm';
import { Table,Popconfirm, Row, Col, Icon, Upload } from "antd";
import { CustomerRecoveryListTable } from '../../components/dashboard/customerRecovery';
import NoData from '../NoData';

const CustomerRecoveryList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [customerRecoveryDatas, setcustomerRecoveryDatas] = useState([]);
  const [download, setDownload] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getcustomerRecoveryDatas = useCallback(async () => {
    try {
      const result = await fetch(`https://ghislainhamel.herokuapp.com/customerRecovery/all`, {
        method: 'Get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',  
             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
        }      
    });
      const data = await result.json();
      if (mounted.current) {
        setcustomerRecoveryDatas(data);
      }
    } catch (err) {
      console.error(err);
    }
    setDownload(false);
  }, [mounted]);

  useEffect(() => {
    getcustomerRecoveryDatas();
  }, [getcustomerRecoveryDatas]);

    return (
      <>
        <Helmet>
          <title>Tableau de bord: Nombre de tonnes de sable récupéré par client par mois | Minera </title>
        </Helmet>
        <Box
          sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
        >
          <Container maxWidth={settings.compact ? 'xl' : false}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Nombre de tonnes de sable récupéré par client par mois
                </Typography>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={<ChevronRightIcon fontSize="small" />}
                  sx={{ mt: 1 }}
                >
                  <Link
                    color="textPrimary"
                    component={RouterLink}
                    to="/dashboard"
                    variant="subtitle2"
                  >
                    Tableau de bord
                  </Link>
                  <Link
                    color="textPrimary"
                    component={RouterLink}
                    to="/dashboard"
                    variant="subtitle2"
                  >
                    Analyses 
                  </Link>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    Nombre de tonnes de sable récupéré par client par mois 
                  </Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <CustomerRecoveryListTable 
                customerRecoveryDatas={customerRecoveryDatas}
                download={download} 
              />
            </Box>
          </Container>
        </Box>
      </>
  );
     
};

export default CustomerRecoveryList;

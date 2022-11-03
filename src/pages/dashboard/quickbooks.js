import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import PlusIcon from '../../icons/Plus';
import gtm from '../../lib/gtm';
import { Table,Popconfirm, Row, Col, Icon, Upload } from "antd";
import QuicbookListTable from '../../components/dashboard/quicbook/QuicbookListTable';
import toast from 'react-hot-toast';
import NoData from '../NoData';

const QuicbookList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [quicbookDatas, setQuicbookDatas] = useState([]);
  const [download, setDownload] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  
  const getQuicbookDatas = useCallback(async () => {
    try {
      //  const data = await campaignApi.getCampaigns();
      const result = await fetch(`https://ghislainhamel.herokuapp.com/quicbookData/all`, {
        method: 'Get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',  
             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
        }
      
    });
      const data = await result.json().catch((error) => { console.log(error); });
      console.log(data);
      if (mounted.current) {
        setQuicbookDatas(data);
      }
    } catch (err) {
      console.error(err);
    }
    setDownload(false);
  }, [mounted]);

  useEffect(() => {
    getQuicbookDatas();
  }, [getQuicbookDatas]);

    return (
      <>
        <Helmet>
          <title>Tableau de bord: Listes des données provenant de Quickbooks | Minera</title>
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
                  Listes des données provenant de Quickbooks
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
                    Détails
                  </Link>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    Quickbooks
                  </Typography>
                </Breadcrumbs>
              </Grid>
              <Grid item>
                <Box sx={{ m: -1 }}>
                  <Button
                    component={RouterLink}
                    color="primary"
                    startIcon={<PlusIcon fontSize="small" />}
                    sx={{ m: 1 }}
                    to="/dashboard/quickbooks/new"
                    variant="contained"
                  >
                    Ajouter
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <QuicbookListTable 
                quicbookDatas={quicbookDatas} 
                download={download} 
              />
            </Box>
          </Container>
        </Box>
      </>
  );
   
};

export default QuicbookList;

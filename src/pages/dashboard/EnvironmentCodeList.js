import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import { EnvironmentCodeListTable } from '../../components/dashboard/environmentCode';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import UploadIcon from '../../icons/Upload';
import PlusIcon from '../../icons/Plus';
import gtm from '../../lib/gtm';
import NoData from '../NoData';

const EnvironmentCodeList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [environmentCodeDatas, setEnvironmentCodeDatas] = useState([]);
  const [download, setDownload] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getEnvironmentCodeDatas = useCallback(async () => {
    try {
      const result = await fetch(`https://ghislainhamel.herokuapp.com/environmentCode/allECodes`, {
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
        setEnvironmentCodeDatas(data);
      }
    } catch (err) {
      console.error(err);
    }
    setDownload(false);
  }, [mounted]);

  useEffect(() => {
    getEnvironmentCodeDatas();
  }, [getEnvironmentCodeDatas]);
  
  return (
    <>
      <Helmet>
        <title>Tableau de bord: Listes environnement code | Minera</title>
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
                Listes environnement code
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
                  Code Environnement
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <EnvironmentCodeListTable 
              environmentCodeDatas={environmentCodeDatas} 
              download={download} 
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default EnvironmentCodeList;

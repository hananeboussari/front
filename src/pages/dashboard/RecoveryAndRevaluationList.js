import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { RecoveryRevaluationListTable } from '../../components/dashboard/recoveryAndRevaluation';
import NoData from '../NoData';

const RecoveryAndRevaluationList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [recoveryRevaluationDatas, setrecoveryRevaluationDatas] = useState([]);
  const [download, setDownload] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getrecoveryRevaluationDatas = useCallback(async () => {
    try {
      const result = await fetch(`https://ghislainhamel.herokuapp.com/recoveryAndRevaluation/all`, {
        method: 'Get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',  
             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
        }
      
    });

      const data = await result.json().catch((error) => { console.log(error); });
      if (mounted.current) {
        setrecoveryRevaluationDatas(data);
      }
    } catch (err) {
      console.error(err);
    }
    setDownload(false);
  }, [mounted]);

  useEffect(() => {
    getrecoveryRevaluationDatas();
  }, [getrecoveryRevaluationDatas]);

    return (
      <>
        <Helmet>
          <title>Tableau de bord: Récupération/Revalorisation | Minera</title>
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
                  Récupération et revalorisation
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
                    Récupération et revalorisation
                  </Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <RecoveryRevaluationListTable 
                recoveryRevaluationDatas={recoveryRevaluationDatas}
                download={download} 
              />
            </Box>
          </Container>
        </Box>
      </>
  );
    
  };

export default RecoveryAndRevaluationList;

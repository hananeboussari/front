import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import { mainDatabaseApi } from '../../__fakeApi__/mainDatabaseApi';
import { MainDatabaseListTable } from '../../components/dashboard/mainDatabase';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import UploadIcon from '../../icons/Upload';
import PlusIcon from '../../icons/Plus';
import gtm from '../../lib/gtm';
import NoData from '../NoData';

const MainDatabaseList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [mainDatabases, setMainDatabases] = useState([]);
  const [download, setDownload] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getMainDatabases = useCallback(async () => {
    try {
      const qte = await fetch('https://ghislainhamel.herokuapp.com/mainDatabase/qte', {
        method: 'Get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',  
             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
        }
      });
      const value = Math.ceil((await qte.json()) / 1000);

      const data = [];
      const range = [];
      for (let index = 0; index < value; index++) {
        range.push(index * 1000);
      }
      range.map(async (start) => {
        const test = 'https://ghislainhamel.herokuapp.com/mainDatabase/range/'.concat(start);
        const result = await fetch(test, {
          method: 'Get',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',  
               Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
          }
        });
        data.push(await result.json());
        if (mounted.current) {
          setMainDatabases(await data.flat());
        }
      });
      
    } catch (err) {
      console.error(err);
    }
    setDownload(false);
  }, [mounted]);
  useEffect(() => {
    getMainDatabases();
  }, [getMainDatabases]);
  return (
    <>
      <Helmet>
        <title>Tableau de bord: Listes des données dans la base de donnée | Minera</title>
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
                Listes des données dans la base de donnée
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
                  Bases de données
                </Typography>
              </Breadcrumbs>
            </Grid>
            {/* <Grid item>
              <Box
                sx={{
                  mb: -1,
                  mx: -1,
                  mt: 1
                }}
              >
                <Button
                  color="primary"
                  startIcon={<DownloadIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="text"
                >
                  Télécharger
                </Button>
              </Box>
            </Grid> */}
          </Grid>
          <Box sx={{ mt: 3 }}>
            <MainDatabaseListTable 
              mainDatabases={mainDatabases} 
              download={download} 
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MainDatabaseList;

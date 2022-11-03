import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography, Alert, Button } from '@material-ui/core';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import toast from 'react-hot-toast';

const EnvironmentCodeDelete = (props) => {
  const { ...longCode } = props;
  const { settings } = useSettings();
  const mounted = useMounted();
  const navigate = useNavigate();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  const deleteECodes = useCallback(async () => {
    try {
      const result = await fetch(`https://ghislainhamel.herokuapp.com/environmentCode/delete/${longCode.props}`, {
        method: 'delete',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',  
             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
        }
      
    });

      if (mounted.current) {
        if (result.status === 200 || result.status === 201) {
            toast.success('Environnement codes est supprimer');
            navigate("/dashboard/environmentCode");
        } else {
            toast.error('Un erreur a suervenue lors de la suppression  du environnement codes ');
            navigate('/dashboard/environmentCode');
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  return (
    <>
      <Helmet>
        <title>Tableau de bord: Supprimer Environnement codes </title>
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
                Supprimer Environnement codes
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
                  Details
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Environnement codes
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Alert
              severity="error"
              variant="filled"
            >
              Êtes-vous certain de vouloir supprimer cette élément
            </Alert> 
          </Box>
          <Box mt={4}>
            <Button 
              ml={3}
              color="primary"
              type="submit"
              variant="outlined"
              href="/dashboard/environmentCode"
            >
              Retour
            </Button>
            <Button
              color="error"
              type="submit"
              variant="outlined"
              onClick={deleteECodes}
            >
              Suprimer
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default EnvironmentCodeDelete;

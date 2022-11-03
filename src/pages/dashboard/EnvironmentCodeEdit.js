import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { campaignApi } from '../../__fakeApi__/CampaignApi';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  FormHelperText,
  TextField,
  Box, Breadcrumbs, Container, Grid, Link, Typography
} from '@material-ui/core';

const EnvironmentCodeEdit = (props) => {
  
  const navigate = useNavigate();
  const { ...codeLong } = props;
  const { settings } = useSettings();
  const mounted = useMounted();
  const [values, setValues] = useState(
    {
      longCode: '',
      environmentNumber: '',
      productNumber: '',
      environmentDescription: '',
      format: '',
      customerId: '',
      customerName: ''
    }
  );
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  const getECodeDatas = useCallback(async () => {
    try {
    if (codeLong.props) {
      const result = await fetch(`https://ghislainhamel.herokuapp.com/environmentCode/${codeLong.props}`, {
        method: 'Get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',  
             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
        }
      
    });
      const data = await result.json().catch((error) => { console.log(error); });
      if (data) {
        setValues(data);
      }
    } else {
      toast.error('Code long est vide');
    } 
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getECodeDatas();
  }, [getECodeDatas]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  
  return (
    <>
      <Helmet>
        <title>Tableau de bord: Modifier environnement codes </title>
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
                Modifier codes environnement
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
                  Codes environnement
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Formik>
            {({
              errors,
              handleBlur,
              isSubmitting,
              touched,
            }) => (
              <form
                onSubmit={async event => {
                  event.preventDefault();
                  try {
                      await fetch(`https://ghislainhamel.herokuapp.com/environmentCode/update/${codeLong.props}`, {
                          method: 'put',
                          headers: {
                              'Content-Type': 'application/json',               
                          },
                          body: JSON.stringify(values)
                      }).then(response => { 
                        if (response.status === 200 || response.status === 201) {
                          toast.success("Le code d'environnement est modifier");
                          navigate('/dashboard/environmentCode');
                        } else {
                          toast.error('Un erreur a suervenue lors de la création du en code ');
                        }
                      }).catch(err => console.log(err));
                  } catch (error) {
                      console.log(error);
                  }
              }}
                {...props}
              >
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    lg={8}
                    md={6}
                    xs={12}
                  >
                    <Card>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.longCode && errors.longCode)}
                          fullWidth
                          helperText={touched.longCode && errors.longCode}
                          label="Code long"
                          name="longCode"
                          onChange={handleChange('longCode')}
                          value={values.longCode}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.environmentNumber && errors.environmentNumber)}
                          fullWidth
                          helperText={touched.environmentNumber && errors.environmentNumber}
                          label="Numéro d'environnement"
                          name="environmentNumber"
                          onBlur={handleBlur}
                          onChange={handleChange('environmentNumber')}
                          value={values.environmentNumber}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.productNumber && errors.productNumber)}
                          fullWidth
                          helperText={touched.productNumber && errors.productNumber}
                          label="Numéro de produit"
                          name="productNumber"
                          onBlur={handleBlur}
                          onChange={handleChange('productNumber')}
                          value={values.productNumber}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.environmentDescription && errors.environmentDescription)}
                          fullWidth
                          helperText={touched.environmentDescription && errors.environmentDescription}
                          label="Description d'environnement"
                          name="environmentDescription"
                          onBlur={handleBlur}
                          onChange={handleChange('environmentDescription')}
                          value={values.environmentDescription}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.format && errors.format)}
                          fullWidth
                          helperText={touched.format && errors.format}
                          label="Format"
                          name="format"
                          onBlur={handleBlur}
                          onChange={handleChange('format')}
                          value={values.format}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.customerName && errors.customerName)}
                          fullWidth
                          helperText={touched.customerName && errors.customerName}
                          label="Nom de client"
                          name="customerName"
                          onBlur={handleBlur}
                          onChange={handleChange('customerName')}
                          value={values.customerName}
                          variant="outlined"
                        />
                
                      </CardContent>
                    </Card>
                  
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    md={6}
                    xs={12}
                  >
                    
                    {errors.submit && (
                      <Box sx={{ mt: 3 }}>
                        <FormHelperText error>
                          {errors.submit}
                        </FormHelperText>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-basis',
                        mt: 1
                      }}
                    >
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                      >
                        Modifier environnement codes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default EnvironmentCodeEdit;

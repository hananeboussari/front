import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import toast from 'react-hot-toast';
import { Formik } from 'formik';
import {
  Button,
  Card,
  CardContent,
  FormHelperText,
  TextField,
  Box, Breadcrumbs, Container, Grid, Link, Typography
} from '@material-ui/core';

const CustomerMineraEdit = (props) => {
  const navigate = useNavigate();
  const { ...customerId } = props;
  console.log(customerId);
  const { settings } = useSettings();
  const mounted = useMounted();
  const [values, setValues] = useState({
    quickbooksName: '',
    customerId: '',
    customerDescription: ''
  });
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  const getCustomerMineraDatas = useCallback(async () => {
    try {
      const result = await fetch(`https://ghislainhamel.herokuapp.com/customer/${customerId.props}`, {
        method: 'Get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'         
        }
      
    });
      const data = await result.json().catch((error) => { console.log(error); });
      if (mounted.current) {
       if (result.status === 200) {
        if (data) {
          setValues(data);
        }
       } else {
        toast.error('Un erreur a survenue');
       }
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getCustomerMineraDatas();
  }, [getCustomerMineraDatas]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Tableau de bord: Modifier le client </title>
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
                Modifier le client
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
                  Client
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
                      await fetch(`/customer/update/${customerId.props}`, {
                          method: 'put',
                          headers: {
                              'Content-Type': 'application/json',               
                          },
                          body: JSON.stringify(values)
                      }).then(response => { 
                        if (response.status === 200 || response.status === 201) {
                          toast.success('Le client est modifier');
                          navigate('/dashboard/customerMinera');
                        } else {
                          toast.error('Un erreur a survenue lors de la mise à jour  du client ');
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
                          error={Boolean(touched.quickbooksName && errors.quickbooksName)}
                          fullWidth
                          helperText={touched.quickbooksName && errors.quickbooksName}
                          label="Nom dans Quickbooks"
                          name="quickbooksName"
                          onBlur={handleBlur}
                          onChange={handleChange('quickbooksName')}
                          value={values.quickbooksName}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.customerId && errors.customerId)}
                          fullWidth
                          helperText={touched.customerId && errors.customerId}
                          label="N° Client"
                          name="customerId"
                          onBlur={handleBlur}
                          onChange={handleChange('customerId')}
                          value={values.customerId}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.customerDescription && errors.customerDescription)}
                          fullWidth
                          helperText={touched.customerDescription && errors.customerDescription}
                          label="Description de client"
                          name="customerDescription"
                          onBlur={handleBlur}
                          onChange={handleChange('customerDescription')}
                          value={values.customerDescription}
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
                        Modifier Client
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

export default CustomerMineraEdit;

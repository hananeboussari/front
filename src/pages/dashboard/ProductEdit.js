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

const ProductEdit = (props) => {
  const { ...productNumber } = props;
  const [values, setValues] = useState(
    {
      productNumber: '',
      productDescription: '',
      productType: '',
      format: '',
    }
  );
  const { settings } = useSettings();
  const navigate = useNavigate();
  const mounted = useMounted();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  const getproductDatas = useCallback(async () => {
    try {
      const result = await fetch(`https://ghislainhamel.herokuapp.com/product/${productNumber.props}`, {
        method: 'Get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',  
             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhib3Vzc2FyaUBhbmdlbHNvZnR3YXJlcy5jYSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQyMzgzNjQ1LCJleHAiOjE2NDI5ODg0NDV9.d4EHhvR_U4mcVbdjG55y6QHjYVu6sKSRwdYaet810IY'          
        }
      
    });
      const data = await result.json().catch((error) => { console.log(error); });
      if (mounted.current) {
        if (result.status === 200) {
          if (data) {
            setValues(data);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getproductDatas();
  }, [getproductDatas]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  return (
    <>
      <Helmet>
        <title>Tableau de bord: Modifier produit </title>
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
                Modifier le produit
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
                  Produit
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
                      const modify = "/product/update/".concat(productNumber.props);
                      console.log(values);
                      await fetch(modify, {
                          method: 'put',
                          headers: {
                              'Content-Type': 'application/json',               
                          },
                          body: JSON.stringify(values)
                      }).then(response => { 
                        if (response.status === 200 || response.status === 201) {
                          toast.success('Produit  modifié!');
                          navigate('/dashboard/products');
                        } else {
                          toast.error('Something went wrong!');
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
                          error={Boolean(touched.productNumber && errors.productNumber)}
                          fullWidth
                          helperText={touched.productNumber && errors.productNumber}
                          label="N° produit"
                          name="productNumber"
                          onBlur={handleBlur}
                          onChange={handleChange('productNumber')}
                          value={values.productNumber}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.productDescription && errors.productDescription)}
                          fullWidth
                          helperText={touched.productDescription && errors.productDescription}
                          label="Description de produit"
                          name="productDescription"
                          onBlur={handleBlur}
                          onChange={handleChange('productDescription')}
                          value={values.productDescription}
                          variant="outlined"
                        />
                
                      </CardContent>
                      <CardContent>
                        <TextField
                          error={Boolean(touched.productType && errors.productType)}
                          fullWidth
                          helperText={touched.productType && errors.productType}
                          label="Type de produit"
                          name="productType"
                          onBlur={handleBlur}
                          onChange={handleChange('productType')}
                          value={values.productType}
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
                        Modifier Produit
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

export default ProductEdit;

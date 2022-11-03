import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';

const ProductEditForm = (props) => {
  const { product,...other } = props;
  console.log(product.productNumber);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  return (
    <Formik
      initialValues={{
        productNumber: '',
        productDescription: '',
        productType: '',
        format: '',
        FailureReason: "Non",
        status: "Creating"
      }}
      validationSchema={Yup
        .object()
        .shape({
          productNumber: Yup.string().max(63).min(1).required(),
          productDescription: Yup.string().max(256).min(1).required(),
          productType: Yup.string().min(1).required(),
          format: Yup.string().min(1).required()
          
        })}
      
    >
      {({
        errors,
        handleBlur,
        handleChange,
        // handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          onSubmit={async event => {
            event.preventDefault();
            try {
                const modify = "https://ghislainhamel.herokuapp.com/product/update/".concat(product.productNumber);
                console.log(values);
                await fetch(modify, {
                    method: 'put',
                    mode: 'cors',
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
                    label="productNumber"
                    name="productNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productNumber}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.productDescription && errors.productDescription)}
                    fullWidth
                    helperText={touched.productDescription && errors.productDescription}
                    label="productDescription"
                    name="productDescription"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productDescription}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.productType && errors.productType)}
                    fullWidth
                    helperText={touched.productType && errors.productType}
                    label="productType"
                    name="productType"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productType}
                    variant="outlined"
                  />
          
                </CardContent>
                <CardContent>
                  <TextField
                    error={Boolean(touched.format && errors.format)}
                    fullWidth
                    helperText={touched.format && errors.format}
                    label="format"
                    name="format"
                    onBlur={handleBlur}
                    onChange={handleChange}
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
  );
};
ProductEditForm.propTypes = {
  product: PropTypes.object.isRequired
};
export default ProductEditForm;

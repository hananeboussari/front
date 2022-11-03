import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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

const ProductCreateForm = (props) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };
 
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
          productNumber: Yup.string().max(63).min(1).required("Le nom de produit est requis"),
          productDescription: Yup.string().max(256).min(1).required("La description de produit est requis"),
          productType: Yup.string().min(1).required("Le type de produit est requis"),
          format: Yup.string().min(1).required("Le format est requis")
          
        })}
      
    >
      {({
        errors,
        handleBlur,
        handleChange,
        // handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={async event => {
            event.preventDefault();
            if (values.productNumber && values.productDescription && values.productType && values.format) {
            try {
                await fetch("https://ghislainhamel.herokuapp.com/product/create", {
                    method: 'post',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',               
                    },
                    body: JSON.stringify(values)
                }).then(response => { 
                  if (response.status === 200 || response.status === 201) {
                    toast.success('Produit  créé!');
                    navigate('/dashboard/products');
                  } else {
                    toast.error('Something went wrong!');
                  }
                }).catch(err => console.log(err));
            } catch (error) {
                console.log(error);
            }
          } else {
              toast.error('tous les champs sont requis');
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
                    label="Description de produit"
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
                    label="Type de produit"
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
                    label="Format"
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
                  Créer Produit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default ProductCreateForm;

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
import FileDropzone from '../../FileDropzone';
import QuillEditor from '../../QuillEditor';

const categoryOptions = [
  {
    value: 'shirts',
    label: 'Shirts'
  },
  {
    label: 'Phones',
    value: 'phones'
  },
  {
    label: 'Cars',
    value: 'cars'
  }
];

const MainDatabaseCreateForm = (props) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  console.log(files);
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
        category: '',
        description: '',
        images: [],
        includesTaxes: false,
        isTaxable: false,
        name: '',
        price: '',
        mainDatabaseCode: '',
        mainDatabaseSku: '',
        salePrice: '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          customerId: Yup.string().max(255),
          customerIdShort: Yup.number().max(5000),
          devise: Yup.string().max(255),
          customerName: Yup.string().max(255),
          productNumber: Yup.string().max(255),
          productDescription: Yup.string().max(255),
          quantity: Yup.number().max(5000),
          quantityInKg: Yup.number().max(5000000),
          price: Yup.number().max(5000000),
          date: Yup.date(),
          productType: Yup.number().min(0).required(),
          priceConverted: Yup.string().max(255),
          financialYear: Yup.number().min(0).required(),
          financialPeriod: Yup.string().max(255),
          year: Yup.string().max(255),
          month: Yup.number().min(0),
          semester: Yup.string().max(255),
          day: Yup.number().min(0),
          longCode: Yup.number().min(0),
          environnmentNumber: Yup.number().min(0),
          format: Yup.number().min(0)
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          console.log(values);
          // NOTE: Make API request
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('MainDatabase created!');
          navigate('/dashboard/mainDatabases');
        } catch (err) {
          console.error(err);
          toast.error('Something went wrong!');
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
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
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="MainDatabase Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 2,
                      mt: 3
                    }}
                    variant="subtitle2"
                  >
                    Description
                  </Typography>
                  <QuillEditor
                    onChange={(value) => setFieldValue('description', value)}
                    placeholder="Write something"
                    sx={{ height: 400 }}
                    value={values.description}
                  />
                  {(touched.description && errors.description) && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.description}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="Upload Images" />
                  <CardContent>
                    <FileDropzone
                      accept="*"
                      files={files}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                    />
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="Prices" />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.price && errors.price)}
                          fullWidth
                          helperText={touched.price && errors.price
                            ? errors.price
                            : 'If you have a sale price this will be shown as old price'}
                          label="Price"
                          name="price"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="number"
                          value={values.price}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.salePrice && errors.salePrice)}
                          fullWidth
                          helperText={touched.salePrice && errors.salePrice}
                          label="Sale price"
                          name="salePrice"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="number"
                          value={values.salePrice}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={values.isTaxable}
                            color="primary"
                            name="isTaxable"
                            onChange={handleChange}
                            value={values.isTaxable}
                          />
                        )}
                        label="MainDatabase is taxable"
                      />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={values.includesTaxes}
                            color="primary"
                            name="includesTaxes"
                            onChange={handleChange}
                            value={values.includesTaxes}
                          />
                        )}
                        label="Price includes taxes"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xs={12}
            >
              <Card>
                <CardHeader title="Organize" />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.category}
                    variant="outlined"
                  >
                    {categoryOptions.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                  </TextField>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(touched.mainDatabaseCode && errors.mainDatabaseCode)}
                      fullWidth
                      helperText={touched.mainDatabaseCode && errors.mainDatabaseCode}
                      label="MainDatabase Code"
                      name="mainDatabaseCode"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.mainDatabaseCode}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(touched.mainDatabaseSku && errors.mainDatabaseSku)}
                      fullWidth
                      helperText={touched.mainDatabaseSku && errors.mainDatabaseSku}
                      label="MainDatabase Sku"
                      name="mainDatabaseSku"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.mainDatabaseSku}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
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
                  justifyContent: 'flex-end',
                  mt: 3
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Create MainDatabase
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default MainDatabaseCreateForm;

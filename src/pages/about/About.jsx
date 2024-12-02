import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DatasetIcon from '@mui/icons-material/Dataset';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const About = () => {
  const features = [
    'Advanced regression techniques',
    'Feature engineering',
    'Data preprocessing',
    'Model validation',
    'Hyperparameter tuning',
    'Cross-validation'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 8 }}>
        <Typography
          component="h1"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          About Our Project
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Learn about the technology and methodology behind our house price prediction system
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <DatasetIcon sx={{ fontSize: 40, mr: 2, color: '#2196F3' }} />
              <Typography variant="h5" component="h2">
                The Dataset
              </Typography>
            </Box>
            <Typography paragraph>
              Our model is trained on the comprehensive Ames Housing dataset, which includes
              79 explanatory variables describing various aspects of residential homes.
            </Typography>
            <Typography paragraph>
              This rich dataset allows our model to consider multiple factors when making
              predictions, resulting in more accurate price estimates.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ModelTrainingIcon sx={{ fontSize: 40, mr: 2, color: '#2196F3' }} />
              <Typography variant="h5" component="h2">
                Our Approach
              </Typography>
            </Box>
            <List>
              {features.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PrecisionManufacturingIcon sx={{ fontSize: 40, mr: 2, color: '#2196F3' }} />
              <Typography variant="h5" component="h2">
                Technology Stack
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Frontend
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="React.js" secondary="Modern UI framework" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Material-UI" secondary="Component library" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Backend
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Python" secondary="Data processing" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Scikit-learn" secondary="Machine learning" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  ML Models
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Random Forest" secondary="Ensemble learning" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="XGBoost" secondary="Gradient boosting" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
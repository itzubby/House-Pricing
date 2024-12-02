import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './prediction.css';
import Papa from 'papaparse';
import usePrediction from './usePrediction';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Slider,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

// Option mappings
const qualityScale = [
  { value: '10', label: 'Very Excellent' },
  { value: '9', label: 'Excellent' },
  { value: '8', label: 'Very Good' },
  { value: '7', label: 'Good' },
  { value: '6', label: 'Above Average' },
  { value: '5', label: 'Average' },
  { value: '4', label: 'Below Average' },
  { value: '3', label: 'Fair' },
  { value: '2', label: 'Poor' },
  { value: '1', label: 'Very Poor' }
];

const zoning = [
  { value: 'A', label: 'Agriculture' },
  { value: 'C', label: 'Commercial' },
  { value: 'FV', label: 'Floating Village Residential' },
  { value: 'I', label: 'Industrial' },
  { value: 'RH', label: 'Residential High Density' },
  { value: 'RL', label: 'Residential Low Density' },
  { value: 'RP', label: 'Residential Low Density Park' },
  { value: 'RM', label: 'Residential Medium Density' }
];

const neighborhoods = [
  'Blmngtn', 'Blueste', 'BrDale', 'BrkSide', 'ClearCr', 'CollgCr', 'Crawfor',
  'Edwards', 'Gilbert', 'IDOTRR', 'MeadowV', 'Mitchel', 'NAmes', 'NPkVill',
  'NWAmes', 'NoRidge', 'NridgHt', 'OldTown', 'SWISU', 'Sawyer', 'SawyerW',
  'Somerst', 'StoneBr', 'Timber', 'Veenker'
].map(n => ({ value: n, label: n }));

const buildingTypes = [
  { value: '1Fam', label: 'Single-family Detached' },
  { value: '2FmCon', label: 'Two-family Conversion' },
  { value: 'Duplx', label: 'Duplex' },
  { value: 'TwnhsE', label: 'Townhouse End Unit' },
  { value: 'TwnhsI', label: 'Townhouse Inside Unit' }
];

const qualityRatings = [
  { value: 'Ex', label: 'Excellent' },
  { value: 'Gd', label: 'Good' },
  { value: 'TA', label: 'Average/Typical' },
  { value: 'Fa', label: 'Fair' },
  { value: 'Po', label: 'Poor' }
];

// Complete option mappings based on data_description.txt
const MSSubClassOptions = [
  { value: '20', label: '1-STORY 1946 & NEWER ALL STYLES' },
  { value: '30', label: '1-STORY 1945 & OLDER' },
  { value: '40', label: '1-STORY W/FINISHED ATTIC ALL AGES' },
  { value: '45', label: '1-1/2 STORY - UNFINISHED ALL AGES' },
  { value: '50', label: '1-1/2 STORY FINISHED ALL AGES' },
  { value: '60', label: '2-STORY 1946 & NEWER' },
  { value: '70', label: '2-STORY 1945 & OLDER' },
  { value: '75', label: '2-1/2 STORY ALL AGES' },
  { value: '80', label: 'SPLIT OR MULTI-LEVEL' },
  { value: '85', label: 'SPLIT FOYER' },
  { value: '90', label: 'DUPLEX - ALL STYLES AND AGES' },
  { value: '120', label: '1-STORY PUD (1946 & NEWER)' },
  { value: '150', label: '1-1/2 STORY PUD - ALL AGES' },
  { value: '160', label: '2-STORY PUD - 1946 & NEWER' },
  { value: '180', label: 'PUD - MULTILEVEL' },
  { value: '190', label: '2 FAMILY CONVERSION' }
];

const streetOptions = [
  { value: 'Grvl', label: 'Gravel' },
  { value: 'Pave', label: 'Paved' }
];

const alleyOptions = [
  { value: 'Grvl', label: 'Gravel' },
  { value: 'Pave', label: 'Paved' },
  { value: 'NA', label: 'No alley access' }
];

const lotShapeOptions = [
  { value: 'Reg', label: 'Regular' },
  { value: 'IR1', label: 'Slightly irregular' },
  { value: 'IR2', label: 'Moderately Irregular' },
  { value: 'IR3', label: 'Irregular' }
];

const landContourOptions = [
  { value: 'Lvl', label: 'Near Flat/Level' },
  { value: 'Bnk', label: 'Banked' },
  { value: 'HLS', label: 'Hillside' },
  { value: 'Low', label: 'Depression' }
];

// Additional option mappings
const utilitiesOptions = [
  { value: 'AllPub', label: 'All public Utilities' },
  { value: 'NoSewr', label: 'Electricity, Gas, Water (Septic Tank)' },
  { value: 'NoSeWa', label: 'Electricity and Gas Only' },
  { value: 'ELO', label: 'Electricity only' }
];

const lotConfigOptions = [
  { value: 'Inside', label: 'Inside lot' },
  { value: 'Corner', label: 'Corner lot' },
  { value: 'CulDSac', label: 'Cul-de-sac' },
  { value: 'FR2', label: 'Frontage on 2 sides' },
  { value: 'FR3', label: 'Frontage on 3 sides' }
];

const landSlopeOptions = [
  { value: 'Gtl', label: 'Gentle slope' },
  { value: 'Mod', label: 'Moderate slope' },
  { value: 'Sev', label: 'Severe slope' }
];

const exteriorOptions = [
  { value: 'AsbShng', label: 'Asbestos Shingles' },
  { value: 'AsphShn', label: 'Asphalt Shingles' },
  { value: 'BrkComm', label: 'Brick Common' },
  { value: 'BrkFace', label: 'Brick Face' },
  { value: 'CBlock', label: 'Cinder Block' },
  { value: 'CemntBd', label: 'Cement Board' },
  { value: 'HdBoard', label: 'Hard Board' },
  { value: 'ImStucc', label: 'Imitation Stucco' },
  { value: 'MetalSd', label: 'Metal Siding' },
  { value: 'Plywood', label: 'Plywood' },
  { value: 'Stone', label: 'Stone' },
  { value: 'Stucco', label: 'Stucco' },
  { value: 'VinylSd', label: 'Vinyl Siding' },
  { value: 'Wd Sdng', label: 'Wood Siding' },
  { value: 'WdShing', label: 'Wood Shingles' }
];

const foundationOptions = [
  { value: 'BrkTil', label: 'Brick & Tile' },
  { value: 'CBlock', label: 'Cinder Block' },
  { value: 'PConc', label: 'Poured Contrete' },
  { value: 'Slab', label: 'Slab' },
  { value: 'Stone', label: 'Stone' },
  { value: 'Wood', label: 'Wood' }
];

const basementOptions = [
  { value: 'GLQ', label: 'Good Living Quarters' },
  { value: 'ALQ', label: 'Average Living Quarters' },
  { value: 'BLQ', label: 'Below Average Living Quarters' },
  { value: 'Rec', label: 'Average Rec Room' },
  { value: 'LwQ', label: 'Low Quality' },
  { value: 'Unf', label: 'Unfinished' },
  { value: 'NA', label: 'No Basement' }
];

const heatingOptions = [
  { value: 'Floor', label: 'Floor Furnace' },
  { value: 'GasA', label: 'Gas forced warm air furnace' },
  { value: 'GasW', label: 'Gas hot water or steam heat' },
  { value: 'Grav', label: 'Gravity furnace' },
  { value: 'OthW', label: 'Hot water or steam heat other than gas' },
  { value: 'Wall', label: 'Wall furnace' }
];

const garageOptions = [
  { value: '2Types', label: 'More than one type' },
  { value: 'Attchd', label: 'Attached to home' },
  { value: 'Basment', label: 'Basement Garage' },
  { value: 'BuiltIn', label: 'Built-In (Garage part of house)' },
  { value: 'CarPort', label: 'Car Port' },
  { value: 'Detchd', label: 'Detached from home' },
  { value: 'NA', label: 'No Garage' }
];

const roofStyleOptions = [
  { value: 'Flat', label: 'Flat' },
  { value: 'Gable', label: 'Gable' },
  { value: 'Gambrel', label: 'Gabrel (Barn)' },
  { value: 'Hip', label: 'Hip' },
  { value: 'Mansard', label: 'Mansard' },
  { value: 'Shed', label: 'Shed' }
];

const roofMatlOptions = [
  { value: 'ClyTile', label: 'Clay or Tile' },
  { value: 'CompShg', label: 'Standard (Composite) Shingle' },
  { value: 'Membran', label: 'Membrane' },
  { value: 'Metal', label: 'Metal' },
  { value: 'Roll', label: 'Roll' },
  { value: 'Tar&Grv', label: 'Gravel & Tar' },
  { value: 'WdShake', label: 'Wood Shakes' },
  { value: 'WdShngl', label: 'Wood Shingles' }
];

const fenceOptions = [
  { value: 'GdPrv', label: 'Good Privacy' },
  { value: 'MnPrv', label: 'Minimum Privacy' },
  { value: 'GdWo', label: 'Good Wood' },
  { value: 'MnWw', label: 'Minimum Wood/Wire' },
  { value: 'NA', label: 'No Fence' }
];

const functionalOptions = [
  { value: 'Typ', label: 'Typical Functionality' },
  { value: 'Min1', label: 'Minor Deductions 1' },
  { value: 'Min2', label: 'Minor Deductions 2' },
  { value: 'Mod', label: 'Moderate Deductions' },
  { value: 'Maj1', label: 'Major Deductions 1' },
  { value: 'Maj2', label: 'Major Deductions 2' },
  { value: 'Sev', label: 'Severely Damaged' },
  { value: 'Sal', label: 'Salvage only' }
];

const saleTypeOptions = [
  { value: 'WD', label: 'Warranty Deed - Conventional' },
  { value: 'CWD', label: 'Warranty Deed - Cash' },
  { value: 'VWD', label: 'Warranty Deed - VA Loan' },
  { value: 'New', label: 'Home just constructed and sold' },
  { value: 'COD', label: 'Court Officer Deed/Estate' },
  { value: 'Con', label: 'Contract 15% Down payment regular terms' },
  { value: 'ConLw', label: 'Contract Low Down payment and low interest' },
  { value: 'ConLI', label: 'Contract Low Interest' },
  { value: 'ConLD', label: 'Contract Low Down' },
  { value: 'Oth', label: 'Other' }
];

const saleConditionOptions = [
  { value: 'Normal', label: 'Normal Sale' },
  { value: 'Abnorml', label: 'Abnormal Sale - trade, foreclosure, short sale' },
  { value: 'AdjLand', label: 'Adjoining Land Purchase' },
  { value: 'Alloca', label: 'Allocation - two linked properties with separate deeds' },
  { value: 'Family', label: 'Sale between family members' },
  { value: 'Partial', label: 'Home was not completed when last assessed' }
];

// Additional quality rating options
const qualityOptions = [
  { value: 'Ex', label: 'Excellent' },
  { value: 'Gd', label: 'Good' },
  { value: 'TA', label: 'Typical/Average' },
  { value: 'Fa', label: 'Fair' },
  { value: 'Po', label: 'Poor' }
];

const conditionOptions = [
  { value: 'Artery', label: 'Adjacent to arterial street' },
  { value: 'Feedr', label: 'Adjacent to feeder street' },
  { value: 'Norm', label: 'Normal' },
  { value: 'RRNn', label: 'Within 200\' of North-South Railroad' },
  { value: 'RRAn', label: 'Adjacent to North-South Railroad' },
  { value: 'PosN', label: 'Near positive off-site feature' },
  { value: 'PosA', label: 'Adjacent to positive off-site feature' },
  { value: 'RRNe', label: 'Within 200\' of East-West Railroad' },
  { value: 'RRAe', label: 'Adjacent to East-West Railroad' }
];

const houseStyleOptions = [
  { value: '1Story', label: 'One story' },
  { value: '1.5Fin', label: 'One and one-half story: 2nd level finished' },
  { value: '1.5Unf', label: 'One and one-half story: 2nd level unfinished' },
  { value: '2Story', label: 'Two story' },
  { value: '2.5Fin', label: 'Two and one-half story: 2nd level finished' },
  { value: '2.5Unf', label: 'Two and one-half story: 2nd level unfinished' },
  { value: 'SFoyer', label: 'Split Foyer' },
  { value: 'SLvl', label: 'Split Level' }
];

const centralAirOptions = [
  { value: 'N', label: 'No' },
  { value: 'Y', label: 'Yes' }
];

const electricalOptions = [
  { value: 'SBrkr', label: 'Standard Circuit Breakers & Romex' },
  { value: 'FuseA', label: 'Fuse Box over 60 AMP and all Romex wiring' },
  { value: 'FuseF', label: 'Fuse Box over 60 AMP and mostly Romex wiring' },
  { value: 'FuseP', label: '60 AMP Fuse Box and mostly knob & tube wiring' },
  { value: 'Mix', label: 'Mixed' }
];

const fireplaceQuOptions = [
  { value: 'Ex', label: 'Excellent' },
  { value: 'Gd', label: 'Good' },
  { value: 'TA', label: 'Average/Typical' },
  { value: 'Fa', label: 'Fair' },
  { value: 'Po', label: 'Poor' },
  { value: 'NA', label: 'No Fireplace' }
];

const garageTypeOptions = [
  { value: '2Types', label: 'More than one type of garage' },
  { value: 'Attchd', label: 'Attached to home' },
  { value: 'Basment', label: 'Basement Garage' },
  { value: 'BuiltIn', label: 'Built-In (Garage part of house - typically has room above garage)' },
  { value: 'CarPort', label: 'Car Port' },
  { value: 'Detchd', label: 'Detached from home' },
  { value: 'NA', label: 'No Garage' }
];

const garageFinishOptions = [
  { value: 'Fin', label: 'Finished' },
  { value: 'RFn', label: 'Rough Finished' },
  { value: 'Unf', label: 'Unfinished' },
  { value: 'NA', label: 'No Garage' }
];

const poolQCOptions = [
  { value: 'Ex', label: 'Excellent' },
  { value: 'Gd', label: 'Good' },
  { value: 'TA', label: 'Average/Typical' },
  { value: 'Fa', label: 'Fair' },
  { value: 'NA', label: 'No Pool' }
];

// First, move the styled component definition to the top
const StyledPaper = styled(Paper)({
  padding: '24px',
  marginTop: '24px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
});

function PredictionForm() {
  const [error, setError] = useState(null);
  const { loading, result, predictPrice } = usePrediction();

  // State declarations
  const [formData, setFormData] = useState({
    // Target variable (will be predicted)
    SalePrice: '',
    
    // All input fields matching the dataset description
    MSSubClass: '',
    MSZoning: '',
    LotFrontage: '',
    LotArea: '',
    Street: '',
    Alley: '',
    LotShape: '',
    LandContour: '',
    Utilities: '',
    LotConfig: '',
    LandSlope: '',
    Neighborhood: '',
    Condition1: '',
    Condition2: '',
    BldgType: '',
    HouseStyle: '',
    OverallQual: '',
    OverallCond: '',
    YearBuilt: '',
    YearRemodAdd: '',
    RoofStyle: '',
    RoofMatl: '',
    Exterior1st: '',
    Exterior2nd: '',
    MasVnrType: '',
    MasVnrArea: '',
    ExterQual: '',
    ExterCond: '',
    Foundation: '',
    BsmtQual: '',
    BsmtCond: '',
    BsmtExposure: '',
    BsmtFinType1: '',
    BsmtFinSF1: '',
    BsmtFinType2: '',
    BsmtFinSF2: '',
    BsmtUnfSF: '',
    TotalBsmtSF: '',
    Heating: '',
    HeatingQC: '',
    CentralAir: '',
    Electrical: '',
    '1stFlrSF': '',  // Using string key for numeric start
    '2ndFlrSF': '',  // Using string key for numeric start
    LowQualFinSF: '',
    GrLivArea: '',
    BsmtFullBath: '',
    BsmtHalfBath: '',
    FullBath: '',
    HalfBath: '',
    Bedroom: '',      // Changed from BedroomAbvGr to match dataset
    Kitchen: '',      // Changed from KitchenAbvGr to match dataset
    KitchenQual: '',
    TotRmsAbvGrd: '',
    Functional: '',
    Fireplaces: '',
    FireplaceQu: '',
    GarageType: '',
    GarageYrBlt: '',
    GarageFinish: '',
    GarageCars: '',
    GarageArea: '',
    GarageQual: '',
    GarageCond: '',
    PavedDrive: '',
    WoodDeckSF: '',
    OpenPorchSF: '',
    EnclosedPorch: '',
    '3SsnPorch': '',  // Using string key for numeric start
    ScreenPorch: '',
    PoolArea: '',
    PoolQC: '',
    Fence: '',
    MiscFeature: '',
    MiscVal: '',
    MoSold: '',
    YrSold: '',
    SaleType: '',
    SaleCondition: ''
  });

  const [trainData, setTrainData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [description, setDescription] = useState('');
  const [dataCounts, setDataCounts] = useState({
    training: 0,
    testing: 0,
    submission: 0
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Load CSV data when component mounts
  useEffect(() => {
    const loadCSV = (file) => {
      return new Promise((resolve) => {
        fetch(file)
          .then(response => response.text())
          .then(responseText => {
            const data = Papa.parse(responseText, { header: true });
            resolve(data.data);
          });
      });
    };

    const loadData = async () => {
      try {
        const train = await loadCSV('/data/train.csv');
        const test = await loadCSV('/data/test.csv');
        const submission = await loadCSV('/data/sample_submission.csv');
        
        setTrainData(train);
        setTestData(test);
        setSubmissionData(submission);
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      }
    };

    loadData();
  }, []);

  // Add this useEffect to load the data counts
  useEffect(() => {
    // Count the rows in each dataset
    if (trainData) setDataCounts(prev => ({ ...prev, training: trainData.length }));
    if (testData) setDataCounts(prev => ({ ...prev, testing: testData.length }));
    if (submissionData) setDataCounts(prev => ({ ...prev, submission: submissionData.length }));
  }, [trainData, testData, submissionData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await predictPrice(formData);
  };

  // Inside your component, add a function to handle description updates
  const updateDescription = (fieldName) => {
    const descriptions = {
      neighborhood: "Physical locations within Ames city limits",
      buildingType: "Type of dwelling",
      alley: "Type of alley access to property",
      lotShape: "General shape of property",
      landContour: "Flatness of the property"
    };
    setDescription(descriptions[fieldName] || '');
  };

  // Add this component to display data statistics
  const DataStatistics = () => (
    <Grid item xs={12}>
      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Dataset Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">
              Training Samples
            </Typography>
            <Typography variant="h6">
              {dataCounts.training}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">
              Testing Samples
            </Typography>
            <Typography variant="h6">
              {dataCounts.testing}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">
              Submission Samples
            </Typography>
            <Typography variant="h6">
              {dataCounts.submission}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );

  // Add this component to display field descriptions
  const FieldDescription = () => (
    <Grid item xs={12}>
      {description && (
        <Paper elevation={1} sx={{ p: 2, mt: 1, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="body2">
            {description}
          </Typography>
        </Paper>
      )}
    </Grid>
  );

  // Return your JSX
  return (
    <Container maxWidth="lg">
      <StyledPaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            {/* MSSubClass */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Building Class</InputLabel>
                <Select
                  name="MSSubClass"
                  value={formData.MSSubClass}
                  onChange={handleChange}
                  label="Building Class"
                >
                  {MSSubClassOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* MSZoning */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Zoning Classification</InputLabel>
                <Select
                  name="MSZoning"
                  value={formData.MSZoning}
                  onChange={handleChange}
                  label="Zoning Classification"
                >
                  {zoning.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Lot Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Lot Information</Divider>
            </Grid>

            {/* LotFrontage */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Lot Frontage (ft)"
                name="LotFrontage"
                type="number"
                value={formData.LotFrontage}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* LotArea */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Lot Area (sq ft)"
                name="LotArea"
                type="number"
                value={formData.LotArea}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Street */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Street Type</InputLabel>
                <Select
                  name="Street"
                  value={formData.Street}
                  onChange={handleChange}
                  label="Street Type"
                >
                  {streetOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Continue with more form fields... */}

            {/* Utilities */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Utilities</InputLabel>
                <Select
                  name="Utilities"
                  value={formData.Utilities}
                  onChange={handleChange}
                  label="Utilities"
                >
                  {utilitiesOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Lot Configuration */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Lot Configuration</InputLabel>
                <Select
                  name="LotConfig"
                  value={formData.LotConfig}
                  onChange={handleChange}
                  label="Lot Configuration"
                >
                  {lotConfigOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Land Slope */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Land Slope</InputLabel>
                <Select
                  name="LandSlope"
                  value={formData.LandSlope}
                  onChange={handleChange}
                  label="Land Slope"
                >
                  {landSlopeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Exterior Material */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Exterior Material</InputLabel>
                <Select
                  name="Exterior1st"
                  value={formData.Exterior1st}
                  onChange={handleChange}
                  label="Exterior Material"
                >
                  {exteriorOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Foundation */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Foundation</InputLabel>
                <Select
                  name="Foundation"
                  value={formData.Foundation}
                  onChange={handleChange}
                  label="Foundation"
                >
                  {foundationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Basement Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Basement Type</InputLabel>
                <Select
                  name="BsmtFinType1"
                  value={formData.BsmtFinType1}
                  onChange={handleChange}
                  label="Basement Type"
                >
                  {basementOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Heating System */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Heating System</InputLabel>
                <Select
                  name="Heating"
                  value={formData.Heating}
                  onChange={handleChange}
                  label="Heating System"
                >
                  {heatingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Garage Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Garage Type</InputLabel>
                <Select
                  name="GarageType"
                  value={formData.GarageType}
                  onChange={handleChange}
                  label="Garage Type"
                >
                  {garageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Roof Style */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Roof Style</InputLabel>
                <Select
                  name="RoofStyle"
                  value={formData.RoofStyle}
                  onChange={handleChange}
                  label="Roof Style"
                >
                  {roofStyleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Roof Material */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Roof Material</InputLabel>
                <Select
                  name="RoofMatl"
                  value={formData.RoofMatl}
                  onChange={handleChange}
                  label="Roof Material"
                >
                  {roofMatlOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fence */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Fence</InputLabel>
                <Select
                  name="Fence"
                  value={formData.Fence}
                  onChange={handleChange}
                  label="Fence"
                >
                  {fenceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Functional */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Functional</InputLabel>
                <Select
                  name="Functional"
                  value={formData.Functional}
                  onChange={handleChange}
                  label="Functional"
                >
                  {functionalOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sale Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sale Type</InputLabel>
                <Select
                  name="SaleType"
                  value={formData.SaleType}
                  onChange={handleChange}
                  label="Sale Type"
                >
                  {saleTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sale Condition */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sale Condition</InputLabel>
                <Select
                  name="SaleCondition"
                  value={formData.SaleCondition}
                  onChange={handleChange}
                  label="Sale Condition"
                >
                  {saleConditionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Main Living Space Section */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1} sx={{ mt: 3 }}>
                <HomeIcon color="primary" />
                <Typography variant="h6">
                  Main Living Space
                </Typography>
              </Box>
            </Grid>

            {/* Features and Amenities Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Features and Amenities</Divider>
            </Grid>

            {/* Numeric Inputs */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Area Measurements (sq ft)</Divider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Basement Area"
                name="TotalBsmtSF"
                type="number"
                value={formData.TotalBsmtSF}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="First Floor Area"
                name="1stFlrSF"
                type="number"
                value={formData['1stFlrSF']}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Second Floor Area"
                name="2ndFlrSF"
                type="number"
                value={formData['2ndFlrSF']}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Date Fields */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Construction Dates</Divider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Year Built"
                name="YearBuilt"
                type="number"
                value={formData.YearBuilt}
                onChange={handleChange}
                InputProps={{ 
                  inputProps: { 
                    min: 1800, 
                    max: new Date().getFullYear() 
                  } 
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Year Remodeled"
                name="YearRemodAdd"
                type="number"
                value={formData.YearRemodAdd}
                onChange={handleChange}
                InputProps={{ 
                  inputProps: { 
                    min: 1800, 
                    max: new Date().getFullYear() 
                  } 
                }}
              />
            </Grid>

            {/* Quality Ratings */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Quality Ratings</Divider>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Overall Quality</InputLabel>
                <Select
                  name="OverallQual"
                  value={formData.OverallQual}
                  onChange={handleChange}
                  label="Overall Quality"
                >
                  {qualityRatings.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Kitchen Quality</InputLabel>
                <Select
                  name="KitchenQual"
                  value={formData.KitchenQual}
                  onChange={handleChange}
                  label="Kitchen Quality"
                >
                  {qualityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Living Area Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Living Area Information</Divider>
            </Grid>

            {/* First Floor SF */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="First Floor SF"
                name="1stFlrSF"
                type="number"
                value={formData['1stFlrSF']}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Second Floor SF */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Second Floor SF"
                name="2ndFlrSF"
                type="number"
                value={formData['2ndFlrSF']}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Low Quality Finished SF */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Low Quality Finished SF"
                name="LowQualFinSF"
                type="number"
                value={formData.LowQualFinSF}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Bathrooms */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Bathrooms</Divider>
            </Grid>

            {/* Full Bath */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Full Bathrooms"
                name="FullBath"
                type="number"
                value={formData.FullBath}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Half Bath */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Half Bathrooms"
                name="HalfBath"
                type="number"
                value={formData.HalfBath}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Basement Full Bath */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Basement Full Bathrooms"
                name="BsmtFullBath"
                type="number"
                value={formData.BsmtFullBath}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Basement Half Bath */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Basement Half Bathrooms"
                name="BsmtHalfBath"
                type="number"
                value={formData.BsmtHalfBath}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Rooms and Functionality */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Rooms and Functionality</Divider>
            </Grid>

            {/* Bedroom */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bedrooms"
                name="Bedroom"
                type="number"
                value={formData.Bedroom}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Kitchen */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Kitchens"
                name="Kitchen"
                type="number"
                value={formData.Kitchen}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* TotRmsAbvGrd */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Rooms Above Grade"
                name="TotRmsAbvGrd"
                type="number"
                value={formData.TotRmsAbvGrd}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Functional */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Functionality</InputLabel>
                <Select
                  name="Functional"
                  value={formData.Functional}
                  onChange={handleChange}
                  label="Functionality"
                >
                  {functionalOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Garage Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Garage Information</Divider>
            </Grid>

            {/* GarageType */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Garage Type</InputLabel>
                <Select
                  name="GarageType"
                  value={formData.GarageType}
                  onChange={handleChange}
                  label="Garage Type"
                >
                  {garageTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* GarageYrBlt */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Garage Year Built"
                name="GarageYrBlt"
                type="number"
                value={formData.GarageYrBlt}
                onChange={handleChange}
                InputProps={{ 
                  inputProps: { 
                    min: 1900, 
                    max: new Date().getFullYear() 
                  } 
                }}
              />
            </Grid>

            {/* GarageFinish */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Garage Finish</InputLabel>
                <Select
                  name="GarageFinish"
                  value={formData.GarageFinish}
                  onChange={handleChange}
                  label="Garage Finish"
                >
                  {garageFinishOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* GarageCars */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Garage Car Capacity"
                name="GarageCars"
                type="number"
                value={formData.GarageCars}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0, max: 4 } }}
              />
            </Grid>

            {/* GarageArea */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Garage Area (sq ft)"
                name="GarageArea"
                type="number"
                value={formData.GarageArea}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Outdoor Features */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Outdoor Features</Divider>
            </Grid>

            {/* WoodDeckSF */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Wood Deck Area (sq ft)"
                name="WoodDeckSF"
                type="number"
                value={formData.WoodDeckSF}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* OpenPorchSF */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Open Porch Area (sq ft)"
                name="OpenPorchSF"
                type="number"
                value={formData.OpenPorchSF}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* EnclosedPorch */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Enclosed Porch Area (sq ft)"
                name="EnclosedPorch"
                type="number"
                value={formData.EnclosedPorch}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* 3SsnPorch */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Three Season Porch Area (sq ft)"
                name="3SsnPorch"
                type="number"
                value={formData['3SsnPorch']}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Pool and Fence */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Pool and Fence</Divider>
            </Grid>

            {/* PoolArea */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pool Area (sq ft)"
                name="PoolArea"
                type="number"
                value={formData.PoolArea}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* PoolQC */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pool Quality</InputLabel>
                <Select
                  name="PoolQC"
                  value={formData.PoolQC}
                  onChange={handleChange}
                  label="Pool Quality"
                >
                  {poolQCOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sale Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Sale Information</Divider>
            </Grid>

            {/* MoSold */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Month Sold"
                name="MoSold"
                type="number"
                value={formData.MoSold}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1, max: 12 } }}
              />
            </Grid>

            {/* YrSold */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Year Sold"
                name="YrSold"
                type="number"
                value={formData.YrSold}
                onChange={handleChange}
                InputProps={{ 
                  inputProps: { 
                    min: 1900, 
                    max: new Date().getFullYear() 
                  } 
                }}
              />
            </Grid>

            {/* MiscVal */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Miscellaneous Value ($)"
                name="MiscVal"
                type="number"
                value={formData.MiscVal}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* SaleType */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sale Type</InputLabel>
                <Select
                  name="SaleType"
                  value={formData.SaleType}
                  onChange={handleChange}
                  label="Sale Type"
                >
                  {saleTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* SaleCondition */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sale Condition</InputLabel>
                <Select
                  name="SaleCondition"
                  value={formData.SaleCondition}
                  onChange={handleChange}
                  label="Sale Condition"
                >
                  {saleConditionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* House Style */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>House Style</InputLabel>
                <Select
                  name="HouseStyle"
                  value={formData.HouseStyle}
                  onChange={handleChange}
                  label="House Style"
                >
                  {houseStyleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Condition */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  name="Condition1"
                  value={formData.Condition1}
                  onChange={handleChange}
                  label="Condition"
                >
                  {conditionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Central Air */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Central Air</InputLabel>
                <Select
                  name="CentralAir"
                  value={formData.CentralAir}
                  onChange={handleChange}
                  label="Central Air"
                >
                  {centralAirOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Electrical System */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Electrical System</InputLabel>
                <Select
                  name="Electrical"
                  value={formData.Electrical}
                  onChange={handleChange}
                  label="Electrical System"
                >
                  {electricalOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fireplace Quality */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Fireplace Quality</InputLabel>
                <Select
                  name="FireplaceQu"
                  value={formData.FireplaceQu}
                  onChange={handleChange}
                  label="Fireplace Quality"
                >
                  {fireplaceQuOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Quality Scale Slider */}
            <Grid item xs={12}>
              <Typography gutterBottom>Overall Quality Scale</Typography>
              <Slider
                name="OverallQual"
                value={Number(formData.OverallQual) || 5}
                onChange={handleChange}
                min={1}
                max={10}
                step={1}
                marks={qualityScale}
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Add the description display */}
            <FieldDescription />

            {/* Add the data statistics */}
            <DataStatistics />

            {/* Use HomeIcon in a meaningful way */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <HomeIcon color="primary" />
                <Typography variant="h6">
                  House Details
                </Typography>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s'
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Get Price Prediction"}
              </Button>
            </Grid>

            {/* Error Alert */}
            {error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              </Grid>
            )}

            {/* Results Display */}
            {result && (
              <Grid item xs={12}>
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Estimated Price
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      ${result.predictedPrice.toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </StyledPaper>
    </Container>
  );
}

export default PredictionForm;
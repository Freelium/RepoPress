import React, { useState } from 'react';
import { Drawer, Box, Button, Grid, Card, CardContent, Typography, Chip, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import templatesData from './templates.json';


const getDistinctLabels = (templates) => {
  const labels = new Set();
  Object.values(templates).forEach(template => {
    template.labels.forEach(label => labels.add(label));
  });
  return Array.from(labels);
};

const getRequired = () => {
  let allRequired = []
  Object.entries(templatesData).filter(([key, template]) => {
    if (template.required) {
      allRequired.push({ key, ...template });
    }
  });
  return allRequired;
}

const TemplateDashboard = () => {
  const navigate = useNavigate();
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState(getRequired());
  const labels = getDistinctLabels(templatesData);

  const handleLabelChange = (label) => {
    setSelectedLabels(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleTemplateSelect = (templateKey) => {
    const template = templatesData[templateKey];
    console.log('Template', templateKey, template);
    setSelectedTemplates(prev => 
      prev.find(t => t.key === templateKey) ? prev : [...prev, { key: templateKey, ...template }]
    );
    console.log('Selected Templates', selectedTemplates);
  };

  const handleTemplateDeselect = (key) => {
    setSelectedTemplates(prevTemplates => 
      prevTemplates.filter(template => template.key !== key)
    );
  };

  const handleSubmit = () => {
    console.log('Selected Templates', selectedTemplates);
    navigate('/templates-review', { state: { selectedTemplates } });
  };

  const filteredTemplates = Object.entries(templatesData).filter(([key, template]) => 
    selectedLabels.length === 0 || template.labels.some(label => selectedLabels.includes(label))
  );

  return (
    <Box sx={{ display: 'flex', height: '90vh', overflow: 'auto' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            position: 'static',
          },
        }}
      >
        {labels.map((label) => (
          <FormControlLabel
            control={<Checkbox checked={selectedLabels.includes(label)} onChange={() => handleLabelChange(label)} />}
            label={label}
            key={label}
          />
        ))}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ height: '65%', overflow: 'auto' }}>
          <Grid container spacing={2}>
            {filteredTemplates
              .filter(template => !!!template.required)
              .map(([key, template]) => (
                <Grid item key={key} xs={12} sm={6} md={4} lg={3}>
                  <Card onClick={() => handleTemplateSelect(key)} sx={{ cursor: 'pointer' }}>
                    <CardContent sx={{ bgcolor: !!template.required ? 'lightpink' : 'default' }}>
                      <Typography variant="h6">{key}</Typography>
                      <Typography variant="body2">{template.description}</Typography>
                      <Box sx={{ mt: 1 }}>
                        {template.labels.map(label => (
                          <Chip label={label} size="small" key={label} sx={{ mr: 0.5 }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            }
          </Grid>
        </Box>
        <Box sx={{ height: '10%', bgcolor: '#f0f0f0', p: 2, overflow: 'auto' }}>
          <Typography variant="h6">Selected Templates:</Typography>
          {selectedTemplates.map((template) => (
            <Chip
              label={template.key}
              key={template.key}
              onDelete={!!template.required ? undefined : () => handleTemplateDeselect(template.key)}
              // deleteIcon={ <CloseIcon /> : null}
              sx={{
                mr: 0.5,
                mb: 0.5,
                bgcolor: !!template.required ? 'lightpink' : 'default',
              }}
            />
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            Review and Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TemplateDashboard;

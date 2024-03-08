import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';

const TemplatesReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(location.state?.selectedTemplates[0].key);
  const [selectedTemplates] = useState(location.state?.selectedTemplates);

  const uiSchema = {
    "ui:submitButtonOptions": {
      "submitText": "Save changes",
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleTemplateSelect = (key) => {
    setSelectedTemplateKey(key);
  };

  const handleCreateRepo = () => {
    console.log('Creating repo with the following templates:', JSON.stringify(selectedTemplates));
  };

  const selectedTemplate = selectedTemplates.find(t => t.key === selectedTemplateKey);

  return (
    <Box sx={{ display: 'flex', height: '100vh', p: 3 }}>
      <Box sx={{ width: '30%', mr: 2 }}>
          <Button
            variant="contained"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateRepo}
          >
            Create Repo
          </Button>
        <Typography variant="h6">Selected Templates</Typography>
        <List>
          {selectedTemplates.map((template) => (
            <ListItem disablePadding key={template.key}>
              <ListItemButton onClick={() => handleTemplateSelect(template.key)}>
                <ListItemText primary={template.description} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '70%', overflow: 'auto' }}>
        {selectedTemplate && (
          <Box key={selectedTemplate.key} sx={{ mb: 4 }}>
            <Typography variant="h6">{selectedTemplate.description}</Typography>
            <Form
              schema={selectedTemplate.requirements}
              validator={validator}
              uiSchema={uiSchema}
              formData={selectedTemplate.formData}
              onSubmit={({ formData }) => selectedTemplate.formData = formData}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TemplatesReview;

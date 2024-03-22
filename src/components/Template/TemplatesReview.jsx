import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import TemplateSubmit from './TemplateSubmit';

const TemplatesReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(location.state?.selectedTemplates[0].key);
  const [selectedTemplates, setSelectedTemplates] = useState(location.state?.selectedTemplates);
  const [outputPath, setOutputPath] = useState('');

  const getUISchema = (template) => {
    let uiSchema = {
      "ui:submitButtonOptions": {
        "norender": true,
      }
    }

    if (!template.required) {
      uiSchema = {
        ...uiSchema,
        "repository_name": {
          "ui:widget": "hidden"
        }
      }
    }

    return uiSchema;
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleTemplateSelect = (key) => {
    setSelectedTemplateKey(key);
  };

  const updateTemplateFormData = (template, formData) => {
    if (template.key == 'repo') {
      propagateShared(template);
    }
    const updatedTemplates = selectedTemplates.map(temp => {
      if (temp.key === template.key) {
        return { ...temp, formData };
      }
      return temp;
    });
    setSelectedTemplates(updatedTemplates);
  };

  const propagateShared = (template) => {
    setOutputPath(template.formData?.repository_name);
    const updatedTemplates = selectedTemplates.map(temp => {
      if (!!template.formData) {
        let formData = temp.formData || {};
        formData.repository_name = template.formData.repository_name;
        temp.formData = formData;
      }
    });
    setSelectedTemplates(updatedTemplates);
  }

  const handleCreateRepo = () => {
    console.log('Creating repo with the following templates:', JSON.stringify(selectedTemplates));
    const context = {
      selectedTemplates,
      
    }
    new TemplateSubmit(outputPath, selectedTemplates).submit();
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
              schema={selectedTemplate.schema}
              validator={validator}
              liveValidate={true}
              uiSchema={getUISchema(selectedTemplate)}
              formData={selectedTemplate.formData}
              onChange={({ formData }) => updateTemplateFormData(selectedTemplate, formData)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TemplatesReview;

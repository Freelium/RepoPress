import React, { useState } from 'react';
import { Drawer, Box, Button, Grid, Card, CardContent, Typography, Chip, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Simulated data
const templatesData = {
  "microservice": {
    "description": "Microservice Template",
    "requirements": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Microservice",
      "type": "object",
      "properties": {
        "preset": {
            "type": "string",
            "enum": ["java8", "java11", "java17", "quarkus", "spring boot", "jetty"],
            "description": "The preset to use for the microservice. Valid values are: java8, java11, java17, quarkus, spring boot, jetty"
        }
      },
      "required": ["preset"]
    },
    "labels": ["microservice", "java"]
  },
  "aws-lambda": {
    "description": "AWS Lambda Function Template",
    "requirements": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "AWS Lambda Function",
      "type": "object",
      "properties": {
        "runtime": {
            "type": "string",
            "enum": ["java", "python", "nodejs", "dotnet", "go", "ruby", "custom"],
            "description": "The runtime environment to use for the Lambda function. Valid values are: java, python, nodejs, dotnet, go, ruby, custom"
        }
      },
      "required": ["runtime"]
    },
    "labels": ["aws", "lambda"]
  },
  "java-build": {
    "description": "Java Build Template",
    "requirements": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Java Build",
      "type": "object",
      "properties": {
        "build-tool": {
            "type": "string",
            "enum": ["maven", "gradle"],
            "description": "The build tool to use"
        }
      },
      "required": ["build-tool"]
    },
    "labels": ["java", "build"]
  },
  "gha-repo-admin": {
    "description": "GitHub Repository Administration Template",
    "requirements": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Repo administration",
      "type": "object",
      "properties": {
        "isAction": {
          "type": "boolean",
          "description": "Will this repo contain a github action that may be used in external workflows?"
        },
        "access": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "team": {
                "type": "string",
                "enum": ["team1", "team2", "team3"],
                "description": "The team's github slug"
              },
              "grant": {
                "type": "string",
                "enum": ["read", "write", "admin"],
                "description": "The level of access to grant to the team"
              }
            },
            "required": ["team", "grant"]
          },
          "description": "The teams and their access levels to the repository"
        }
      },
      "required": ["isAction", "access"]
    },
    "labels": ["admin", "gha"]
  },
  "gha-cicd-workflow": {
    "description": "GitHub Action CI/CD Workflow Template",
    "requirements": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "GHA Workflows",
      "type": "object",
      "properties": {
        "workflows": {
          "type": "array",
          "title": "Choose workflows",
          "description": "Select the prebaked workflows that will be used in this repository",
          "items": {
            "type": "string",
            "enum": ["ci", "version management", "wip", "release"]
          },
          "uniqueItems": true,
          "minItems": 1
        }
      },
      "required": ["workflows"]
    },
    "labels": ["cicd", "gha"]
  }
};

const getDistinctLabels = (templates) => {
  const labels = new Set();
  Object.values(templates).forEach(template => {
    template.labels.forEach(label => labels.add(label));
  });
  return Array.from(labels);
};

const TemplateDashboard = () => {
  const navigate = useNavigate();
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);

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

  const handleTemplateDeselect = (temp) => {
    setSelectedTemplates(prevTemplates => 
      prevTemplates.filter(template => template.key !== temp.key)
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
            {filteredTemplates.map(([key, template]) => (
              <Grid item key={key} xs={12} sm={6} md={4} lg={3}>
                <Card onClick={() => handleTemplateSelect(key)} sx={{ cursor: 'pointer' }}>
                  <CardContent>
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
            ))}
          </Grid>
        </Box>
        <Box sx={{ height: '10%', bgcolor: '#f0f0f0', p: 2, overflow: 'auto' }}>
          <Typography variant="h6">Selected Templates:</Typography>
          {selectedTemplates.map((template) => (
            <Chip
              label={template.key}
              key={template.key}
              onDelete={() => handleTemplateDeselect(template)}
              deleteIcon={<CloseIcon />}
              sx={{ mr: 0.5, mb: 0.5 }}
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
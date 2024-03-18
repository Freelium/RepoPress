// {
//     "template_payloads": [
//         {
//             "name": "gha",
//             "template_context": "https://github.com/Freelium/RepoPress",
//             "template_path": "templates/gha",
//             "ccplus": {
//                 "ci_runner": "ubuntu-22.04",
//                 "component_name": "huh"
//             }
//         },
//     ],
//     "output_path": "mawp",
//     "no_input": true
//   }

import axios from 'axios';
import constants from './constants.json';

class TemplateSubmit {
  constructor(context) {
    this.payload = this.prepPayload(context);
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  prepPayload(context) {
    return {
      template_payloads: context.selectedTemplates.map(template => {
        return {
          name: template.key,
          template_context: constants.template_context,
          template_path: constants.template_path_base + template.key,
          ccplus: template.formData
        };
      }),
      output_path: context.outputPath,
      no_input: constants.no_input
    };
  }

  async submit() {
    try {
      const response = await this.axiosInstance.post('/generate', this.payload);
      return response.data;
    } catch (error) {
      console.error('Error making POST request:', error);
      throw error;
    }
  }
}

export default TemplateSubmit;

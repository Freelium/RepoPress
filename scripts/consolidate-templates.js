const fs = require('fs');
const path = require('path');
const templatesRootDir = path.join(__dirname, '..', 'templates');
const outputFile = path.join(__dirname, '..', 'src', 'components', 'Template', 'templates.json');

const readJsonFile = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading JSON file at ${filePath}:`, err);
    return {};
  }
};

const consolidateJson = (rootDir) => {
  const result = {};

  const subdirectories = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  subdirectories.forEach((subdir) => {
    const ccplusFilePath = path.join(rootDir, subdir, 'ccplus.json');

    if (fs.existsSync(ccplusFilePath)) {
      const jsonData = readJsonFile(ccplusFilePath);
      result[subdir] = jsonData;
    } else {
      console.log(`ccplus.json not found in ${subdir}, skipping...`);
    }
  });

  return result;
};

const writeConsolidatedJson = (data, outputPath) => {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log('JSON consolidation complete. Output:', outputPath);
};

const consolidatedData = consolidateJson(templatesRootDir);
writeConsolidatedJson(consolidatedData, outputFile);

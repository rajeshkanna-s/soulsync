const fs = require('fs');
const https = require('https');
const path = require('path');

const URL = 'https://raw.githubusercontent.com/nshntarora/Indian-Cities-JSON/master/cities.json';
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'indianCities.ts');

https.get(URL, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      // Map and sort names
      const cityNames = parsed.map(c => c.name.trim()).filter(name => !!name);
      // Remove duplicates
      const uniqueCities = Array.from(new Set(cityNames)).sort();
      
      console.log(`Fetched ${uniqueCities.length} unique cities.`);
      
      const fileContent = `// 1200+ Indian Cities database fetched from GitHub
export const indianCities: string[] = ${JSON.stringify(uniqueCities, null, 2)};
`;
      
      fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
      console.log(`Saved to ${OUTPUT_FILE}`);
    } catch (err) {
      console.error('Failed to parse cities JSON:', err);
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err);
});

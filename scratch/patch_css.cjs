const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'styles', 'App.css');
let content = fs.readFileSync(filePath, 'utf8');

const additionalStyles = `
/* Responsive Form Grids & Mobile Layouts */
.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 576px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .form-grid-3 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .result-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }
  .result-header-card {
    padding: 24px 16px !important;
  }
  .result-subcard {
    padding: 24px 16px !important;
  }
  .comp-dims-list {
    gap: 20px !important;
  }
}
`;

const normalizedContent = content.replace(/\r\n/g, '\n');
if (!normalizedContent.includes('/* Responsive Form Grids & Mobile Layouts */')) {
  const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
  content = content.trim() + lineEnding + additionalStyles.replace(/\n/g, lineEnding);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully appended styles to App.css');
} else {
  console.log('Styles already exist in App.css');
}

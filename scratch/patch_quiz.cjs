const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'views', 'Quiz.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `  const handleSelectRating = (rating: number) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: rating
    };
    setAnswers(updatedAnswers);

    // Auto-advance after 400ms
    if (currentIdx < questions.length - 1) {
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 400);
    }
  };`;

const replacementStr = `  const handleSelectRating = (rating: number) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: rating
    };
    setAnswers(updatedAnswers);

    if (currentIdx < questions.length - 1) {
      // Auto-advance to next question
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 200);
    } else {
      // Final question: auto-submit quiz results after selection
      setTimeout(() => {
        const finalCountry = selectedCountry === "Other" ? customCountry.trim() : selectedCountry;
        const finalBornCity = (selectedCountry === "Other" || selectedBornCity === "Other") ? customBornCity.trim() : selectedBornCity;
        const finalLivingCity = (selectedCountry === "Other" || selectedLivingCity === "Other") ? customLivingCity.trim() : selectedLivingCity;

        const finalDemographics: UserDemographics = {
          name: name.trim(),
          age,
          gender: gender as "male" | "female",
          bornCity: finalBornCity,
          livingCity: finalLivingCity,
          knownLanguages: knownLanguages.trim(),
          education,
          country: finalCountry,
          siblings,
          languagesStudied: languagesStudied.trim(),
          parentsEducated,
          wealthStatus,
          loveFailure: age >= 16 ? loveFailure : "not_applicable",
          disability: hasDisability && disabilityDetail.trim() ? disabilityDetail.trim() : "none"
        };
        onComplete(updatedAnswers, finalDemographics);
      }, 200);
    }
  };`;

// Replace target irrespective of line endings CRLF / LF
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = targetStr.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
  // Preserve original line endings by matching what file uses
  const usesCrlf = content.includes('\r\n');
  const finalReplacement = replacementStr.replace(/\n/g, usesCrlf ? '\r\n' : '\n');
  const finalTarget = targetStr.replace(/\n/g, usesCrlf ? '\r\n' : '\n');
  
  content = content.replace(finalTarget, finalReplacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched Quiz.tsx');
} else {
  console.error('Error: Could not find target handleSelectRating code in Quiz.tsx');
  process.exit(1);
}

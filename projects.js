/* =====================================================================
   PROJECTS DATA  -  THIS IS THE FILE YOU EDIT TO ADD NEW PROJECTS
   =====================================================================
   HOW TO ADD A NEW PROJECT:
   1. Copy one whole project block (from the opening { to the closing },).
   2. Paste it below the last project, inside the [ ] brackets.
   3. Change the text. Put your screenshots in assets/images/projects/
      and write the file names under "screenshots".
   4. Save the file and refresh the website.

   GITHUB BUTTON:
   - Leave   github: ""   (empty) and the button stays HIDDEN.
   - When your project is on GitHub, paste the link between the quotes,
     for example:  github: "https://github.com/dhurga1211/ai-job-market-dashboard"
   ===================================================================== */

const projects = [
  {
    title: "AI Job Market Analysis Dashboard",
    description:
      "A 2-page interactive Power BI dashboard that analyses AI job market vacancies, job roles, company sizes and other job-market information.",
    tools: ["Microsoft Power BI"],
    dataset: "AI Job Market Dataset.csv (downloaded from Kaggle)",

    // Numbers shown on the dashboard's KPI cards
    kpis: [
      { value: "10,345", label: "Total Jobs" },
      { value: "6", label: "Industries" },
      { value: "7", label: "Countries" },
      { value: "4K", label: "Remote Jobs" },
      { value: "5K", label: "Python Jobs" }
    ],

    objectives: [
      "Analyse AI job openings by country, industry and job title",
      "Compare jobs by company size, experience level and remote type",
      "Track the trend of AI job postings over the years",
      "Present the job-market information visually in one dashboard"
    ],

    features: [
      "Data cleaning performed",
      "2 dashboard pages with arrow-button navigation",
      "5 KPI cards",
      "7 charts: bar, donut, treemap, line, column and pie charts"
    ],

    insights: [
      "Business Analyst has the highest openings (1,773), followed by Data Analyst (1,711).",
      "Entry Level has the highest openings by experience level (3,513).",
      "Remote (33.96%), Hybrid (33.06%) and Onsite (32.98%) are almost equally distributed.",
      "Job postings peaked in 2024 (1,502).",
      "Technology has the highest openings by industry (1,787).",
      "Germany has the highest number of job openings (approximately 1.5K)."
    ],

    screenshots: [
      { src: "assets/images/projects/ai-job-market-page-1.png", caption: "Dashboard Page 1: KPI cards, jobs by industry, remote type and country" },
      { src: "assets/images/projects/ai-job-market-page-2.png", caption: "Dashboard Page 2: posting trend, experience level, company size and job title" }
    ],

    github: ""   // Empty = button hidden. Add your GitHub project link here later.
  }

  // ---- Paste your next project block here (add a comma after the block above) ----
];

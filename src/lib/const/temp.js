export const MOCK_RESUME_DATA = {
  basicDetails: {
    fields: {
      email: "amlanroy2500@gmail.com",
      name: "Amlan Roy",
      phone: "+919158769412",
      location: "NAGPUR",
    },
    type: "BASIC_DETAILS",
    sectionTitle: "Basic Details",
  },
  optionalSections: [
    {
      sectionTitle: "Professional Summary",
      fields: {
        value: "asd",
      },
      type: "PROFESSIONAL_SUMMARY",
    },
    {
      fields: [
        {
          companyName: "Raja Software Labs",
          duration: {},
          jobTitle: "asdasd",
          details: "asdasd",
        },
      ],
      sectionTitle: "Work Experience",
      type: "WORK_EXPERIENCE",
    },
    {
      fields: [
        {
          projectTitle: "asd",
          duration: {},
        },
      ],
      sectionTitle: "Relevant Projects",
      type: "PROJECTS",
    },
    {
      fields: [
        {
          skills: "asdad",
        },
      ],
      sectionTitle: "Technical Skills",
      type: "SKILLS",
    },
    {
      sectionTitle: "Education",
      fields: [
        {
          duration: {},
          universityName: "asdasd",
          degreeName: "asdad",
        },
      ],
      type: "EDUCATION",
    },
    {
      type: "ADDITIONAL",
      fields: {
        value: "asdads",
      },
      sectionTitle: "Additional Information",
    },
  ],
};

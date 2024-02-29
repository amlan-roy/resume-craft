# Resume Craft 📃

A simple web app that automates the process of creating custom resume versions for different jobs using the job description.

This app uses Next.js 14 for frontend, Next js api routes for backend, Firebase auth for authentication, Firestore for database, Firebase Cloud Functions and Firestore Cloud Functions with pdfkit for Resume Generation, and firebase storage for storage.

This project has ShadCN UI library, Tailwind CSS, React hook forms and zod as some of the main dependencies. The project has been deployed on Vercel

![Next.js](https://img.shields.io/badge/-NextJS-05122A?style=flat&logo=next.js) ![Typescript](https://img.shields.io/badge/-TypeScript-05122A?style=flat&logo=typescript) ![JavaScript](https://img.shields.io/badge/-JavaScript-05122A?style=flat&logo=javascript) ![React Hook Form](https://img.shields.io/badge/-React_Hook_Form-05122A?style=flat&logo=reacthookform&logoColor=white) ![Firebase](https://img.shields.io/badge/-Firebase-05122A?style=flat&logo=firebase) ![pdfkit](https://img.shields.io/badge/-pdfkit-05122A?style=flat&logo=pdfkit)&nbsp;

## Getting Started

### Prerequisites

**System Requirements:**

- Node.js 18.17 or later.
- macOS, Windows (including WSL), and Linux are supported.

### Running the repo locally

- Fork the repository and clone the repository into your local machine
- You can now run this project locally by using the following commands🎉

```bash
npm install
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running the tests

You can run the tests once by using the command `npm run test`
You can also run the tests in watch mode by using the following command `npm run test:watch`

You can test the functionality related to firebase by running the firebase emulator locally (refer [here](https://firebase.google.com/docs/emulator-suite))

### env variables

- You can refer the `.env.example` file for the environment variables.
- You will have to get the firebase environment variables from firebase by setting up a firebase project and following the steps mentioned there (refer [this](https://support.google.com/firebase/answer/7015592#zippy=%2Cin-this-article)).
- For NEXT_PUBLIC_SITE_URL, you can have `http://localhost:3000` for development and `//$NEXT_PUBLIC_VERCEL_URL` if you are deploying in vercel.
- COMMAND_1 contains the first command for generating the resumes. Kept it in environment variable so that I can change it without updating the code.
- NOTE: COMMAND_1 and FIREBASE_ADMIN_PRIVATE_KEY should be stored in the format `{"value":"<the value of the env variable here>"}`

## Contribution

- If you see an issue that you want to work on, please comment on that issue and once you have the confirmation from one of the maintainers, you can stat working on that issue.
  OR
- You can also create a new issue that you think should be worked on. Once that issue gets accepted by any of the maintainers of the project, then you can start working on that issue.

- Once you have an issue to work on, fork and clone the repository
- Create a branch and make the changes in your branch
- Push the changes and create a pull request for it.
- Make sure that you enter all the required information in the pull-request template
- Once your pull-request passes all the checks and have the required approvals, then your pull request can be merged with master.
- Make sure that existing tests pass after your changes.

Here's a [good short video](https://www.youtube.com/watch?v=8lGpZkjnkt4) describing this process

```bash
npm run dev

```

### Branches

- prod: The production branch
- master: This is the default and root branch of our project.
- Feature: Feature branches where all the changes are made. The PRs are made against the master branch from these feature branches. You should have good, short and descriptive names for your feature branches.

## ❤️ Found this project useful?

If you found this project useful, then please consider giving it a ⭐ on Github and sharing it with your friends via social media. It really motivate us to do more.

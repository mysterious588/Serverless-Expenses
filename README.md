# Serverless-Expenses
Track your expenses using a serverless application


### Features
- User authentication
- Create new expense with the name and price
- Each user is only allowed to browse his expenses
- Delete expense
- Attach an image to the expense

## Setup

You'll need to install the dependencies of the backend and the client:


### Backend

Install the npm packages and deploy to AWS

```cd backend```

```npm update --save```

```npm audit fix```

```sls deploy -v```


### Client

Install the npm packages and run the website locally

```cd client```

```npm update --save```

```npm audit fix --legacy-peer-deps```

```npm install --save-dev```

```npm run start```

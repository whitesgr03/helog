# HeLog

HeLog is a public blog built with React. Allows users to post and comment. Hosted on Vercel.

![website screenshots](https://i.imgur.com/U824qto.png)

## Links

- Live Demo: [https://helog.whitesgr03.me](https://helog.whitesgr03.me)
- Backend Repository: [https://github.com/whitesgr03/helog](https://github.com/whitesgr03/helog)

## Features:

- Google and Facebook social authentication.
- Post any content and images.
- Comment on any post.
- Responsive design for mobile devices.

## Usage:

You can access posts or comment messages on the [Live Demo](https://helog.whitesgr03.me) through your web browser.

<details>

- Login with Google and Facebook and the user needs to create a username when logging in for the first time.

  <img src="https://i.imgur.com/wbg9E6S.png" alt="login page"/>
  <img src="https://i.imgur.com/t71KYJN.png" alt="new user set username"/>

- Change your username any time.

   <img src="https://i.imgur.com/wsTuxzD.png" alt="setting modal"/>
   <img src="https://i.imgur.com/K8QkIVB.png" alt="change username modal"/>

- View the latest posts or all posts.

   <img src="https://i.imgur.com/FWEWSRL.png" alt="the latest posts">
   <img src="https://i.imgur.com/8z2Hwik.png" alt="all posts">

- Comment on a post or reply to another comment.

  <img src="https://i.imgur.com/gchHxcz.png" alt="comment on a post">
  <img src="https://i.imgur.com/lcprzPo.png" alt="reply to another comment">

- Update or delete your own comments.

  <img src="https://i.imgur.com/F0H9zE1.png" alt="update own comment">
  <img src="https://i.imgur.com/1vI0CpC.png" alt="delete own comment">

- View all of your posts.
  <img src="https://i.imgur.com/sQuAtCM.png" alt="dashboard">

- Create a new post using a template.
  <img src="https://i.imgur.com/yFl8rRG.png" alt="create a new post">

- Edit the specified post.
  <img src="https://i.imgur.com/QkDyQ8U.png" alt="update the specified post">

- Delete the specified post.  
  <img src="https://i.imgur.com/o4lqZ0i.png" alt="delete the specified post">

</details>

## Technologies:

1. [Tanstack Query(react query)](https://tanstack.com/query/latest) to data fetching, caching and updating server state. Instead of using React Effect to data fetching.

2. [React Context](https://react.dev/learn/passing-data-deeply-with-context) to sharing App component data deeply thought the tree and preventing rerender all components when the state of app component is changed.

3. [React Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) to extract the all the state logic of context and preventing rerender the event handles of context when state of context is changed.

4. [Typescript](https://www.typescriptlang.org/) used to save considerable amounts time in validating that project have not accidentally broken.

5. [React Router](https://reactrouter.com/) to keep the user interface in sync with the URL. In addition, it allows defining which component to display for a specified URL.

6. [Yup](https://github.com/jquense/yup) to validate any form's data and make sure that it matches the schemas that define how the data should look and the values expected to conform to them.

7. [tinyMCE](https://www.tiny.cloud/) used to view all posts created by users and create any content and images in the post.

## Additional info:

- This project consists of a backend for API and two different front-ends for accessing and editing blog posts.

- The backend's authentication is cookie-based to prevent the need to log in again when switching between two different front-ends.

## Source folder structure

```
src/
│
├─── assets/                            # Static assets (icons, images)
│
├─── components/                        # Each React component is placed in a folder with its associated CSS modules and tests
│     ├── layout/
│     │    ├── Footer/
│     │    │    └── Footer.tsx
│     │    │
│     │    └── Header/
│     │         ├── ChangNameModal.tsx
│     │         ├── DeleteModel.tsx
│     │         ├── Dropdown.tsx
│     │         ├── Header.tsx
│     │         └── Settings.tsx
│     ├── pages/
│     │    ├── Account/
│     │    │    └── Login.tsx
│     │    ├── App/
│     │    │    ├── Alert.tsx
│     │    │    ├── App.tsx
│     │    │    ├── CreateUsername.tsx
│     │    │    └── Modal.tsx
│     │    ├── Comment/
│     │    │    ├── CommentCreate.tsx
│     │    │    ├── CommentDelete.tsx
│     │    │    ├── CommentDetail.tsx
│     │    │    ├── Comments.tsx
│     │    │    └── CommentUpdate.tsx
│     │    ├── Home/
│     │    │    └── Home.tsx
│     │    ├── Post/
│     │    │    ├── PostDetail.tsx
│     │    │    ├── PostList.tsx
│     │    │    └── Posts.tsx
│     │    └── Reply/
│     │         ├── Replies.tsx
│     │         ├── ReplyCreate.tsx
│     │         ├── ReplyDelete.tsx
│     │         ├── ReplyDetail.tsx
│     │         └── ReplyUpdate.tsx
│     └── utils/
│          ├── Error/
│          │    ├── Error.tsx
│          │    └── NotFound.tsx
│          └── Loading.tsx
│
├─── styles/                            # Generic CSS Modules
│     ├── button.module.css
│     ├── form.module.css
│     ├── image.module.css
│     └── index.css                     # Index CSS include main custom properties and type selectors styles
│
├─── utils/                             # Generic function
│     ├── handleComment.ts              # Handle comment API
│     ├── handleFetch.ts
│     ├── handlePost.ts                 # Handle post API
│     ├── handleReply.ts                # Handle reply API
│     ├── handleUser.ts                 # Handle user info API
│     ├── queryOptions.ts               # Handle react query caching and fetching options
│     └── verifySchema.ts               # Handle yup package validation values
│
├─── E2E/                               # handle end-to-end testing
│
├─── main.tsx
└──  Router.tsx                         # React router config
```

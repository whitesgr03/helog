# HeLog

HeLog is a public blog built with React. Allows users to post and comment. Hosted on Vercel.

![website screenshots](https://i.imgur.com/U824qto.png)

## Links

- Live Demo: [https://helog.whitesgr03.me](https://helog.whitesgr03.me)
- Backend Repository: [https://github.com/whitesgr03/helog](https://github.com/whitesgr03/helog)

## Features:

- Google and Facebook social authentication.
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

</details>

## Technologies:

1. [React Router](https://reactrouter.com/) to keep the user interface in sync with the URL. In addition, it allows defining which component to display for a specified URL.

2. [Yup](https://github.com/jquense/yup) to validate any form's data and make sure that it matches the schemas that define how the data should look and the values expected to conform to them.

3. [tinyMCE](https://www.tiny.cloud/) used to view all posts created by users from HeLog-Editor.

## Additional info:

- This project consists of a backend for API and two different front-ends for accessing and editing blog posts.

- The backend's authentication is cookie-based to prevent the need to log in again when switching between two different front-ends.

## Source folder structure

```
src/
├─── __test__/                          # component and E2E tests
│
├─── assets/                            # Static assets (icons, images)
│
├─── components/                        # React components and each related css modules are placed in folders
│     ├── layout/                       
│     │    ├── Footer/                  
│     │    │    └── Footer.jsx  
│     │    └── Header/  
│     │         ├── ChangNameModal.jsx
│     │         ├── DeleteModel.jsx
│     │         ├── Dropdown.jsx
│     │         ├── Header.jsx
│     │         └── Settings.jsx
│     ├── pages/  
│     │    ├── Account/                 
│     │    │    └── Login.jsx  
│     │    ├── App/                     
│     │    │    ├── Alert.jsx
│     │    │    ├── App.jsx
│     │    │    ├── CreateUsername.jsx
│     │    │    └── Modal.jsx  
│     │    ├── Comment/                 
│     │    │    ├── CommentCreate.jsx
│     │    │    ├── CommentDelete.jsx
│     │    │    ├── CommentDetail.jsx
│     │    │    ├── Comments.jsx
│     │    │    └── CommentUpdate.jsx  
│     │    ├── Home/                    
│     │    │    └── Home.jsx  
│     │    ├── Post/                    
│     │    │    ├── PostDetail.jsx
│     │    │    ├── PostList.jsx
│     │    │    └── Posts.jsx  
│     │    └── Reply/
│     │         ├── Replies.jsx
│     │         ├── ReplyCreate.jsx
│     │         ├── ReplyDelete.jsx
│     │         ├── ReplyDetail.jsx
│     │         └── ReplyUpdate.jsx  
│     └── utils/  
│          ├── Error/
│          │    ├── Error.jsx    
│          │    └── NotFound.jsx  
│          └── Loading.jsx  
│
├─── styles/                            # Generic CSS Modules
│     ├── button.module.css
│     ├── form.module.css   
│     ├── image.module.css  
│     └── index.css                     # Index CSS include main custom properties and type selectors styles
│
├─── utils/                             # Generic function
│     ├── handleComment.js              # Handle comment API
│     ├── handleFetch.js   
│     ├── handlePost.js                 # Handle post API
│     ├── handleReply.js                # Handle reply API
│     ├── handleUser.js                 # Handle user info API
│     └── verifySchema.js               # Handle yup package validation values. 
│
├─── main.jsx 
└──  Router.jsx                         # React router config
```
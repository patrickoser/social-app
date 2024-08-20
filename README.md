One step at a time. 1% better everyday!

Comment as you go. It will help with comprehension and be a good
reference for later.

Todo:
    Add an error message when a user provides an email/password 
    combo that doesnt match any existing account.

    Add loading screen when fetching data.

    Add a Profile component that sits above posts and create post
    form to distinguish it from Home. Contains pfp, username, bio,
    and maybe a header image.

    Pull in user specifc liked posts in a seperate tab on each users profile. Users 
    should be able to switch between tabs, gooing from profile specific posts and 
    likes.

    Add username field when user creates an account. Usernames should be unique to 
    each user.

    CRUD Operations
        A share button that allows users to share posts elsewhere.

        A tab that shows what posts each user has like on their 
        profile.

    Add a box to the home screen that displays the current users 
    information. Username, pfp, email.

    See if it makes sense to move all firebase auth checks to auth context.

    Need to check if the singup/login, and google sign up, 
    functionality works as intended.

    Have firebase check if the email used during sign up is
    already assigned to an account. Should check if user is 
    signing up with google or email/password. If the email is 
    already in use then it sends an error message back to the 
    user telling them they need to use a different email.

    Add a check to direct users straight to the home page if they 
    are already signed in to an account. Sign in and signup screen
    should not be available to users who are signed in.

    Use 'useMemo' in when interacting with firebase functions so 
    that they are not called everytime there is an 'onChnage' 
    event triggered. This counts as a 'read' and contributes to 
    billing.

    Figure out why reloading the page when on a specific PostPage 
    the page doesnt load properly.
    
    There should be no Header in the login/signup page.

    Look into setting up Tailwind to set some default colors
    and make it easier to reuse them throughout the project.

    Set up structure for Contact page.

Pages needed:
    Home feed
        Put Nav bar on left side and have it slide under the content for a mobile friendly version.

        No need to have a seperate page for post creation, it should be a popup window, or a box that expands at the top like Twitter.

    Profile page
        Your posts scroll across the screen like the Home feed but have a wheel effect where the posts become bigger and emphasized as they reach the center of the screen. As if you are turing a wheel

    Login and signup
        Can be the same style as the comparable login and signup pages. Looked clean and can easily tweak the color and style as I want.

        Make it possible for users to login/signup using their google account and maybe a couple others but at least google.

    Settings
        Doesn't have to be an extensive list, just a few features that make sense. Stuff like changing your display name.

    A page to display the individual posts you click on.
        Posts should have a like button, repost button, and section to add comments.

        To add comments to posts a drop down box will appear so that the user can add their comment. A whole new page is not needed. When the comment is add the page will scroll to the added comment.

Possible additional features:
    A way for users to message each other.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
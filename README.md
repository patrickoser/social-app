One step at a time. 1% better everyday!

Todo: 
    If you run into errors
        None of the protected routes are populating.

        Check placement of Protected component and AuthProvider.

        Check how Protected/AuthProvider are constructed.

    CRUD Operations
        Add ability to pull in all posts by users on home screen

        Users Profiles should display only posts made by that specific user.

        A like button that saves each users likes.

        A share button that allows users to share posts elsewhere.

        The ability to create posts.

        The ability to update posts.

        The ability to delete your own posts.

        A tab that shows what posts each user has like on their profile.

    Add a box to the home screen that displays the current users information.
    Username, pfp, email.

    Syntax Error when loading LoginSignupHub after adding console 
    log.

    See if it makes sense to move all firebase auth checks to auth context.

    Need to check if the singup/login, and google sign up, 
    functionality works as intended.

    Have firebase check if the email used during sign up is
    already assigned to an account. Should check if user is 
    signing up with google or email/password.

    I should add a username input field to the signup screen. It 
    will check firebase to see if that username is taken and if 
    not add it to that users object.

    Add a check to direct users straight to the home page if they 
    are already signed in to an account. Pobably something I can 
    do with local storage.

    If user is not already signed in then they should not be able
    to see anything but the login and signup screens.

    Use 'useMemo' in when interacting with firebase functions so 
    that they are not called everytime there is an 'onChnage' 
    event triggered. This counts as a 
    'read' and contributes to billing.

    Figure out why reloading the page when on a specific PostPage 
    the page doesnt load properly.

    Comment out everything to talk through how everything 
    works to help yourself remember how all the pieces come 
    together.
    
    There should be no Header in the login/signup page.

    Look into setting up Tailwind to set some default colors
    and make it easier to reuse them throughout the project.

    Remove uneeded imports from files.

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
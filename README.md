One step at a time. 1% better everyday!

Comment as you go. It will help with comprehension and be a good
reference for later.

Working on:
    When a user likes a post the like needs to grab the id of the post, as well as, the username/userId of the person liking it.

Currently:
    The user object doesn't pass properly to DataContext but is passed properly in Profile. This could be a problem with one context being unable to pass children to another context.

    All instances of 'firestore' in Profile was replaced with 'db' but 'db' pops as an error 
    for not being a function on page load.

    When userdata is pulled from firebase in Profile it grabs Everything associated with the usernames collection. When the users posts are being pulled/mapped in the Feed below they are not found. Posts are located in a seperate collection and there is no username/userId associating it with the user who created it. Add the username of the posts creator upon each posts creation. That way you can pull all the posts of one user at a time and populate their profile with only their posts.
    
    Same goes for likes but they have the userId already saved along side of it. Need to check if its the userId of the person who created the post or of the person who liked it. When populating each users likes I will need to map find all the posts they've liked and then pull in just those posts. So I will need a post id and the username/userId of the person who liked it. 

Errors:
    Routes not setup properly for Profile. 

    Likes dont seem to be logging properly after clicking away to a
    different page." 

    When signing into existing accounts it doesn't redirect to home
    screen properly. 

    Create post form isnt posting.

Todo:
    Talk out/write down every step need to add and pull data from the 
    backend that is associated with individual accounts.

    Each post on the feed and individual profiles should have the
    username of the account that posted them displayed properly.

    Need to dynamically generate the profile info of each specific 
    user when their username is clicked on. That means a feed of their 
    posts, likes, and their pfp, bio and other public image. Might need 
    to update routes to accomadate cumstom id routes, feed to display 
    the content of the id being referenced, and any other info apart 
    of their profile.

    Adjust routes so that each profile has an id associated with it 
    that will bring you to that specific persons profile. 

    Add default images and the ability to upload their own images. 
    Hide it behind a dropdown menu.

    'getImageUrl is defined in Nav and Profile. It should be defined
    and exported rom a context file so I dont repeat myself needlessly.

    Add an error message when a user provides an email/password 
    combo that doesnt match any existing account.

    Add loading screen when fetching data. Could implement this 
    using 'createBrowserRouter'.

    Pull in user specifc liked posts in a seperate tab on each 
    users profile. Users should be able to switch between tabs, 
    gooing from profile specific posts and likes.

    Add Nav bar to display in Contact page.

    When trying to sign into older/existing accounts I got an error
    that prevented me from signing in. Worth trying to replicate 
    and figure out why its happening.

    CRUD Operations
        A share button that allows users to share posts elsewhere. 

        A tab that shows what posts each user has like on their 
        profile.

    See if it makes sense to move all firebase auth checks to auth context. 

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
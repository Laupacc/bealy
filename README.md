
# Task Description:


[Hackernews](https://news.ycombinator.com/) is great but the homepage hurts my eyes.


    Make a simple hackernews homepage clone using React + Next.JS v14, NodeJs + Express.
    You must login to access your app
    Display stories from the hackernews API
    Edit your profile
    Save and view your favorite stories
    View other users and their favorite stories


    There is an included docker-compose file to run a simple boilerplate (on ports 4000, 4001, 4002)
    with Next, Node & MySQL to get you started but you can use your own.
    Just make sure that your build is reproducible !

    If you're having issues with localhost to access the API, you can use  http://BEALYBACK:8080/

    DO NOT use privileged ports (<1024 for example) or anything requiring sudo on the host

    For the scope of this exercice it is OK to store the .env in your repo or in the docker-compose file
    Use a .env.example file if you don't want to

    It is OK use AI tools to help you (Claude, ChatGPT, Copilot, V0)
    But please do NOT generate whole pages / huge blocks of code from AI and copy paste them.
    If you do and it's part of your workflow, you should be able to reproduce and debug the code yourself.

Please use
- Typescript
- [React + Next.JS > V14 APP router](https://nextjs.org/docs) (not page router !)
- [Shadcn UI components](https://ui.shadcn.com/) (optional)
- Tailwind (optional)
- NodeJS + Express
- Sequelize ORM
- any DB is fine
- [hackernews API](https://github.com/HackerNews/API) or https://hn.algolia.com/api



# Front end

    All pages must be responsive
    Any kind of animation is optional
    Try to use Tailwind media queries
    Try to validate form inputs whenever possible

## Create a "Login" Page

- Make a login page to register a user or login.
- Validate the data before sending it to the backend
- Redirect the user to the main page once registered / logged in

## Create a "Main" page

- Make a page displaying a list of stories
- The layout is up to you. You can use [Shadcn blocks](https://ui.shadcn.com/blocks) or your own. Just try to enhance the default layout from [hackernews](https://news.ycombinator.com/)
- You must be able to save stories into your "favorites" list
- Add as many features as you see fit (Search, Sort, Filter by category, etc.)
- When clicking on a story you can simply redirect to the story page or the hackernews commment page

## Create a "Favorite Stories" Page

- Make a page displaying the stories that the user has favorited

## Create a "User Profile" Page

    Make a page displaying the user information with the following fields:

    The user should be able to edit his profile and save modifications here.

- username
- email
- age
- password
- long text description
- a profile picture
- a toggle to hide/show the user profile publicly (show by default)


## Create a "See all users" page

    Make a page displaying all the users whose visibility is set to "show"
    
    Clicking on a user card should redirect to this user's "Favorites" page

- Display the user information with the following fields:
- username
- age
- profile picture
- text description


# Backend

    Please use nodeJS + express + sequelize ORM
    Any DB is fine (SQLite, MySQL, PostgreSQL, MongoDB, etc.)

    If you're having issues with localhost to access the API, you can
    use  http://BEALYBACK:8080/ instead of http://localhost:4001/ (see root page.tsx in the front end )


- Make a sequelize migration to generate any missing columns / tables
- Create a route to login
- Create a route to register
- Create a route to get the user info/settings
- Create a route to post the user info/settings
- Create a route to get the user's favorite stories
- Create a route to save a story into the user's favorites
- Create a route to delete a story from the user's favorites
- Create a route to get all the users whose visibility is set to "show"
- Create a route to get the favorite stories of a user whose visibility is set to "show"
- Use a middleware for authentication whenever applicable
- Validate the data received whenever possible
- Please output logs to the console (you can use [winston](https://github.com/winstonjs/winston) for example)
- Seed the database with dummy users (optional)

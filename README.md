# Final submission for CVWO by Siah Wee Keat, Evan

The forum was built using Create React App using Typescript and the server was coded in Golang with a PostgreSQL database.

Before starting up the server, a database has to be created and "goose postrges {database url} up" must be entered in the terminal.

Packages should be installed according to the package.json and go.mod files.

## Features of the app

To enter, please create an account and login using the username and password entered. 

The forum allows you to create posts and comments on your own or other people's posts. You are able to add a tag to your post to help with finding related posts. The posts can be filtered with the dropdown menu on the upper left of the navigation bar. 

You will only be able to edit and delete your posts and comments if they belonng to you and the edit and delete button should appear automatically. Otherwise, you should not see the buttons on other user's posts or comments. You can also choose to upvote a post and retract your upvote. The website uses an APIKey to authenticate the user and the APIKey is stored on the browser cookies.

Should a post be too long, it will be truncated but you are able to show the full body of the post by clicking on show more. 

Finally, you are able to delete your account which will remove all posts and comments created by the user. 





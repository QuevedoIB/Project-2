# E-split

## Description

E-split is an event generator app, where user can organize events, split the needed tasks for the event and communicate with the participants.
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault.
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup.
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend.
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account.
- **profile** - As a user I want to be able to check my profile so I can see the events I am involved in
- **events list** - As a user I want to see all the events I've created, the events I'm in and the attended events.
- **Search event** - As i user i want to be able to search events by name so i can find the ones i want to check.
- **events create** - As a user I want to create an event so that I can invite others to attend.
- **events detail** - As a user I want to see the event details with a list of the needed things and another list of participants.
- **search people** - As a user i want to be able to search peolpe to invite to my events.
- **invite to event** - As a user i want to invite friends to my events.
- **confirm** - As a user I want a confirmation of the things I'm bringing to the event.

## Backlog

User profile:
- Upload my profile picture
- See other users profile
- Change password
- Strength password

Geo Location:
- Add geolocation to events when creating
- Show event in a map in event detail page

 Messages
- Add a message box in the event detail page where users can communicate with each other.

 Manipulate lists
- Add/delete items feature for people that is participating in event (apart of creator).

Sign up
- Feature that allows people to sign up using social media.

Notifications
- Alerts feature

Landing page
- Adding a explanation page

## ROUTES:

- GET / 
  - renders the homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form
- POST /auth/signup
  - redirects to /profile/id if user logged in
  - body:
    - username
    - name
    - password
   - validation
- GET /auth/login
  - redirects to /profile/id if user logged in
  - renders the login form
- POST /auth/login
  - redirects to /profile/id if user logged in
  - body:
    - username
    - name
    - password
   - validation
- POST /auth/logout
  - body: (empty)

- GET /events
  - renders / if user is not logged in
  - renders the event list
  
 - GET /events/new
  - renders / if user is not logged in
  - Renders create event form
  
 - POST /events
  - redirects to / if user is anonymous
  - body: 
    - img (backlog)
    - name
    - date
    - location 
    - description
    - list of things
  - validation  
- GET /event/:id
  - renders / if user is not logged in
  - renders the event detail page
  - includes the list of attendees (add/leave option)
  - includes the list of needed things
  - comments (backlog)
  
- GET /event/:id/invite
  - redirects to / if user is not the event owner
  - renders /people 
  - includes a list of users with a checkbox and add button
  
 -POST /event/:id/add
  - renders / if user is not logged in
  - add people to event list
   - body:
    - username-id
  - redirects to /event/:id/add
  
  -POST /event/:id/user/:id
  - redirects to /event/:id
  - body:
    - item
    - quantity


## Models

User model
 
```
username: { type: String,
          required: true
          },
          
name: { type: String,
      required: true
      },
          
password: { type : String,
          required: true
          },
```

Event model

```
owner: ObjectId<User>,
name: { type: String,
       required: true
      },
description:  {type: String},
date: {type: Date,
       default: Date.now
      },
location: {type: String},
attendees: [ObjectId<User>]
toBring: [{
  name: type: String,
  quantity: { type: Number },
  status: { enum: ['taken', 'available']}
  
}]
``` 

## Links

### Trello

[Link to your trello board](https://trello.com) or picture of your physical boar

### Git

The url to your repository and to your deployed project

https://github.com/QuevedoIB/Project-2

https://esplit.herokuapp.com

### Slides

The url to your presentation slides

https://slides.com/adrianaperez-1/deck-1#/

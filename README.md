# Netflix Clone

Hi!
Your assignment is to implement a movie streaming dashboard using TypeScript and React.

### Tasks

- Implement assignment using:
  - Language: **TypeScript**
  - Framework: **React**
- Build out the project to the designs inside the `/Designs` folder
- Connect your application to our Firebase app **(configuration provided in constants folder)**
- Register an account using Firebase Auth (Email & Password provider).
- Login with your account details in order to view the app protected routes.
- Fetch movies data from Cloud Firestore `movies` collection.
- Group `movies` list in Homepage by `genere`.
- Create `genere` route to display only movies from this specific `genere`
- In `genre` route you can search by movie `title` field and you can sort movies ascending and descending by `year`
- Create `/movies/{id}` route to display movie full details.
- A movie can be added to your watchlist
- Create a Firestore document in `watchlist` collection with document id equals to your account `uid`
- Your watchlist should contain an array of movies you've previously added to your watchlist.
- Create `/watchlist/{id}` route where you can check the list of the movies you've previously added.
- Implement logout flow

### Evaluation Criteria

- **TypeScript** and **React** best practices
- We're looking for you to produce working code, with enough room to demonstrate how to structure components in a small program.
- We're looking for you to produce a user friendly UI
- Completeness: did you complete the features?
- Correctness: does the functionality act in sensible, thought-out ways?
- Maintainability: is it written in a clean, maintainable way?

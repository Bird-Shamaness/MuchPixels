[![Build Status](https://travis-ci.org/Bird-Shamaness/MuchPixels.svg?branch=master)](https://travis-ci.org/Bird-Shamaness/MuchPixels) ![Dependencies Status](https://david-dm.org/Bird-Shamaness/MuchPixels.svg) ![devDependencies Status](https://david-dm.org/boennemann/badges/dev-status.svg)

[Hosted here](https://much-pixels.herokuapp.com "much pixels")

 How to start the app locally (Note that the Telerik Academy network does not allow connection to the remote db)
 ----------------
Clone the repository:
 
 ```bash
 # Change directory
 cd Pixels
 
 # Install NPM dependencies
 npm install
 
 # Then start the app
 node app.js or npm start
 
 # Open localhost at port 3000
 ```

## TODO
- Photo schema details (Implement some compression, and extension restriction - to .jpg and .png for example, because .tiff and others are too big.)
  - Likes (Or something similar)
  - Comments 
  - Social Network sharing (Facebook at first)
- User schema
  - Implement profile pic change (The user should be able to change his profile pic)
  - Implement description field 
  - Implement user photos section
- Landing page (With beautiful landing image and links to different sections - Hot, Trending etc, for example)
- Hot page (Where photos with most likes are displayed)
- Trending (Where photos with not so many likes are dislpayed)
- Photo page (Where user can discover photos, and filter them by something, for example tags, location or number of likes) 
- Fix styles of the whole page
- Unit tests
- Chat (optional)

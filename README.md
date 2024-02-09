# EPL-Backend

<img src="https://english.ahram.org.eg/Media/News/2022/9/1/41_2022-637976540286688180-668.jpg" height="500px"/>


## <img align= center width=50px height=50px src="https://user-images.githubusercontent.com/71986226/154075883-2a5679d2-b411-448f-b423-9565babf35aa.gif"> Table of Contents
- <a href ="#Overview">Overview</a>
- <a href ="#Features">Features</a>
- <a href ="#started"> Get Started</a>
- <a href ="#contributors">Contributors</a>
- <a href ="#license">License</a>


## <img align="center"  width =50px  height =40px src="https://em-content.zobj.net/source/animated-noto-color-emoji/356/waving-hand_1f44b.gif"> Overview <a id = "Overview"></a>
This projects is to make an online automated ticket reservation system for football matches in the Egyptian Premier League.

## <img align="center"  width =60px  height =70px src="https://opengameart.org/sites/default/files/gif_3.gif"> Features <a id = "Features"></a>

### Site Administrator:
- Approve new users with specific authorities.
- Remove existing users.

### EFA Managers:
- Create, edit, and manage match events.
- Add new stadiums.
- View match details and seat availability.

### Customers (Fans):
- Edit personal data.
- View match details and vacant seats.
- Reserve vacant seats for future matches.
- Cancel reservations before the event.

### Guests:
- Register a new account.
- Sign in as an existing account.
- View match details.


## <img  align= center width=50px height=50px src="https://cdn.pixabay.com/animation/2022/07/31/06/27/06-27-17-124_512.gif">Get Started <a id = "started"></a>

### Prerequisite
- Node.js
- MongoDB

### Installation
1. Clone the repository
    ```
    $ git clone https://github.com/EPL-Match-Reservation/back-end.git
    ```
2. Navigate to Tazkartii Folder
    ```
    $ cd BACK-END
    ```

### Running
1. Install modules
    ```
    npm install
    ```
2. Create .env.development file and add your environment variables

    - `JWT_SECRET_KEY`: secret key for JWT
    - `DATABASE`: database connection
    - `PORT`: The port of the database like 5432
    - `NODE_ENV`: node environment make it development for development

3. Start program on development mode
    ```
    npm start:dev
    ```

### Built Using
- Express.js
- Mongoose (MongoDB ODM)

<!-- Contributors -->
## <img  align= center width=50px height=50px src="https://media1.giphy.com/media/WFZvB7VIXBgiz3oDXE/giphy.gif?cid=6c09b952tmewuarqtlyfot8t8i0kh6ov6vrypnwdrihlsshb&rid=giphy.gif&ct=s"> Contributors <a id = "contributors"></a>

<!-- Contributors list -->
<table align="center" >
  <tr>
    <td align="center"><a href="https://github.com/Ahmed-H300"><img src="https://avatars.githubusercontent.com/u/67925988?v=4" width="150px;" alt=""/><br /><sub><b>Ahmed Hany</b></sub></a></td>
    <td align="center"><a href="https://github.com/MahmoudRedaSayed" ><img src="https://avatars.githubusercontent.com/u/76118788?v=4" width="150px;" alt=""/><br /><sub><b>Mahmoud Reda</b></sub></a><br />
    <td align="center"><a href="https://github.com/ShazaMohamed"><img src="https://avatars.githubusercontent.com/u/56974730?v=4" width="150px;" alt=""/><br /><sub><b>Shaza Mohamed</b></sub></a><br />
    <td align="center"><a href="https://github.com/BasmaElhoseny01"><img src="https://avatars.githubusercontent.com/u/72309546?v=4" width="150px;" alt=""/><br /><sub><b>Basma Elhoseny</b></sub></a><br /></td>
  </tr>
</table>

## <img  align= center width=50px height=50px src="https://media1.giphy.com/media/ggoKD4cFbqd4nyugH2/giphy.gif?cid=6c09b9527jpi8kfxsj6eswuvb7ay2p0rgv57b7wg0jkihhhv&rid=giphy.gif&ct=s"> License <a id = "license"></a>
This software is licensed under MIT License, See [License](https://github.com/EPL-Match-Reservation/back-end/blob/main/LICENSE) for more information ©Basma Elhoseny.

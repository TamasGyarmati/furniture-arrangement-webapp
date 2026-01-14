# Room Furniture Arrangement App

## Project Description
This application arranges given furniture items within a room so that none of them overlap. The output is presented in a tabular format where each table cell represents 10 cm. For example, if a bed measures 160 cm by 200 cm and is located in a corner, it occupies 16 cells in width and 20 cells in length. These cells are merged, colored with a random color, and labeled with the furniture name, such as "Bed".

## Input
- Room dimensions: width and length (in cm)
- List of furniture items: each with a name, width, and length (in cm)

## Output
- A generated room layout plan showing the furniture arrangement in a grid format

## Technologies Used
- C#, ASP.NET Core
- HTML, CSS, and JavaScript

---

## How to Use

### Backend (ASP.NET Core API)

- cd BACKEND/BackendASP/BackendASP
- dotnet run

The backend runs on port 5090  
The port is configured in Properties/launchSettings.json  
Update the connection string in appsettings.json to match your database

### Frontend (HTML / CSS / JavaScript)

- cd FRONTEND
- python3 -m http.server 5500 or just open it in Live Server (VS Code)

Open in browser:  
http://localhost:5500

---

## Example
If the room is 300 cm wide and 300 cm long, and includes a bed (160x200 cm) and a table (100x120 cm), the app will display a grid with merged cells colored and labeled accordingly, accurately representing their sizes and positions.

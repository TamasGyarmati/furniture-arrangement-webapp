# Room Furniture Arrangement App

## Project Description
This application arranges given furniture items within a room so that none of them overlap. The output is presented in a tabular format where each table cell represents 10 cm. For example, if a bed measures 160 cm by 200 cm and is located in a corner, it occupies 16 cells in width and 20 cells in length. These cells are merged, colored with a random color, and labeled with the furniture name, such as "Bed".

### Input
- Room dimensions: width and length (in cm)
- List of furniture items: each with a name, width, and length (in cm)

### Output
- A generated room layout plan showing the furniture arrangement in a grid format

## Technologies Used
- C#, ASP.NET Core (.NET 8)
- HTML, CSS, and JavaScript
- Docker

---

## How to Use

The entire application (Backend, Frontend, and SQL Server database) can be spun up with a single command using Docker Compose. No local installation of .NET or SQL Server is required.

### Prerequisites

1. Ensure **Docker Desktop** (or Docker Engine + Compose) is installed and running on your machine.
2. Create a `.env` file in the root directory of the project (right next to `docker-compose.yml`) with the following content:

   ```env
   DB_PASSWORD=YourStrong!Passw0rd
   DB_NAME=RoomDb

### Startup

1. Open a terminal in the project root directory (where docker-compose.yml is located).
2. Run the following command to build and start all services in the background `(Frontend: http://localhost:3000)`:

   ```Command
   docker compose up --build -d

---

## Example
If the room is 300 cm wide and 300 cm long, and includes a bed (160x200 cm) and a table (100x120 cm), the app will display a grid with merged cells colored and labeled accordingly, accurately representing their sizes and positions.

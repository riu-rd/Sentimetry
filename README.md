# EMPATHY-S13 PROJECT

### Sentimetry: Harmonizing Emotions, Crafting Clarity

*Navigate your inner landscape, one entry at a time.*

---

## Setup Instructions

### Clone the Repository

To begin, clone the repository using one of the following methods:

- **HTTPS:**
  ```bash
  git clone https://github.com/riu-rd/Sentimetry.git
  ```

- **GitHub CLI:**
  ```bash
  gh repo clone riu-rd/Sentimetry
  ```

---

## Running the Frontend

1. **Download the `.env` file** ([Download Here](https://drive.google.com/file/d/1arjZ6uK7vljD7J8maZV1nO5vm3UbeYwV/view?usp=sharing)) *(Requires DLSU account)*
   - <span style="color:red;"><b>NOTE: The provided .env download link is currently not working anymore!</b></span>

2. **Place the `.env` file** inside the `frontend` directory.

3. **Open your Command Line Interface (CLI)** and navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

4. **Install Dependencies:**

   ```bash
   npm install
   ```

5. **Run the Frontend Application:**

   ```bash
   npm run dev
   ```

   - Open the link provided by your terminal (usually something like `http://localhost:3000`).

6. **Optional Troubleshooting:**

   If you encounter issues running the application, try installing these additional packages:

   ```bash
   npm install firebase -D tailwindcss
   npm run dev
   ```

---

## Running the Backend

1. **Open your Command Line Interface (CLI)** and navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. **Set Up a Python Environment (Python 3.11.10 required):**

   You can choose between two methods:

   - **Using Virtualenv:**

     Create the virtual environment:

     ```bash
     python -m venv venv
     ```

     Activate the environment:

     - **Windows:**

       ```bash
       .\venv\Scripts\activate
       ```

     - **macOS/Linux:**

       ```bash
       source venv/bin/activate
       ```

   - **Using Conda:**

     Create the conda environment:

     ```bash
     conda create --name sentimetry python=3.11.10
     ```

     Activate the conda environment:

     ```bash
     conda activate sentimetry
     ```

3. **Install Backend Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Backend API:**

   ```bash
   python api.py
   ```

   - Wait for the backend to fully initialize. The terminal will indicate successful setup with:

     ```
     INFO:     Application startup complete.
     ```

   - Once complete, access the backend API by navigating to [`http://localhost:8000`](http://localhost:8000) in your web browser.

---

Enjoy harmonizing your emotional clarity with **Sentimetry**!


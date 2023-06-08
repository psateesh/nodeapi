
## Requirements to run the app

For development, you will need following things installed -

1. node - 12.18.0 or higher
2. yarn - package manager
3. Redis - Lightweight Cache DB **(Windows users must have at least version 3.0.504 or above)**
4. Mysql

**ENV** files for the app can be found in the Snippets section of this repository
___

## Cloning and running the app
### 1. Clone the app with HTTPS or SSH

```bash
git clone https://github.com/psateesh/nodeapi.git

Checkout branch -b nodeapi

```
### 2. Download and place the **env** file at the project root
If you are not sure about the environment you need - *local env* file should be fine
### 3. Install Dependencies
```bash
npm install
```
### 4. Start the application

```bash
npm start
```
___

Create DB with user_mgnt
start npm 
Tables (role,user) will created in the DB user_mgnt
Insert some sample users with details (as role_id 1 nd 2) 1 - admin, 2 - user
Run the postman collection



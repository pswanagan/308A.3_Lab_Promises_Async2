// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./databases.js";

async function getUserData(id) {
  const dbs = {
    db1: db1,
    db2: db2,
    db3: db3,
  };

  // Validate the id
  if (id < 1 || id > 10) {
    return Promise.reject(
      "Invalid ID: Please use an ID value between 1 and 10."
    );
  }

  try {
    // Query the central database to determine which user database to access
    const userDb = await central(id);
    if (!dbs[userDb]) {
      return Promise.reject(`Error: Database '${userDb}' not found.`);
    }

    // Get the basic user information from the appropriate database
    let basicInfo;
    try {
      basicInfo = await dbs[userDb](id);
    } catch (error) {
      return Promise.reject(
        `Error accessing database '${userDb}': ${error.message}`
      );
    }

    // Get the personal information from the vault
    let personalInfo;
    try {
      personalInfo = await vault(id);
    } catch (error) {
      return Promise.reject(
        `Error accessing the vault database: ${error.message}`
      );
    }

    // Merge the data and return
    return {
      id,
      ...personalInfo,
      ...basicInfo,
    };
  } catch (error) {
    return Promise.reject(`An error occurred: ${error.message}`);
  }
}
getUserData(1).then((data) => {
  console.log(data);
});

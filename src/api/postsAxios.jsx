import axios from "axios"

// Create a server at the baseURL.
// Then in the CLI start the json-server to run using this url and watch 'data/db.json'
// for changes.
export default axios.create({
    baseURL: 'http://localhost:3500'
});
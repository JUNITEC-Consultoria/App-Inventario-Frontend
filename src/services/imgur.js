import axios from "axios";

const imgur = axios.create({
  baseURL: "https://api.imgur.com/3/image",
  headers: {
    "Content-type": "application/x-www-form-urlencoded",
    Authorization: "Bearer e924c393034ba9c6feedacd106aac3d181982384",
  },
});

export default imgur;

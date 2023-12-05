import dotenv from "dotenv";
dotenv.config();

const { DATABASE_USER, DATABASE_PASSWORD } = process.env;

export const dbConnection = {
  url: `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster0.utkvc4l.mongodb.net/`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

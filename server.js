const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv") // Enables env variables
const Article = require("./models/article")
const articleRouter = require("./routes/articles")
const methodOverride = require("method-override") // Allows "DELETE" and "PUT" as methods
const app = express()

// Define path of .env file
dotenv.config({path:"config.env"})

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected...")
  }).catch(err => {
    console.log(err)
  })

// Defined port value in config.env
const PORT = process.env.PORT||8080

app.set("view engine", "ejs")

// Parses incoming requests, based on body-parser
// Access form params from route using req.body
// Needs to be above routes
app.use(express.urlencoded({ extended: false }))

app.use(methodOverride("_method"))

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" })
  res.render("articles/index", { articles: articles })
})

// Routes from "articleRouter" will be appended to "/articles"
app.use("/articles", articleRouter)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
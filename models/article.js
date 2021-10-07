const mongoose = require("mongoose")
const marked = require("marked") // Converts markdown to HTML
const slugify = require("slugify") // Customize url slug
const createDomPurify = require("dompurify") // Sanitizes HTML to prevent malicious code
const { JSDOM } = require("jsdom") // Required for dompurify
const dompurify = createDomPurify(new JSDOM().window) 

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

// Run func before any validation (save, update, create, delete)
articleSchema.pre("validate", function(next) {
  // Create slug using article title
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  // Convert & sanitize markdown
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  next() // Proceed to next function in list
})

// Model-name and schema
module.exports = mongoose.model("Article", articleSchema)
const swaggerUi = require("swagger-ui-express");
const swaggerJsoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "ELKINDY API",
      version: "1.0.0",
      description: "This swagger doc is for testing auto-generation ",
      contact: {
        email: "omaradouli79@gmail.com"
      }
    },
    servers: [
      { url: "http://localhost:3000" },
      { url: "http://PREPROD" },
<<<<<<< HEAD
      { url: "http://PROD" },
      { url: "http://localhost:3000/api/courses" }
=======
      { url: "http://PROD" }
>>>>>>> 1d2ec6cb46d73e3518cdb4619a40198741863bd7
    ],
    components: {
      schemas: {
        
      }
    },
    tags: [
 
    ]
  },
  apis: ["./routes/*/*.js"]
};

const specs = swaggerJsoc(options);
module.exports = app => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
};

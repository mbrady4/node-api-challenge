const express = require("express");

const Projects = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  Projects.get()
    .then((allProjects) => res.status(200).json(allProjects))
    .catch(() =>
      res.status(500).json({ error: "An internal server error occured." })
    );
});

router.get("/:id", validateProjectID, (req, res) => {
  Projects.get(req.params.id)
    .then((project) => res.status(200).json(project))
    .catch(() =>
      res.status(500).json({ error: "An internal server error occurred." })
    );
});

router.post("/", validateProject, (req, res) => {
  const projectObj = {
    name: req.body.name,
    description: req.body.description,
  };
  Projects.insert(projectObj)
    .then((newProject) => res.status(201).json(newProject))
    .catch(() =>
      res.status(500).json({ error: "An internal error occurred." })
    );
});

router.put("/:id", validateProjectID, (req, res) => {
  const projectObj = {};
  if (req.body.name !== undefined) {
    projectObj.name = req.body.name;
  }
  if (req.body.description !== undefined) {
    projectObj.description = req.body.description;
  }
  if (req.body.completed !== undefined) {
    projectObj.completed = req.body.completed;
  }
  Projects.update(req.params.id, projectObj)
    .then((updatedProject) => {
      res.status(201).json(updatedProject);
    })
    .catch(() =>
      res.status(500).json({
        error: "An internal server error occured while updating the project",
      })
    );
});

router.delete("/:id", validateProjectID, (req, res) => {
  Projects.remove(req.params.id)
    .then((count) => {
      if (count === 1) {
        res.status(201).json({
          message: `Successfully removed project with id ${req.params.id}`,
        });
      } else {
        res.status(400).json({
          message: "The ID presented did not correspond to a project to delete",
        });
      }
    })
    .catch(() =>
      res.status(500).json({ message: "an internal server error occured." })
    );
});

router.get("/:id/actions", validateProjectID, (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then((projectActions) => {
      res.status(200).json(projectActions);
    })
    .catch(() =>
      res.status(500).json({
        error: "An internal server error occured while retrieving the user.",
      })
    );
});

function validateProjectID(req, res, next) {
  console.log("Validate Project ID Activated");
  Projects.get(req.params.id)
    .then((project) => {
      if (project === null) {
        res
          .status(404)
          .json({ error: "A project with the provided ID does not exist." });
      } else {
        next();
      }
    })
    .catch(() =>
      res.status(500).json({ error: "An internal error server occured." })
    );
}

function validateProject(req, res, next) {
  console.log("Validating Project");
  const name = req.body.name;
  const description = req.body.description;
  if ((name === undefined) | (description === undefined)) {
    res
      .status(400)
      .json({error: "Please provide all required fields: name and description"});
  } else {
    next();
  }
}

module.exports = router;

const express = require("express");

const Actions = require("../data/helpers/actionModel");
const Projects = require("../data/helpers/projectModel");

const router = express.Router();

// get all actions in database
router.get("/", (req, res) => {
  Actions.get()
    .then((allActions) => res.status(200).json(allActions))
    .catch(() =>
      res.status(500).json({ message: "An internal error occurred." })
    );
});

// get a specific action based on action id
router.get("/:id", validateActionID, (req, res) => {
  Actions.get(req.params.id)
    .then((action) => res.status(200).json(action))
    .catch(() =>
      res.status(500).json({ message: "An internal error occurred." })
    );
});

// add an action based on body (description, project_id) and optionally notes, completed
router.post("/", validateAction, validatedProjectID, (req, res) => {
  const actionObj = {
    project_id: parseInt(req.body.project_id),
    description: req.body.description,
    notes: req.body.notes,
  };
  if (req.body.completed !== undefined) {
    actionObj.completed = req.body.completed;
  }
  console.log(actionObj);
  Actions.insert(actionObj)
    .then((newAction) => res.status(201).json(newAction))
    .catch(() =>
      res.status(500).json({ error: "An internal error occurred." })
    );
});

// modify an action based on body (action_id required) and some combination of description, notes, completed, project_id
router.put("/:id", validateActionID, validatedProjectID, (req, res) => {
  const actionObj = {};
  if (req.body.project_id !== undefined) {
    actionObj.project_id = req.body.project_id;
  }
  if (req.body.description !== undefined) {
    actionObj.description = req.body.description;
  }
  if (req.body.completed !== undefined) {
    actionObj.completed = req.body.completed;
  }
  if (req.body.notes !== undefined) {
    actionObj.notes = req.body.notes;
  }
  Actions.update(req.params.id, actionObj)
    .then((updatedAction) => {
      res.status(201).json(updatedAction);
    })
    .catch(() =>
      res.status(500).json({
        error: "An internal server error occurred while updating the action",
      })
    );
});

// delete an action based on action id
router.delete("/:id", validateActionID, (req, res) => {
  Actions.remove(req.params.id)
    .then((count) => {
      if (count === 1) {
        res.status(201).json({
          message: `Successfully removed action with id ${req.params.id}`,
        });
      } else {
        res.status(400).json({
          message: "The ID presented did not correspond to a action to delete",
        });
      }
    })
    .catch(() =>
      res.status(500).json({ message: "an internal server error occured." })
    );
});


function validateActionID(req, res, next) {
  console.log("Validate Action ID activated");
  Actions.get(req.params.id)
    .then((action) => {
      if (action === null) {
        res
          .status(400)
          .json({ error: "An action with the provided ID does not exist." });
      } else {
        next();
      }
    })
    .catch(() => {
      res.status(500).json({ error: "An internal server error occurred." });
    });
}

function validatedProjectID(req, res, next) {
  if (req.body.project_id !== undefined) {
    Projects.get(req.body.project_id)
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
  } else {
    next();
  }
}

function validateAction(req, res, next) {
  const project_id = req.body.project_id;
  const description = req.body.description;
  const notes = req.body.notes;
  if (
    (project_id === undefined) |
    (description === undefined) |
    (notes === undefined)
  ) {
    res.status(400).json({
      error:
        "Please provide all requires fields: project_id, description, and notes",
    });
  } else {
    next();
  }
}

module.exports = router;

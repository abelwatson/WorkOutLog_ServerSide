const Express = require("express");
const router = Express.Router();
const validateJWT = require("../middleware/validate-jwt");

const { Log } = require("../models");

/*
==========
LogCreate
==========
*/
router.post("/", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await Log.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    Log.create(logEntry)

});

/*
=============
Get all Logs
=============
*/

router.get("/", async (req, res) => {
    try {
        const entries = await Log.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
====================
Get Logs by User
====================
*/
router.get("/:id", validateJWT, async (req,res) => {
    const { id } = req.user;
    try {
        const userLogs = await Log.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/*
============
Update a Log
============
*/
router.put("/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner_id: userId,
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result,
    };

    try {
        const update = await Log.update(updatedLog, query);
        res.status(200).json(`Log Was Updated`)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/*
================
Delete a Journal
================
*/
router.delete("/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId,
            }
        }

    await Log.destroy(query);
    res.status(200).json({ message: "Log Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
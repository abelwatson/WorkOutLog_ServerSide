const router = require("express").Router();
const { User } = require("../models");

router.post('/create', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const NewUser = await User.create({
            username,
            password: bcrypt.hashSync(password, 13)
        })
        
        let token = jwt.sign(
            { id : NewUser.id }, 
            'Hello I am a secret', 
            { expiresIn : 60 * 60 * 24 }
        );
        
        res.status(201).json({
            NewUser,
            message: "User successfully created!",
            token
        })
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const LoggedInUser = await User.findOne({
            where: {
                username: username
            } 
        })
        
        if (LoggedInUser) {

            let passwordComparison = await bcrypt.compare(password, LoggedInUser.password);

            if (passwordComparison) {

                let token = jwt.sign({id: LoggedInUser.id}, 'Hello I am a secret', {
                    expiresIn: 60 * 60 * 24
                });
    
                res.status(200).json({
                    LoggedInUser,
                    message: "User successfully logged in!",
                    token: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect username or password"
                })
            }

        } else {
            res.status(401).json({
                message: 'Incorrect username or password'
            });
        }
    } catch (error) {
        res.status(500).json({ error })
    }
});

module.exports = router;
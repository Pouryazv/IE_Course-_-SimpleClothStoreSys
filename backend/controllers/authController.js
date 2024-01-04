const User = require('../schemas/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    return token;
};

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).send({ message: 'User already exists' });
        }

        user = new User({ username, password });
        await user.save();

        const token = generateAuthToken(user);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const token = generateAuthToken(user);
        res.send({ user, token });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

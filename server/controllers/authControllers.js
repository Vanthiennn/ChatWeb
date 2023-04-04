
const User = require("../model/userModel");
const bcrypt = require('bcrypt');

// Login
const login = async (req, res) => {
   
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.json({ message: "Wrong email or password. Please try again!", status: false })
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.json({ message: "Incorrect Email or Password", status: false });
        delete user.password;
        // return res.json({ status: true, user });
        return res.status(200).json({  status: true, user })
    } catch (error) {
       
    }
}


// Register 
const register = async (req, res) => {

    try {
        const { username, password, email } = req.body
        const emailCheck = await User.findOne({ email })
        if (emailCheck) return res.json({ message: "Email already used", status: false });
        const hassPwd = await bcrypt.hash(password, 10)
        const newUser = new User({
            username: username,
            password: hassPwd,
            email: email
        })
        delete newUser.password
        await newUser.save();
        return res.status(200).json({ status: true, newUser })
    } catch (err) {
        
    }
}


module.exports = { login, register }
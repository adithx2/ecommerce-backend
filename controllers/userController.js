const User = require('../models/userSchema')
const generateToken = require('../utils/generateToken')

const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {

    try {

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not allowed" });
        }

        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {

        res.status(500).json({ message: 'Error fetching users' })

    }
}

const createUser = async (req, res) => {

    try {

        const { email, password, name, role } = req.body

        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, async (err, hash) => {

            if (err) {

                res.status(500).json({ error: err.message })
            }
            var userItems = {

                name: name,
                email: email,
                password: hash,
                role: role
            }

            const user = new User(userItems)
            await user.save()
            res.status(201).json({ user: User, message: "User created" })
        })


    } catch (error) {

        res.status(500).json({ message: error.message })


    }
}

const userID = async (req, res) => {

    try {

        const { id } = req.params

        // if (req.user.role !== 'admin' && req.user._id !== id) {
        //     return res.status(403).json({ message: "Not allowed" });
        // }

        if (req.user.role !== 'admin' && req.user.id.toString() !== req.params.id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        const user = await User.findById(id).select("-password")
        if (!user) {
            return res.status(404).json({

                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user: user,
            message: "User fetched succesfully"

        })
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message
        })


    }
}


const deleteUser = async (req, res) => {

    try {

        const { id } = req.params

        if (req.user.role !== 'admin' && req.user._id !== id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        // if (req.user.role !== 'admin' && req.user.id.toString() !== req.params.id.toString()) {
        //     return res.status(403).json({ message: "Not allowed" });
        // }

        const data = await User.findByIdAndDelete(id)

        if (!data) {

            return res.status(404).json({

                success: false,
                message: "User not found"
            })

        }

        return res.status(200).json({

            success: true,
            message: "User deleted successfully"
        })



    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
            message: "Failed to delete user"
        })


    }
}


const updateUser = async (req, res) => {

    try {

        const { id } = req.params

        // if (req.user.role !== 'admin' && req.user._id !== id) {
        //     return res.status(403).json({ message: "Not allowed" });
        // }

        if (req.user.role !== 'admin' && req.user.id.toString() !== req.params.id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        const data = req.body

        const update = await User.findByIdAndUpdate(
            id, data, {
            new: true,
            runValidators: true
        })

        if (!update) {

            return res.status(404).json({

                success: false,
                message: "User not found"
            })

        }

        return res.status(201).json({

            success: true,
            user: update,
            message: "User updated successfully"
        })



    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
            message: "Failed to update user"
        })


    }
}

const login = async (req, res) => {

    try {

        if (!req.body) {

            return res.status(400).json({ error: "Login deatils cannot be empty" })
        }

        const { email, password } = req.body

        if ((!email) || (!password)) {

            return res.status(400).json({ error: "Email password are required " })
        }

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        // Password validation will change later

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {

            return res.status(404).json({ message: "Invalid Password" })
        }

        console.log(isValid)

        // User is autheticated , create token

        let payload = { id: user._id, name: user.name, email: user.email, role: user.role };
        const token = generateToken(payload)
        res.cookie("token", token)
        res.status(200).json({
            message: "Login successful",

            token: token,
            user: payload
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

const checkUser = async (req, res) => {

    return res.status(200).json({ message: "User validate" })
}

const logout = (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed", error: error.message });
    }
};


module.exports = { getUsers, createUser, userID, deleteUser, login, checkUser, logout, updateUser }

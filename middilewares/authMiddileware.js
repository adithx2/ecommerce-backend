const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {

    let token = null

    console.log("Cookies :", req.cookies)

    // Check cookie

    if (req.cookies?.token) {

        token = req.cookies.token

    }

    // Check autherization header

    else if (req.headers.authorization?.startsWith("Bearer")) {

        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {

        return res.status(401).json({ message: "Not authorized" })

    }

    // Validate token

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded.payload
        next()

    } catch (error) {

        return res.status(400).json({ message: "Invalid token" })
    }

}

// admin only access

const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Admin access only" });
    }
};

module.exports = { validateToken, admin }


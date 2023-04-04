const User = require('../model/userModel')

const getAllUser = async (req, res) => {
   
    try {
        const users = await User.find({ _id: { $ne: req.params._id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ])
        return res.status(200).json(users)
    } catch (err) {
      
    }
}

const setAvatar = async (req, res) => {
    try {
      
        const userId = req.params.id
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { new: true }
        )
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    } catch (err) {
      
    }
}

module.exports = { getAllUser, setAvatar }
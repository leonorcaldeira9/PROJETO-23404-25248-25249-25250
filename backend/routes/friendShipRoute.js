const express = require('express');
const router = express.Router();

const {
    getFriendshipStatus,
    getFriendsByUser,
    createFriendRequest,
    updateFriendshipStatus,
    deleteFriendship
} = require('../controllers/friendshipController');
const authJWT = require("../middlewares/authJWT");

/*router.get('/status/:userId/:friendId', authJWT(), getFriendshipStatus);*/

router.get('/status/:friendId', authJWT(), getFriendshipStatus);

router.get('/user/:id', authJWT(), getFriendsByUser);

router.post('/request', authJWT(), createFriendRequest);

router.put('/update', authJWT(), updateFriendshipStatus);

/*router.delete('/delete/:userId/:friendId', authJWT(), deleteFriendship);*/
router.delete('/delete/:id', authJWT(), deleteFriendship);

module.exports = router;
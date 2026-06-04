const FriendshipModel = require('../models/FriendshipModel');

const getFriendshipStatus = (req, res) => {
    /*const { userId, friendId } = req.params;
    if (userId === undefined || friendId === undefined) return res.status(400).send();*/

    const userId = req.user.id;
    const { friendId } = req.params;

    if (!friendId) {
        return res.status(400).json({ error: "Friend ID is required." });
    }

    if (userId === parseInt(friendId)) {
        return res.status(400).json({ error: "You can't verify the state of your friendship with yourself." });
    }

    FriendshipModel.getFriendshipStatus(userId, friendId, (err, status) => {
        if (err) {
            return res.status(500).json({ error: "Error when searching for friendship status." });
        }

        if (status.length === 0) {
            return res.status(200).json({ status: "none" });
        }

        return res.status(200).json(status[0]);
    });
};

const getFriendsByUser = (req, res) => {
    const  userId  = req.params.id;
    /*if (userId === undefined) return res.status(400).send("Este erro nao é fixe");*/

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    FriendshipModel.getFriendsByUser(userId, (err, friends) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the friends list in the database." });
        }

        return res.status(200).json(friends);
    });
};

const getFriendsRequests = (req, res) => {
    const idLoggedInUser = req.user.id;

    FriendshipModel.getPendingRequests(idLoggedInUser, (err, requests) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for pending friend requests." });
        }

        return res.status(200).json(requests);
    });
}

const createFriendRequest = (req, res) => {
    /*const { userId, friendId } = req.body;
    if (!userId || !friendId) return res.status(400).send();*/

    const  userId  = req.user.id;
    const { friendId } = req.body;

    if (!friendId) {
        return res.status(400).json({ error: "Friend ID is required." });
    }

    if (userId === parseInt(friendId)) {
        return res.status(400).json({ error: "You can't send a friend request to yourself." });
    }

    FriendshipModel.createFriendRequest(userId, friendId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating request. The user may not exist or the request has already been sent." });
        }
        return res.status(201).json({ message: "Friend request sent successfully." });
    });
};

const updateFriendshipStatus = (req, res) => {

    /*const { userId, friendId, friendshipStatus } = req.body;
    if (!userId || !friendId || !friendshipStatus) return res.status(400).send("Este erro ao update status");*/

    //const userId = req.user.id;
    const userWithRequestId = req.user.id;
    const { friendId, friendshipStatus } = req.body;

    if (!friendId || !friendshipStatus) {
        return res.status(400).json({ error: "The friend's ID and friendship status are required." });
    }

    if (userWithRequestId === parseInt(friendId)) {
        return res.status(400).json({ error: "You cannot change the state of your friendship with yourself." });
    }

    FriendshipModel.updateFriendshipStatus(friendId, userWithRequestId, friendshipStatus, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error updating friendship status." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Friendship request not found." });
        }

        return res.status(200).json({ message: `Friendship status updated to ${friendshipStatus}.` });
    });
};

const deleteFriendship = (req, res) => {
    /*const { userId, friendId } = req.params;
    if (!userId || !friendId) return res.status(400).send();*/

    const userId = req.user.id;
    const friendId = req.params.id;

    if (!friendId) {
        return res.status(400).json({ error: "The friend's ID id required." });
    }

    if (userId === parseInt(friendId)) {
        return res.status(400).json({ error: "You can't erase a friendship with yourself." });
    }

    FriendshipModel.deleteFriendship(userId, friendId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting friendship." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Friendship or friendship request not found." });
        }

        return res.status(200).json({ message: "Friendship or request deleted successfully." });
    });
};

module.exports = {
    getFriendshipStatus,
    getFriendsByUser,
    createFriendRequest,
    updateFriendshipStatus,
    deleteFriendship,
    getFriendsRequests
};
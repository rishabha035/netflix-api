const User = require("../models/UserModel");

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);

    if (user) {
      return res.status(200).json({ message: "Success", movies: user.likedMovies });
    } else {
      return res.status(404).json({ message: "User with given email not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movies." });
  }
};

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await getUserByEmail(email);

    if (user) {
      const movieAlreadyLiked = user.likedMovies.find(({ id }) => id === data.id);

      if (!movieAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            $push: { likedMovies: data },
          },
          { new: true }
        );
        return res.status(200).json({ message: "Movie successfully added to liked list." });
      } else {
        return res.status(400).json({ message: "Movie already added to the liked list." });
      }
    } else {
      await User.create({ email, likedMovies: [data] });
      return res.status(200).json({ message: "Movie successfully added to liked list." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding movie to the liked list" });
  }
};

module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await getUserByEmail(email);

    if (user) {
      const updatedMovies = user.likedMovies.filter(({ id }) => id !== movieId);

      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: updatedMovies,
        },
        { new: true }
      );

      return res.status(200).json({ message: "Movie successfully removed.", movies: updatedMovies });
    } else {
      return res.status(404).json({ message: "User with given email not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error removing movie from the liked list" });
  }
};

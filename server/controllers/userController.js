import { clerkClient } from "@clerk/express";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";

export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;

    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    const currentFavorites = user.privateMetadata.favorites || [];

    let updatedFavorites;
    if (!currentFavorites.includes(movieId)) {
      updatedFavorites = [...currentFavorites, movieId];
    } else {
      updatedFavorites = currentFavorites.filter((id) => id !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { favorites: updatedFavorites },
    });

    res.json({ success: true, message: "Favorite Movie Updated." });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getFavorite = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId)
    const favorites = user.privateMetadata.favorites;

    const movies = await Movie.find({_id:{$in: favorites}})

    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

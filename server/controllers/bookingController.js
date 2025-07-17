import Show from "../models/show.js"
import Booking from "../models/booking.js"
import stripe from 'stripe'

// Function to check seat availability
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};

    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log("Seat availability error:", error.message);
    return false;
  }
};

// ✅ FIXED: Added (req, res)
export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const {origin}= req.headers;

    if (!showId || !selectedSeats?.length) {
      return res.status(400).json({ success: false, message: "Missing showId or seats" });
    }

    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({ success: false, message: "Selected seats are not available." });
    }

    const showData = await Show.findById(showId).populate("movie");
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    // Mark selected seats as occupied
    if (!showData.occupiedSeats || typeof showData.occupiedSeats !== "object") {
      showData.occupiedSeats = {};
    }
    selectedSeats.forEach(seat => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    //stripe gateway initialized
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

    //creting line item to for stripe
    const line_items =[{
      price_data:{
        currency:'usd',
        product_data:{
          name: showData.movie.title
        },
        unit_amount : Math.floor(booking.amount)*100
      },
      quantity:1
    }]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url:`${origin}/my-bookings`,
      line_items: line_items,
      mode :'payment',
      metadata:{
        bookingId:booking._id.toString()
      },
      expires_at:Math.floor(Date.now()/1000)+30*60, //expires in 30 minutes
      
    })
    booking.paymentLink = session.url
    await booking.save()

    return res.json({ success: true,url:session.url})

  } catch (error) {
    console.error("createBooking error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ FIXED: Added (req, res)
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);
    const occupiedSeats = Object.keys(showData.occupiedSeats || {});

    return res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.error("getOccupiedSeats error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

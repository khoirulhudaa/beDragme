const Feedback = require('../models/feedback');

const getFeedback = async() => {
    try {
        const feedback = await Feedback.find();
        return res.json({ feedback });
      } catch (error) {
        return res.json({ message: error, status: 500 });
      }
}

const createFeedback = async(req, res) => {
    const { username, feedback } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) return res.json({ message: 'You should login!', status: 404 });
        
        const feedbackResponse = new Feedback({ username, feedback  });
        await feedbackResponse.save();
        return res.json({feedbackResponse, status: 201});

  } catch (error) {
    return res.json({ message: error, status: 500 });
  }
}

module.exports = {
    getFeedback,
    createFeedback
}
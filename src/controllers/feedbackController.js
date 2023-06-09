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
    const { feedback } = req.body;
    try {
        const feedbackResponse = new Feedback({ feedback  });
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
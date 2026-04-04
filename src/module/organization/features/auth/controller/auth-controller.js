// login

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email

    //check if user does not exists

    if(0){
      return res.status(404).json({ message: 'User not found' });
    }

      // Check if password is correct

    if(0){
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token


    // Return token and user info
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
      
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}
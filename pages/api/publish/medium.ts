// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Request = {
  title: string,
  content: string,
  tags: string,
  mediumApiKey: string,
}

const MEDIUM_URL = `https://api.medium.com`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const { title, content, tags, mediumApiKey } = req.body as Request;

  // Validate required parameters
  if (!title || !content || !tags || !mediumApiKey) {
    res.status(400).json({
      error: 'Missing required parameters'
    });
    return;
  }

  try {

    // Fetch user profile

    const response = await axios.get(MEDIUM_URL + "/v1/me", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + mediumApiKey
      }
    });

    const userId = response.data.data.id;

    // Publish post to user's account

    const publishResponse = await axios.post(MEDIUM_URL + "/v1/users/" + userId + "/posts", {
      title: title,
      contentFormat: "markdown",
      content: content,
      tags: tags.split(",").filter((tag) => tag.trim().length > 0)
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + mediumApiKey
      }
    });

    res.status(200).json({ url: publishResponse.data.data.url });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Error publishing to Medium'
    });
    return;
  }


}

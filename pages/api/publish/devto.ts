// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Request = {
  title: string,
  content: string,
  tags: string,
  devToApiKey: string,
  coverImage: string, series: string
}

const DEV_TO_URL = `https://dev.to/api/articles`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const { title, content, tags, devToApiKey, coverImage, series } = req.body as Request;

  // Validate required parameters
  if (!title || !content || !tags || !devToApiKey) {
    res.status(400).json({
      message: 'Missing required parameters'
    });
    return;
  }

  try {
    const response = await axios.post(DEV_TO_URL, {
      article: {
        title,
        published: true,
        body_markdown: content,
        tags: tags.split(",").filter((tag) => tag.trim().length > 0),
        main_image: coverImage,
        series: series
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': devToApiKey
      }
    });

    console.log(response.data);

    res.status(200).json({ url: response.data.url });

  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      error: 'Error publishing to Dev.to',
      message: err.response.data.error
    });
    return;
  }


}
